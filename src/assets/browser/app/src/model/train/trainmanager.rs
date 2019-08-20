/* The trainmanager is responsible for creating and deleting TRAINS.
 * A train represents all the leafs prepared at some scale.
 * 
 * The COMPOSITOR updates the train manager as to the current stick,
 * position, zoom, etc, for it to decide which trains are needed,
 * and provides a tick for animations. This class provides, in return,
 * a list of current trains to the compositor that it might provide such
 * info to the trains themselves.
 * 
 * The PRINTER uses the trainmanager to get a list of leafs to actually
 * render.
 */

use std::sync::{ Arc, Mutex };

use composit::{ Leaf, Stick, Scale, StateManager };
use controller::output::Report;
use data::XferConsumer;
use model::driver::PrinterManager;
use model::item::{ DeliveredItem, ItemUnpacker };
use model::supply::Product;
use super::{ Train, TrainId, TrainContext, TravellerCreator };

const MS_FADE : f64 = 200.;

pub struct TrainManagerImpl {
    printer: PrinterManager,
    traveller_creator: TravellerCreator,
    /* the trains themselves */
    current_train: Option<Train>,
    future_train: Option<Train>,
    transition_train: Option<Train>,
    /* progress of transition */
    transition_start: Option<f64>,
    transition_prop: Option<f64>, 
    /* current position/scale */
    desired_stick: Option<Stick>,
    bp_per_screen: Option<f64>,
    position_bp: Option<f64>,
    desired_context: TrainContext
}

impl TrainManagerImpl {
    pub fn new(printer: &PrinterManager, traveller_creator: &TravellerCreator) -> TrainManagerImpl {
        TrainManagerImpl {
            printer: printer.clone(),
            traveller_creator: traveller_creator.clone(),
            current_train: None,
            future_train: None,
            transition_train: None,
            transition_start: None,
            transition_prop: None, 
            bp_per_screen: None,
            position_bp: None,
            desired_stick: None,
            desired_context: TrainContext::new(&None)
        }
    }
    
    pub fn update_report(&self, report: &Report) {
        // XXX: TOO SOON!
        if let Some(ref stick) = self.desired_stick {
            report.set_status("a-stick",&stick.get_name());
            report.set_status("i-stick",&stick.get_name());
        }
    }
        
    /* utility: makes new train at given scale */
    fn make_train(&mut self, scale: &Scale) -> Option<Train> {
        if let (Some(stick),Some(bp),Some(pos)) = (self.desired_stick.as_ref(),self.bp_per_screen,self.position_bp) {
            let mut f = Train::new(&self.printer,&stick,scale,&self.desired_context);
            f.set_bp_per_screen(bp);
            f.set_position(pos);
            f.manage_carriages(&mut self.traveller_creator);
            Some(f)
        } else {
            None
        }
    }

    /* COMPOSITOR sets new stick. Existing trains useless */
    pub fn set_desired_stick(&mut self, st: &Stick) -> bool {
        if let Some(ref old) = self.desired_stick {
            if st == old { return false; }
        }
        self.desired_stick = Some(st.clone());
        self.position_bp = None;
        self.bp_per_screen = None;
        self.maybe_change_trains();
        true
    }

    pub fn get_desired_stick(&self) -> &Option<Stick> { &self.desired_stick }
    
    /* ********************************************************
     * Methods used by COMPOSITOR via ticks to run transitions.
     * ********************************************************
     */
    
    /* if there's a transition and it's reached endstop it is current */
    fn transition_maybe_done(&mut self, t: f64) {
        if let Some(start) = self.transition_start {
            if t-start < MS_FADE {
                self.transition_prop = Some((t-start)/MS_FADE);
            } else {
                bb_log!("trainmanager","transition done {:?}",self.transition_train.as_ref().map(|x| x.get_train_id().clone()));
                self.current_train = self.transition_train.take();
                self.transition_start = None;
                self.transition_prop = None;
            }
        }
    }
        
    /* if there is a future train and it is done, move to transition */
    fn future_ready(&mut self, t: f64) {
        if self.desired_stick.is_none() || self.bp_per_screen.is_none() || self.position_bp.is_none() { return; }
        /* is it ready? */
        let mut ready = false;
        if let Some(ref mut future_train) = self.future_train {
            if future_train.check_done() {
                future_train.set_needs_refresh();
                ready = true;
            }
        }
        /* if future ready, transition empty, start one */
        if ready && self.transition_train.is_none() {
            bb_log!("trainmanager","future train is transitioning {:?}",self.future_train.as_ref().map(|x| x.get_train_id().clone()));
            self.transition_train = self.future_train.take();
            self.transition_start = Some(t);
            self.transition_prop = Some(0.);
        }
    }
    
    /* called regularly by compositor to let us perform transitions */
    pub fn tick(&mut self, t: f64) {
        self.each_train(|t| { t.check_done(); });
        self.transition_maybe_done(t);
        self.future_ready(t);
    }

    fn each_train<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut Train) {
        if let Some(ref mut current_train) = self.current_train {
            cb(current_train);
        }
        if let Some(ref mut transition_train) = self.transition_train {
            cb(transition_train);
        }
        if let Some(ref mut future_train) = self.future_train {
            cb(future_train);
        }
    }

    fn each_relevant_train<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut Train) {
        if self.desired_stick.is_none() { return; }
        let desired_stick = self.desired_stick.as_ref().unwrap();
        if let Some(ref mut current_train) = self.current_train {
            if desired_stick == current_train.get_train_id().get_stick() {
                cb(current_train);
            }
        }
        if let Some(ref mut transition_train) = self.transition_train {
            if desired_stick == transition_train.get_train_id().get_stick() {
                cb(transition_train);
            }
        }
        if let Some(ref mut future_train) = self.future_train {
            if desired_stick == future_train.get_train_id().get_stick() {
                cb(future_train);
            }
        }
    }

    fn best_train<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut Train) {
        if let Some(ref mut future_train) = self.future_train {
            cb(future_train);
        } else if let Some(ref mut transition_train) = self.transition_train {
            cb(transition_train);
        } else if let Some(ref mut current_train) = self.current_train {
            cb(current_train);
        }
    }
    
    pub fn manage_carriages(&mut self) {
        let mut tc = self.traveller_creator.clone();
        self.each_train(|train| train.manage_carriages(&mut tc));
    }

    pub fn add_component(&mut self, product: &mut Product) {
        let mut tc = self.traveller_creator.clone();
        self.each_train(|train| train.add_component(&mut tc,product));
    }

    /* ***********************************************************
     * Methods used to manage future creation/destruction based on
     * indicated current bp/screen from COMPOSITOR
     * ***********************************************************
     */
    
    /* current (or soon and inevitable) printing train. */
    fn printing_train_id(&self) -> Option<&TrainId> {
        if let Some(ref transition_train) = self.transition_train {
            Some(transition_train.get_train_id())
        } else if let Some(ref current_train) = self.current_train {
            Some(current_train.get_train_id())
        } else {
            None
        }
    }

    /* current (or soon and inevitable) focus object */
    fn printing_context(&self) -> &TrainContext {
        if let Some(ref transition_train) = self.transition_train {
            transition_train.get_train_id().get_context()
        } else if let Some(ref current_train) = self.current_train {
            current_train.get_train_id().get_context()
        } else {
            &self.desired_context
        }
    }

    /* Create future train */
    fn new_future(&mut self, scale: &Scale) {
        if let Some(ref mut t) = self.future_train {
            t.set_active(false);
        }
        self.future_train = self.make_train(scale);
        bb_log!("trainmanager","Creating future train {:?}",self.future_train.as_ref().map(|x| x.get_train_id()));
        self.future_train.as_mut().unwrap().set_active(true);
    }
    
    /* Abandon future train */
    fn end_future(&mut self) {
        if let Some(ref mut t) = self.future_train {
            bb_log!("trainmanager","Abandoning future train {:?}",t.get_train_id());
            t.set_active(false);
        }
        self.future_train = None;
    }

    /* scale may have changed significantly to change trains */
    fn maybe_change_trains(&mut self) {
        if self.desired_stick.is_none() || self.bp_per_screen.is_none() || self.position_bp.is_none() { return; }
        let mut end_future = false;
        let mut new_future = false;
        let best_scale = Scale::best_for_screen(unwrap!(self.bp_per_screen));
        if let Some(printing_train) = self.printing_train_id() {
            if best_scale != *printing_train.get_scale() || 
               unwrap!(self.desired_stick.as_ref()) != printing_train.get_stick() ||
               self.printing_context() != &self.desired_context {
                /* we're not currently showing the optimal scale */
                if let Some(ref mut future_train) = self.future_train {
                    /* there's a future train ... */
                    if best_scale != *future_train.get_train_id().get_scale() ||
                       self.desired_context != *future_train.get_train_id().get_context() ||
                       unwrap!(self.desired_stick.as_ref()) != future_train.get_train_id().get_stick() {
                        /* ... and that's not optimal either */
                        end_future = true;
                        new_future = true;
                       } /* else that's optimal, so leave it to it */
                } else {
                    /* there's no future, we need one */
                    new_future = true;
                }
            } else if self.future_train.is_some() {
                /* Future exists, but current is fine. Abandon future */
                end_future = true;
            }
            /* do anything that needs to be done */
        } else {
            /* we're not pringint anything yet: let's do it */
            end_future = true;
            new_future = true;
        }
        if end_future { self.end_future(); }
        if new_future { self.new_future(&best_scale); }
    }

    /* compositor notifies of bp/screen update (change trains?) */
    pub fn set_bp_per_screen(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = Some(bp_per_screen);
        self.maybe_change_trains();
        self.each_relevant_train(|t| t.set_bp_per_screen(bp_per_screen));
    }
            
    /* compositor notifies of position update */
    pub fn set_position(&mut self, position_bp: f64) {
        self.position_bp = Some(position_bp);
        self.each_relevant_train(|t| t.set_position(position_bp));
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.each_train(|t| t.update_state(oom));
    }

    pub fn get_desired_context(&self) -> &TrainContext { &self.desired_context }

    pub fn set_desired_context(&mut self, context: &TrainContext) {
        console!("focus change to {:?}",context);
        self.desired_context = context.clone();
        self.maybe_change_trains();
    }
    
    /* ***************************************************************
     * Methods used by PRINTER to actually retrieve data for printing.
     * ***************************************************************
     */
    
    /* used by printer to set opacity */
    pub fn get_prop_trans(&self) -> f32 {
        self.transition_prop.unwrap_or(0.) as f32
    }
    
    /* used by printer for actual printing */
    pub fn with_current_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        if let Some(ref mut train) = self.current_train {
            cb(train)
        }
    }

    /* used by printer for actual printing */
    pub fn with_transition_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        if let Some(ref mut train) = self.transition_train {
            cb(train)
        }
    }
}

impl XferConsumer for TrainManagerImpl {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        self.each_train(|train| train.consume(item,unpacker));
    }
}

#[derive(Clone)]
pub struct TrainManager(Arc<Mutex<TrainManagerImpl>>);

impl TrainManager {
    pub fn new(printer: &PrinterManager, traveller_creator: &TravellerCreator) -> TrainManager {
        TrainManager(Arc::new(Mutex::new(TrainManagerImpl::new(printer,traveller_creator))))
    }
    
    pub fn update_report(&self, report: &Report) {
        self.0.lock().unwrap().update_report(report);
    }
        
    pub fn set_desired_stick(&mut self, st: &Stick) -> bool {
        self.0.lock().unwrap().set_desired_stick(st)
    }

    pub fn get_desired_stick(&mut self) -> Option<Stick> {
        self.0.lock().unwrap().get_desired_stick().clone()
    }

    pub fn tick(&mut self, t: f64,) {
        self.0.lock().unwrap().tick(t);
    }
    
    pub fn manage_carriages(&mut self) {
        self.0.lock().unwrap().manage_carriages();
    }

    pub fn add_component(&mut self, product: &mut Product) {
        self.0.lock().unwrap().add_component(product);
    }

    pub fn set_bp_per_screen(&mut self, bp_per_screen: f64) {
        self.0.lock().unwrap().set_bp_per_screen(bp_per_screen);
    }
            
    pub fn set_position(&mut self, position_bp: f64) {
        self.0.lock().unwrap().set_position(position_bp);
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.0.lock().unwrap().update_state(oom);
    }

    pub fn get_desired_context(&self) -> TrainContext {
        self.0.lock().unwrap().get_desired_context().clone()
    }

    pub fn set_desired_context(&mut self, context: &TrainContext) {
        self.0.lock().unwrap().set_desired_context(context);
    }
        
    pub fn get_prop_trans(&self) -> f32 {
        self.0.lock().unwrap().get_prop_trans()
    }
    
    pub fn with_current_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        self.0.lock().unwrap().with_current_train(cb)
    }

    pub fn with_transition_train<F>(&mut self, mut cb: F) where F: FnMut(&mut Train) {
        self.0.lock().unwrap().with_transition_train(cb)
    }
}

impl XferConsumer for TrainManager {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        self.0.lock().unwrap().consume(item,unpacker);
    }
}
