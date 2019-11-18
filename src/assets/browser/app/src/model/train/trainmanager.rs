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

use hashbrown::HashSet;
use owning_ref::{ MutexGuardRef, MutexGuardRefMut };
use std::sync::{ Arc, Mutex };

use composit::{ Stick, Scale, StateManager };
use controller::animate::TrainManagerTransition;
use controller::output::{ Report, ViewportReport };
use data::{ Locator, XferConsumer };
use model::driver::PrinterManager;
use model::item::{ DeliveredItem, ItemUnpacker };
use model::stage::{ Position, Screen };
use model::supply::Product;
use model::zmenu::{ ZMenuIntersection, ZMenuRegistry, ZMenuLeafSet };
use super::{ Train, TrainId, FocusObjectId, TravellerCreator };
use super::desired::Desired;
use types::{ Dot, DOWN, AsyncValue, Awaiting };

const AT_POSITION_NEAR_ENOUGH : f64 = 1.;
const AT_ZOOM_NEAR_ENOUGH : f64 = 2.;

pub struct TrainSet {
    current_train: Option<Train>,
    future_train: Option<Train>,
    transition_train: Option<Train>
}

impl TrainSet {
    pub fn current(&self) -> &Option<Train> { &self.current_train }
    pub fn transition(&self) -> &Option<Train> { &self.transition_train }
    pub(super) fn current_mut(&mut self) -> &mut Option<Train> { &mut self.current_train }
    pub(super) fn transition_mut(&mut self) -> &mut Option<Train> { &mut self.transition_train }

    fn make_transition_current(&mut self) {
        bb_log!("trainmanager","transition done {:?}",self.transition_train.as_ref().map(|x| x.get_train_id().clone()));
        self.current_train = self.transition_train.take();
    }

    fn make_future_transition(&mut self) {
        self.transition_train = self.future_train.take();
    }

    fn end_future(&mut self) {
        if let Some(ref mut t) = self.future_train {
            bb_log!("trainmanager","Abandoning future train {:?}",t.get_train_id());
            t.set_active(false);
        }
        self.future_train = None;
    }

    fn new_future(&mut self, train: Train) {
        if let Some(ref mut t) = self.future_train {
            t.set_active(false);
        }
        self.future_train = Some(train);
        bb_log!("trainmanager","Creating future train {:?}",self.future_train.as_ref().map(|x| x.get_train_id()));
        self.future_train.as_mut().unwrap().set_active(true);
    }

}

pub struct TrainManagerImpl {
    printer: PrinterManager,
    traveller_creator: TravellerCreator,
    /* the trains themselves */
    trainset: TrainSet,
    /* progress of transition */
    transition: TrainManagerTransition,
    /* zmenus */
    zmr: ZMenuRegistry,
    /* current position/scale */
    desired: Desired,
    focus_stick: AsyncValue<Option<Stick>>,
    focus_location: AsyncValue<Option<(f64,f64)>>,
    pending_focus_jump: Awaiting<String,(Stick,f64,f64)>
}

impl TrainManagerImpl {
    pub fn new(printer: &PrinterManager, traveller_creator: &TravellerCreator) -> TrainManagerImpl {
        TrainManagerImpl {
            printer: printer.clone(),
            traveller_creator: traveller_creator.clone(),
            trainset: TrainSet {
                current_train: None,
                future_train: None,
                transition_train: None
            },
            transition: TrainManagerTransition::new(),
            desired: Desired::new(),
            focus_stick: AsyncValue::new(Some(None)),
            focus_location: AsyncValue::new(Some(None)),
            pending_focus_jump: Awaiting::new(),
            zmr: ZMenuRegistry::new()
        }
    }
    
    pub fn update_report(&self, report: &Report) {
        // XXX: TOO SOON!
        if self.desired.is_ready() {
            let stick = self.desired.get_stick();
            report.set_status("i-stick",&stick.get_name());
        }
        let mut at_focus = false;
        if let (Some(Some(focus_stick)),Some(Some(focus_location))) = (self.focus_stick.get(),self.focus_location.get()) {
            if self.desired.is_ready() {
                let desired_position = self.desired.get_position();
                let desired_position = (desired_position.get_middle().0,desired_position.get_screen_in_bp());
                let delta = (desired_position.0-focus_location.0,desired_position.1-focus_location.1);
                if self.desired.get_stick() == focus_stick && delta.0.abs() < AT_POSITION_NEAR_ENOUGH && delta.1.abs() < AT_ZOOM_NEAR_ENOUGH {
                    at_focus = true;
                }
            }
        }
        report.set_status_bool("is-focus-position",at_focus);
    }
        
    /* utility: makes new train at given scale */
    fn make_train(&mut self, train_id: &TrainId) -> Train {
        let mut f = Train::new(&self.printer,&train_id,&self.desired.get_position());
        f.manage_carriages(&mut self.traveller_creator);
        f
    }

    /* COMPOSITOR sets new stick. Existing trains useless */
    pub fn set_desired_stick(&mut self, st: &Stick) -> bool {
        if self.desired.is_ready() && st == self.desired.get_stick() {
            return false
        }
        self.desired.set_stick(st);
        self.maybe_change_trains();
        true
    }

    pub fn get_desired_stick(&self) -> Option<&Stick> { 
        match self.desired.is_ready() {
            true => Some(self.desired.get_stick()),
            false => None
        }
    }
    
    pub fn inform_screen_size(&mut self, screen_size: &Dot<f64,f64>) {
        self.desired.inform_screen_size(screen_size);
        self.maybe_change_trains();
        self.each_train(|t|
            t.get_position_mut().inform_screen_size(screen_size)
        );
    }

    /* ********************************************************
     * Methods used by COMPOSITOR via ticks to run transitions.
     * ********************************************************
     */
    
    /* if there's a transition and it's reached endstop it is current */
    fn transition_maybe_done(&mut self, t: f64) {
        self.transition.update(t);
        if let Some(train) = self.trainset.transition() {
            if train.get_prop() >= 1. {
                self.trainset.make_transition_current();
                self.transition.reset();
            }
        }
        let prop = self.transition.get_prop();
        if let Some(train) = self.trainset.transition_mut() {
            train.set_prop(prop.get_prop_up());
        }
        if let Some(train) = self.trainset.current_mut() {
            train.set_prop(prop.get_prop_down());
        }
    }
        
    /* if there is a future train and it is done, move to transition */
    fn future_ready(&mut self, t: f64) {
        if !self.desired.is_ready() { return; }
        /* is it ready? */
        let mut ready = false;
        if let Some(ref mut future_train) = self.trainset.future_train {
            if future_train.check_done() {
                future_train.set_needs_refresh();
                ready = true;
            }
        }
        /* if future ready, transition empty, start one */
        if ready && self.trainset.transition_train.is_none() {
            bb_log!("trainmanager","future train is transitioning {:?}",self.trainset.future_train.as_ref().map(|x| x.get_train_id().clone()));
            self.trainset.make_future_transition();
            let mut slow = false;
            if let (Some(transition_train),Some(current_train)) = (self.trainset.transition_train.as_ref(),self.trainset.current_train.as_ref()) {
                if transition_train.get_train_id().get_stick() != current_train.get_train_id().get_stick() {
                    slow = true;
                }
            }
            console!("starting transition");
            self.transition.start(t,slow);
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
        if let Some(ref mut current_train) = self.trainset.current_train {
            cb(current_train);
        }
        if let Some(ref mut transition_train) = self.trainset.transition_train {
            cb(transition_train);
        }
        if let Some(ref mut future_train) = self.trainset.future_train {
            cb(future_train);
        }
    }

    fn each_relevant_train<F>(&mut self, mut cb: F)
                                  where F: FnMut(&mut Train) {
        if !self.desired.is_ready() { return; }
        let desired_stick = self.desired.get_stick().clone();
        self.each_train(|train| {
            if desired_stick == *train.get_train_id().get_stick() {
                cb(train);
            }
        });
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
    fn printing_train(&self) -> Option<&Train> {
        if let Some(ref transition_train) = self.trainset.transition_train {
            Some(transition_train)
        } else if let Some(ref current_train) = self.trainset.current_train {
            Some(current_train)
        } else {
            None
        }
    }
    
    /* scale may have changed significantly to change trains */
    fn maybe_change_trains(&mut self) {
        if !self.desired.is_ready() || self.focus_stick.get().is_none() { return; }
        let mut end_future = false;
        let mut new_future = false;
        if let Some(desired_future_train_id) = self.desired.get_train_id() {
            /* we want to go or stay /somewhere/, at least! */
            if let Some(printing_train) = self.printing_train() {
                if *printing_train.get_train_id() != desired_future_train_id {
                    /* we're not currently actually showing the optimal train */
                    if let Some(ref future_train) = self.trainset.future_train {
                        /* there's a future train ... */
                        if *future_train.get_train_id() != desired_future_train_id {
                            /* ... and that's not optimal either */
                            end_future = true;
                            new_future = true;
                        } /* else that's optimal, so leave it to it */
                    } else {
                        /* there's no future, we need one */
                        new_future = true;
                    }
                } else if self.trainset.future_train.is_some() {
                    /* Future exists, but current is fine. Abandon future */
                    end_future = true;
                }
                /* do anything that needs to be done */
            } else {
                /* we're not printing anything yet */
                if let Some(ref future_train) = self.trainset.future_train {
                    if *future_train.get_train_id() != desired_future_train_id {
                        end_future = true;
                        new_future = true;
                    }
                } else {
                    new_future = true;
                }
            }
            if end_future { self.trainset.end_future(); }
            if new_future {
                let train = self.make_train(&desired_future_train_id);
                self.trainset.new_future(train);
            }
        }
    }

    /* compositor notifies of bp/screen update (change trains?) */
    pub fn set_bp_per_screen(&mut self, bp_per_screen: f64) {
        self.desired.set_bp_per_screen(bp_per_screen);
        self.maybe_change_trains();
        self.each_relevant_train(|t| t.get_position_mut().set_screen_in_bp(bp_per_screen));
    }
            
    /* compositor notifies of position update */
    pub fn set_middle(&mut self, middle: Dot<f64,f64>) {
        self.desired.set_middle(middle);
        self.maybe_change_trains();
        self.each_relevant_train(|t| t.get_position_mut().set_middle(&middle));
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.each_train(|t| t.update_state(oom));
    }

    pub fn get_desired_position(&self) -> Option<Position> {
        match self.desired.is_ready() {
            true => Some(self.desired.get_position().clone()),
            false => None
        }
    }

    fn investigate_focus_location(&mut self) -> bool { 
        self.focus_stick.investigate() || self.focus_location.investigate()
    }

    pub fn set_desired_focus_object_id(&mut self, context: &FocusObjectId) {
        if context.get_focus() != self.desired.get_focus_object_id().get_focus() {
            if context.get_focus().is_some() {
                self.focus_stick.invalidate();
                self.focus_location.invalidate();
            } else {
                self.focus_stick = AsyncValue::new(Some(None));
                self.focus_location = AsyncValue::new(Some(None));
            }
        }
        console!("focus change to {:?}",context);
        self.desired.set_focus_object_id(context.clone());
        self.maybe_change_trains();
    }
    
    pub fn jump_to_focus_object(&mut self) {
        if let Some(focus_object) = self.desired.get_focus_object_id().get_focus() {
            self.pending_focus_jump.await(focus_object.to_string());
            self.maybe_satisfy_pending_jump();
        }
    }

    pub fn intersects(&self, screen: &Screen, pos: Dot<i32,i32>) -> HashSet<ZMenuIntersection> {
        if let Some(train) = self.printing_train() {
            self.zmr.intersects(screen,train.get_position(),pos)
        } else {
            HashSet::new()
        }
    }

    pub fn add_zmenus(&mut self, zmls: ZMenuLeafSet) {
        self.zmr.add_leafset(zmls);
    }


    /* ***************************************************************
     * Methods used by PRINTER to actually retrieve data for printing.
     * ***************************************************************
     */
    
    pub fn get_trainset(&self) -> &TrainSet {
        &self.trainset
    }

    pub fn settle(&mut self) {
        self.each_train(|t| t.get_position_mut().settle());
    }

    pub fn set_bottom(&mut self, max_y: f64) {
        self.desired.set_bottom(max_y);
        self.maybe_change_trains();
        self.each_train(|t| t.get_position_mut().set_limit(&DOWN,max_y));
    }

    pub fn update_reports(&self, report: &Report) {
        if let Some(train) = self.printing_train() {
            let stick = train.get_train_id().get_stick();
            report.set_status("a-stick",&stick.get_name());
            train.get_position().update_reports(report);
        }
    }

    pub fn update_viewport_report(&self, report: &ViewportReport) {
        if let Some(train) = self.printing_train() {
            train.get_position().update_viewport_report(report);
        }
    }

    fn maybe_satisfy_pending_jump(&mut self) {
        if let (Some(Some(stick)),Some(Some((middle,zoom)))) = (self.focus_stick.get(),self.focus_location.get()) {
            if let Some(focus_object) = self.desired.get_focus_object_id().get_focus() {
                self.pending_focus_jump.notify(focus_object.to_string(),(stick.clone(),*middle,*zoom));
            }
        }
    }

    pub fn set_focus_location(&mut self, _obj: &str, stick: &Stick, middle: f64, zoom: f64) {
        self.focus_stick.set(Some(stick.clone()));
        self.focus_location.set(Some((middle,zoom)));
        self.maybe_satisfy_pending_jump();
    }

    fn pull_pending_focus_jump(&mut self) -> Option<(Stick,f64,f64)> {
        let value : Option<(Stick,f64,f64)> = self.pending_focus_jump.get().cloned().clone();
        if let Some(v) = value {
            self.pending_focus_jump = Awaiting::new();
            Some(v.clone())
        } else {
            None
        }
    }
}

impl XferConsumer for TrainManagerImpl {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        self.each_train(|train| train.consume(item,unpacker));
    }
}

#[derive(Clone)]
pub struct TrainManager(Arc<Mutex<TrainManagerImpl>>,Locator);

impl TrainManager {
    pub fn new(printer: &PrinterManager, traveller_creator: &TravellerCreator, locator: &Locator) -> TrainManager {
        TrainManager(Arc::new(Mutex::new(TrainManagerImpl::new(printer,traveller_creator))),locator.clone())
    }
    
    pub fn update_report(&self, report: &Report) {
        self.0.lock().unwrap().update_report(report);
    }

    pub fn pull_pending_focus_jump(&mut self) -> Option<(Stick,f64,f64)> {
        ok!(self.0.lock()).pull_pending_focus_jump()
    }

    pub fn set_desired_stick(&mut self, st: &Stick) -> bool {
        self.0.lock().unwrap().set_desired_stick(st)
    }

    pub fn get_desired_stick(&mut self) -> Option<Stick> {
        self.0.lock().unwrap().get_desired_stick().cloned()
    }

    pub fn tick(&mut self, t: f64) {
        let mut imp = self.0.lock().unwrap();
        imp.tick(t);
        /* Do we need to schedule finding the focus location? */
        if imp.investigate_focus_location() {
            if let Some(focus_object) = imp.desired.get_focus_object_id().get_focus() {
                let other = self.clone();
                let inner_focus_object = focus_object.clone();
                self.1.locate(&focus_object,Box::new(move |_,stick,middle,zoom| {
                    let mut imp = other.0.lock().unwrap();
                    imp.set_focus_location(&inner_focus_object,stick,middle,zoom);
                }));
            }
        }
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
            
    pub fn set_middle(&mut self, middle: Dot<f64,f64>) {
        self.0.lock().unwrap().set_middle(middle);
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.0.lock().unwrap().update_state(oom);
    }

    pub fn get_desired_focus_object_id(&self) -> FocusObjectId {
        self.0.lock().unwrap().desired.get_focus_object_id().clone()
    }

    pub fn set_desired_focus_object_id(&mut self, focus_object_id: &FocusObjectId) {
        self.0.lock().unwrap().set_desired_focus_object_id(focus_object_id);
    }
        
    fn get_impl_ref<'ret>(&'ret self) -> MutexGuardRef<'ret,TrainManagerImpl> {
        MutexGuardRef::new(self.0.lock().unwrap())
    }

    fn get_impl_mut<'ret>(&'ret mut self) -> MutexGuardRefMut<'ret,TrainManagerImpl> {
        MutexGuardRefMut::new(self.0.lock().unwrap())
    }

    pub fn get_trainset<'ret>(&'ret self) -> MutexGuardRef<'ret,TrainManagerImpl,TrainSet> {
        self.get_impl_ref().map(|imp| imp.get_trainset())
    }

    pub fn inform_screen_size(&mut self, screen_size: &Dot<f64,f64>) {
        ok!(self.0.lock()).inform_screen_size(screen_size)
    }

    pub fn settle(&mut self) {
        ok!(self.0.lock()).settle();
    }

    pub fn set_bottom(&mut self, max_y: f64) {
        ok!(self.0.lock()).set_bottom(max_y);
    }

    pub fn get_desired_position(&self) -> Option<Position> {
        ok!(self.0.lock()).get_desired_position()
    }

    pub fn intersects(&self, screen: &Screen, pos: Dot<i32,i32>) -> HashSet<ZMenuIntersection> {
        ok!(self.0.lock()).intersects(screen,pos)
    }

    pub fn add_zmenus(&mut self, zms: ZMenuLeafSet) {
        self.get_impl_mut().add_zmenus(zms);
    }

    pub fn update_reports(&self, report: &Report) {
        ok!(self.0.lock()).update_reports(report);
    }

    pub fn update_viewport_report(&self, report: &ViewportReport) {
        ok!(self.0.lock()).update_viewport_report(report);
    }

    pub fn jump_to_focus_object(&mut self) {
        ok!(self.0.lock()).jump_to_focus_object();
    }
}

impl XferConsumer for TrainManager {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        self.0.lock().unwrap().consume(item,unpacker);
    }
}
