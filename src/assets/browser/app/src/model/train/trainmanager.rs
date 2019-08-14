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
use super::{ Train, TravellerCreator };

const MS_FADE : f64 = 100.;

pub struct TrainManagerImpl {
    printer: PrinterManager,
    /* the trains themselves */
    current_train: Option<Train>,
    future_train: Option<Train>,
    transition_train: Option<Train>,
    /* progress of transition */
    transition_start: Option<f64>,
    transition_prop: Option<f64>, 
    /* current position/scale */
    stick: Option<Stick>,
    bp_per_screen: f64,
    position_bp: f64,
    focus: Option<String>
}

impl TrainManagerImpl {
    pub fn new(printer: &PrinterManager) -> TrainManagerImpl {
        TrainManagerImpl {
            printer: printer.clone(),
            current_train: None,
            future_train: None,
            transition_train: None,
            transition_start: None,
            transition_prop: None, 
            bp_per_screen: 1.,
            position_bp: 0.,
            stick: None,
            focus: None
        }
    }
    
    pub fn update_report(&self, report: &Report) {
        if let Some(ref stick) = self.stick {
            report.set_status("a-stick",&stick.get_name());
        }
    }
        
    /* utility: makes new train at given scale */
    fn make_train(&mut self, cm: &mut TravellerCreator, scale: &Scale) -> Option<Train> {
        if let Some(ref stick) = self.stick {
            let mut f = Train::new(&self.printer,&stick,scale,&self.focus);
            f.set_position(self.position_bp);
            f.set_zoom(self.bp_per_screen);
            f.manage_leafs(cm);
            Some(f)
        } else {
            None
        }
    }
    
    pub fn get_stick(&self) -> &Option<Stick> { &self.stick }

    /* COMPOSITOR sets new stick. Existing trains useless */
    pub fn set_stick(&mut self, st: &Stick, bp_per_screen: f64) {
        // XXX not the right thing to do: should transition
        self.stick = Some(st.clone());
        self.bp_per_screen = bp_per_screen;
        let scale = Scale::best_for_screen(bp_per_screen);
        self.each_train(|x| x.set_active(false));
        self.current_train = Some(Train::new(&self.printer,st,&scale,&self.focus));
        self.current_train.as_mut().unwrap().set_zoom(bp_per_screen);
        self.transition_train = None;
        self.future_train = None;
        self.current_train.as_mut().unwrap().set_active(true);
    }
    
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
                self.current_train = self.transition_train.take();
                self.transition_start = None;
                self.transition_prop = None;
            }
        }
    }
        
    /* if there is a future train and it is done, move to transition */
    fn future_ready(&mut self, cm: &mut TravellerCreator, t: f64) {
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
            self.transition_train = self.future_train.take();
            self.transition_start = Some(t);
            self.transition_prop = Some(0.);
            let scale = self.transition_train.as_ref().unwrap().get_train_id().get_scale().clone();
            console!("transition to {:?} {:?}",scale,self.transition_train.as_ref().unwrap().get_train_id());
        }
    }
    
    /* called regularly by compositor to let us perform transitions */
    pub fn tick(&mut self, t: f64, cm: &mut TravellerCreator) {
        self.each_train(|t| { t.check_done(); });
        self.transition_maybe_done(t);
        self.future_ready(cm,t);
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
    
    pub fn manage_leafs(&mut self, tc: &mut TravellerCreator) {
        self.best_train(|train| train.manage_leafs(tc));
    }

    pub fn add_component(&mut self, cm: &mut TravellerCreator, product: &mut Product) {
        self.each_train(|train| train.add_component(cm,product));
    }

    /* ***********************************************************
     * Methods used to manage future creation/destruction based on
     * indicated current bp/screen from COMPOSITOR
     * ***********************************************************
     */
    
    /* current (or soon and inevitable) printing vscale. */
    fn printing_vscale(&self) -> Option<Scale> {
        if let Some(ref transition_train) = self.transition_train {
            Some(transition_train.get_train_id().get_scale().clone())
        } else if let Some(ref current_train) = self.current_train {
            Some(current_train.get_train_id().get_scale().clone())
        } else {
            None
        }
    }

    /* current (or soon and inevitable) focus object */
    fn printing_focus(&self) -> Option<String> {
        if let Some(ref transition_train) = self.transition_train {
            transition_train.get_train_id().get_focus().clone()
        } else if let Some(ref current_train) = self.current_train {
            current_train.get_train_id().get_focus().clone()
        } else {
            None
        }
    }

    /* Create future train */
    fn new_future(&mut self, cm: &mut TravellerCreator, scale: &Scale) {
        if let Some(ref mut t) = self.future_train {
            t.set_active(false);
        }
        self.future_train = self.make_train(cm,scale);
        self.future_train.as_mut().unwrap().set_active(true);
    }
    
    /* Abandon future train */
    fn end_future(&mut self) {
        if let Some(ref mut t) = self.future_train {
            t.set_active(false);
        }
        self.future_train = None;
    }

    /* scale may have changed significantly to change trains */
    fn maybe_change_trains(&mut self, cm: &mut TravellerCreator, bp_per_screen: f64) {
        if let Some(printing_vscale) = self.printing_vscale() {
            let best = Scale::best_for_screen(bp_per_screen);
            let mut end_future = false;
            let mut new_future = false;
            if best != printing_vscale || self.printing_focus() != self.focus {
                /* we're not currently showing the optimal scale */
                if let Some(ref mut future_train) = self.future_train {
                    /* there's a future train ... */
                    if best != *future_train.get_train_id().get_scale() || self.focus != *future_train.get_train_id().get_focus() {
                        /* ... and that's not optimal either */
                        end_future = true;
                        new_future = true;
                    }
                } else {
                    /* there's no future, we need one */
                    new_future = true;
                }
            } else if self.future_train.is_some() {
                /* Future exists, but current is fine. Abandon future */
                end_future = true;
            }
            /* do anything that needs to be done */
            if end_future { self.end_future(); }
            if new_future { self.new_future(cm,&best); }
        }
    }

    /* compositor notifies of bp/screen update (change trains?) */
    pub fn set_zoom(&mut self, cm: &mut TravellerCreator, bp_per_screen: f64) {
        self.bp_per_screen = bp_per_screen;
        self.maybe_change_trains(cm,bp_per_screen);
        self.each_train(|t| t.set_zoom(bp_per_screen));
    }
            
    /* compositor notifies of position update */
    pub fn set_position(&mut self, position_bp: f64) {
        self.position_bp = position_bp;
        self.each_train(|t| t.set_position(position_bp));
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.each_train(|t| t.update_state(oom));
    }

    pub fn change_focus(&mut self, cm: &mut TravellerCreator, id: &str) {
        self.focus = Some(id.to_string());
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
    pub fn new(printer: &PrinterManager) -> TrainManager {
        TrainManager(Arc::new(Mutex::new(TrainManagerImpl::new(printer))))
    }
    
    pub fn update_report(&self, report: &Report) {
        self.0.lock().unwrap().update_report(report);
    }
        
    pub fn get_stick(&self) -> Option<Stick> {
         self.0.lock().unwrap().get_stick().clone()
    }

    pub fn set_stick(&mut self, st: &Stick, bp_per_screen: f64) {
        self.0.lock().unwrap().set_stick(st,bp_per_screen);
    }

    pub fn tick(&mut self, t: f64, cm: &mut TravellerCreator) {
        self.0.lock().unwrap().tick(t,cm);
    }
    
    pub fn manage_leafs(&mut self, tc: &mut TravellerCreator) {
        self.0.lock().unwrap().best_train(|train| train.manage_leafs(tc));
    }

    pub fn add_component(&mut self, cm: &mut TravellerCreator, product: &mut Product) {
        self.0.lock().unwrap().add_component(cm,product);
    }

    pub fn set_zoom(&mut self, cm: &mut TravellerCreator, bp_per_screen: f64) {
        self.0.lock().unwrap().set_zoom(cm,bp_per_screen);
    }
            
    pub fn set_position(&mut self, position_bp: f64) {
        self.0.lock().unwrap().set_position(position_bp);
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.0.lock().unwrap().update_state(oom);
    }

    pub fn change_focus(&mut self, cm: &mut TravellerCreator, id: &str) {
        self.0.lock().unwrap().change_focus(cm,id);
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
