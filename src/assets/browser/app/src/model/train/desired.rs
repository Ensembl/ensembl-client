use std::cell::{ Ref, RefCell };
use std::rc::Rc;

use composit::{ Stick, Scale };
use model::focus::FocusObjectId;
use model::stage::{ Position, Screen };
use model::train::TrainId;
use types::{ Dot, LEFT, RIGHT, DOWN };

#[derive(Debug)]
pub(super) struct Desired {
    stick: Option<Stick>,
    bp_per_screen: Option<f64>,
    middle: Option<Dot<f64,f64>>,
    position: Rc<RefCell<Option<Position>>>,
    focus_object: FocusObjectId
}

impl Desired {
    pub(super) fn new() -> Desired {
        Desired {
            stick: None,
            bp_per_screen: None,
            middle: None,
            position: Rc::new(RefCell::new(None)),
            focus_object: FocusObjectId::new(&None)
        }
    }

    pub(super) fn clear(&mut self) {
        self.stick = None;
        self.bp_per_screen = None;
        self.middle = None;
        self.position = Rc::new(RefCell::new(None));
    }

    fn make_position(&self, screen: &Screen) -> Position {
        let mut position = Position::new(self.stick.as_ref().unwrap(),self.middle.as_ref().unwrap(),self.bp_per_screen.unwrap());
        position.maybe_nudge_to_fit_limits(screen);
        position
    }

    fn populate_position(&self, screen: &Screen) {
        if !self.is_ready() { return; }
        if self.position.borrow().is_some() { return; }
        console!("making position");
        let position = self.make_position(screen);
        self.position.replace(Some(position));
    }

    pub(super) fn set_stick(&mut self, stick: &Stick, screen: &mut Screen) {
        self.clear();
        self.stick = Some(stick.clone());
        let w = self.stick.as_ref().unwrap().get_wrapping();
        screen.set_x_bumpers(w.get_bumper(&LEFT),w.get_bumper(&RIGHT));
    }

    pub(super) fn set_bp_per_screen(&mut self, bp_per_screen: f64, screen: &Screen) {
        self.bp_per_screen = Some(bp_per_screen);
        if let Some(position) = self.position.borrow_mut().as_mut() {
            *position = position.new_with_screen_bp(bp_per_screen);
            position.maybe_nudge_to_fit_limits(screen);
        }
    }

    pub(super) fn set_middle(&mut self, middle: Dot<f64,f64>, screen: &Screen) {
        self.middle = Some(middle);
        if let Some(position) = self.position.borrow_mut().as_mut() {
            *position = position.new_with_middle(&middle);
            position.maybe_nudge_to_fit_limits(screen);
        }
    }

    pub(super) fn maybe_nudge_to_fit_limits(&mut self, screen: &Screen) {
        if let Some(position) = self.position.borrow_mut().as_mut() {
            position.maybe_nudge_to_fit_limits(screen);
        }
    }

    pub(super) fn set_focus_object_id(&mut self, ctx: FocusObjectId) {
        self.focus_object = ctx;
    }

    pub(super) fn is_ready(&self) -> bool {
        self.stick.is_some() &&
        self.bp_per_screen.is_some() &&
        self.middle.is_some()
    }

    pub(super) fn get_stick(&self) -> &Stick {
        self.stick.as_ref().unwrap()
    }

    pub(super) fn get_position(&self, screen: &Screen) -> Ref<'_,Position> {
        self.populate_position(screen);
        Ref::map(self.position.borrow(),|p| p.as_ref().unwrap())
    }

    pub(super) fn get_focus_object_id(&self) -> &FocusObjectId { &self.focus_object }

    pub(super) fn get_train_id(&self, screen: &Screen) -> Option<TrainId> {
        if !self.is_ready() { return None; }
        let scale = Scale::best_for_screen(self.get_position(screen).get_screen_in_bp());
        Some(TrainId::new(self.get_stick(),&scale,&self.get_focus_object_id()))
    }
}