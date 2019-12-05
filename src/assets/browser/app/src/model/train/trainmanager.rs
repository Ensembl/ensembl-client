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
use controller::animate::{ ActionAnimator, animate_fade, animate_jump_to };
use controller::global::App;
use controller::input::Action;
use controller::output::{ OutputAction, Report, ViewportReport };
use data::{ Locator, XferConsumer };
use model::driver::PrinterManager;
use model::focus::{ FocusObject, ObjectLocation, FocusObjectId };
use model::item::{ DeliveredItem, ItemUnpacker };
use model::stage::{ Position, Screen, Viewpoint, ViewpointFragment };
use model::supply::Product;
use model::zmenu::{ ZMenuIntersection, ZMenuRegistry, ZMenuLeafSet };
use super::{ Train, TrainId, TravellerCreator };
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
        bb_log!("trainmanager","future train is transitioning {:?}",self.future_train.as_ref().map(|x| x.get_train_id().clone()));
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
    trainset: TrainSet,
    zmr: ZMenuRegistry,
    target: ViewpointFragment,
    animation_request: Option<(Stick,FocusObjectId,f64,f64)>
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
            target: ViewpointFragment::new_empty(),
            zmr: ZMenuRegistry::new(),
            animation_request: None
        }
    }
    
    pub fn update_report(&self, report: &Report) {
        let mut at_focus = false;
        if let ObjectLocation::Location(focus_stick,focus_middle,focus_zoom) = self.focus_object.get_location() {
            if let Some(viewpoint) = self.target.get_viewpoint() {
                let desired_position = viewpoint.get_position();
                let desired_position = (desired_position.get_x_pos(),desired_position.get_screen_in_bp());
                let delta = (desired_position.0-focus_middle,desired_position.1-focus_zoom);
                if viewpoint.get_position().get_stick() == focus_stick && delta.0.abs() < AT_POSITION_NEAR_ENOUGH && delta.1.abs() < AT_ZOOM_NEAR_ENOUGH {
                    at_focus = true;
                }
            }
        }
        report.set_status_bool("is-focus-position",at_focus);
    }
        
    fn make_train(&mut self, train_id: &TrainId) -> Train {
        // XXX trains should take viewpoints
        let viewpoint = self.target.get_viewpoint().unwrap();
        let mut f = Train::new(&self.printer,&train_id,&viewpoint.get_position());
        f.manage_carriages(&mut self.traveller_creator);
        f
    }

    pub fn set_desired_stick(&mut self, st: &Stick, screen: &mut Screen) -> bool {
        let new_target = self.target.merge(&ViewpointFragment::new_stick(st));
        if new_target == self.target { return false; }
        self.target = new_target;
        self.target = self.target.merge(&ViewpointFragment::new_stick(st));
        self.maybe_change_trains();
        true
    }

    pub fn get_desired_stick(&self) -> Option<Stick> {
        self.target.get_viewpoint().map(|v| v.get_position().get_stick().clone())
    }
    
    /* ********************************************************
     * Methods used by COMPOSITOR via ticks to run transitions.
     * ********************************************************
     */
    
    fn set_opacity(&mut self, prop: f64, transition: bool) {
        let mut trainset = &mut self.trainset;
        let mut train = if transition { trainset.transition_mut() } else { trainset.current_mut() };
        if let Some(train) = train.as_mut() {
            train.set_prop(prop);
        }
    }
    
    fn transition_complete(&mut self) {
        self.trainset.make_transition_current();
    }

    fn transition_is_done(&mut self) -> bool {
        if let Some(train) = self.trainset.transition() {
            if train.get_prop() >= 1. {
                return true;
            }
        }
        false
    }

    /* if there is a future train and it is done, move to transition */
    fn future_ready(&mut self, app: &mut App, t: f64) {
        if !self.target.get_viewpoint().is_some() { return; }
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
            self.trainset.make_future_transition();
            let mut slow = false;
            if let (Some(transition_train),Some(current_train)) = (self.trainset.transition_train.as_ref(),self.trainset.current_train.as_ref()) {
                if transition_train.get_train_id().get_stick() != current_train.get_train_id().get_stick() {
                    slow = true;
                }
            }
            animate_fade(app,!slow);
        }
    }
    
    /* called regularly by compositor to let us perform transitions */
    pub fn tick(&mut self, app: &mut App, t: f64) {
        self.each_train(|t| { t.check_done(); });
        self.future_ready(app,t);
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
        if let Some(viewpoint) = self.target.get_viewpoint() {
            let desired_stick = viewpoint.get_position().get_stick();
            self.each_train(|train| {
                if desired_stick == train.get_train_id().get_stick() {
                    cb(train);
                }
            });
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
    fn printing_train(&self) -> Option<&Train> {
        if let Some(ref transition_train) = self.trainset.transition_train {
            Some(transition_train)
        } else if let Some(ref current_train) = self.trainset.current_train {
            Some(current_train)
        } else {
            None
        }
    }

    fn target_train_id(&self) -> Option<TrainId> {
        self.target.get_viewpoint().map(|v| {
            let pos = v.get_position();
            let scale = Scale::best_for_screen(pos.get_screen_in_bp());
            TrainId::new(pos.get_stick(),&scale,&v.get_focus_object_id())
        })
    }

    /* scale may have changed significantly to change trains */
    fn maybe_change_trains(&mut self) {
        if let Some(desired_future_train_id) = self.target_train_id() {
            let mut end_future = false;
            let mut new_future = false;
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
        self.target = self.target.merge(&ViewpointFragment::new_zoom(bp_per_screen));
        self.maybe_change_trains();
        self.each_relevant_train(|t| {
            let mut pos = t.get_position().new_with_screen_bp(bp_per_screen);
            *t.get_position_mut() = pos;
        });
    }
            
    /* compositor notifies of position update */
    pub fn set_middle(&mut self, middle: f64) {
        self.target = self.target.merge(&ViewpointFragment::new_middle(middle));
        self.maybe_change_trains();
        self.each_relevant_train(|t| {
            let mut pos = t.get_position().new_with_middle(middle);
            *t.get_position_mut() = pos;
        });
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.each_train(|t| t.update_state(oom));
    }

    pub fn get_desired_position(&self) -> Option<Position> {
        self.target.get_viewpoint().map(|v| v.get_position().clone())
    }

    pub fn get_desired_focus_object_id(&self) -> Option<FocusObjectId> {
        self.target.get_viewpoint().map(|v| v.get_focus_object_id().clone())
    }

    pub fn set_desired_focus_object_id(&mut self, context: &FocusObjectId) {
        if context != self.focus_object.get_id() {
            self.focus_object = FocusObject::new(context);
            self.target = self.target.merge(&ViewpointFragment::new_focus_object(context));
            self.maybe_change_trains();
        }
    }
    
    pub fn jump_to_focus_object(&mut self, animator: &mut ActionAnimator, screen: &Screen) {
        if let Some(viewpoint) = self.target.get_viewpoint() {
            if let Some(focus_object) = viewpoint.get_focus_object_id().get_focus() {
                self.try_to_queue_animation(animator,screen);
            }
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
    }

    pub fn update_reports(&self, screen: &Screen, report: &Report) {
        if let Some(train) = self.printing_train() {
            let stick = train.get_train_id().get_stick();
            report.set_status("a-stick",&stick.get_name());
            train.get_position().update_reports(screen,report);
        }
    }

    pub fn update_viewport_report(&self, screen: &Screen, report: &ViewportReport) {
        if let Some(train) = self.printing_train() {
            train.get_position().update_viewport_report(screen,report);
        }
    }

    fn try_to_queue_animation(&mut self, animator: &mut ActionAnimator, screen: &Screen) {
        if let ObjectLocation::Location(stick,middle,zoom) = self.focus_object.get_location() {
            let focus = self.focus_object.get_id();
            self.animation_request = Some((stick.clone(),focus.clone(),*middle,*zoom));
            self.try_to_animate(animator,screen);
        }
    }

    fn try_to_animate(&mut self, animator: &mut ActionAnimator, screen: &Screen) {
        if let Some((ref stick,ref focus,ref middle,ref zoom)) = self.animation_request {
            let src_stick = self.get_desired_stick();
            let src_pos = self.get_desired_position();
            animate_jump_to(&src_stick.clone(),&src_pos,animator,&stick.get_name(),*middle,*zoom,screen);
            self.animation_request = None;
        }
    }

    pub fn set_focus_location(&mut self, animator: &mut ActionAnimator, screen: &Screen, _obj: &str, stick: &Stick, middle: f64, zoom: f64) {
        self.focus_object.set_location(&ObjectLocation::Location(stick.clone(),middle,zoom));
        self.try_to_queue_animation(animator,screen);
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

    pub fn set_desired_stick(&mut self, st: &Stick, screen: &mut Screen) -> bool {
        self.0.lock().unwrap().set_desired_stick(st,screen)
    }

    pub fn get_desired_stick(&self) -> Option<Stick> {
        self.0.lock().unwrap().get_desired_stick().clone()
    }

    pub fn tick(&mut self, app: &mut App, t: f64) {
        let mut animator = app.get_window().get_animator().clone();
        let mut imp = self.0.lock().unwrap();
        imp.tick(app,t);
        /* Do we need to schedule finding the focus location? */
        if imp.focus_object.maybe_investigate() {
            if let Some(viewpoint) = imp.target.get_viewpoint() {
                if let Some(focus_object) = viewpoint.get_focus_object_id().get_focus() {
                    let other = self.clone();
                    let inner_focus_object = focus_object.clone();
                    let screen = app.get_screen().clone();
                    self.1.locate(&focus_object,Box::new(move |_,stick,middle,zoom| {
                        let mut imp = other.0.lock().unwrap();
                        imp.set_focus_location(&mut animator,&screen,&inner_focus_object,stick,middle,zoom);
                    }));
                }
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
            
    pub fn set_middle(&mut self, middle: f64) {
        self.0.lock().unwrap().set_middle(middle);
    }
    
    pub fn update_state(&mut self, oom: &StateManager) {
        self.0.lock().unwrap().update_state(oom);
    }

    pub fn get_desired_focus_object_id(&self) -> Option<FocusObjectId> {
        self.0.lock().unwrap().get_desired_focus_object_id()
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

    pub fn settle(&mut self) {
        ok!(self.0.lock()).settle();
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

    pub fn update_reports(&self, screen: &Screen, report: &Report) {
        ok!(self.0.lock()).update_reports(screen,report);
    }

    pub fn update_viewport_report(&self, screen: &Screen, report: &ViewportReport) {
        ok!(self.0.lock()).update_viewport_report(screen,report);
    }

    pub fn jump_to_focus_object(&mut self, app: &mut App) {
        let screen = app.get_screen().clone();
        ok!(self.0.lock()).jump_to_focus_object(app.get_window().get_animator(),&screen);
    }

    pub fn transition_complete(&mut self) {
        ok!(self.0.lock()).transition_complete();
    }

    pub fn set_opacity(&mut self, prop: f64, transition: bool) {
        ok!(self.0.lock()).set_opacity(prop,transition);

    }
}

impl XferConsumer for TrainManager {
    fn consume(&mut self, item: &DeliveredItem, unpacker: &mut ItemUnpacker) {
        self.0.lock().unwrap().consume(item,unpacker);
    }
}
