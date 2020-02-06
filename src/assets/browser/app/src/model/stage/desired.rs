use std::cell::{ Ref, RefCell };
use std::rc::Rc;

use composit::Stick;
use model::stage::Position;
use types::{ Dot, LEFT, RIGHT, DOWN };

#[derive(Debug)]
pub struct Desired {
    screen_size: Option<Dot<f64,f64>>,
    stick: Option<Stick>,
    bp_per_screen: Option<f64>,
    middle: Option<Dot<f64,f64>>,
    position: Rc<RefCell<Option<Position>>>,
    bottom: Option<f64>
}

impl Desired {
    pub fn new() -> Desired {
        Desired {
            screen_size: None,
            stick: None,
            bp_per_screen: None,
            middle: None,
            position: Rc::new(RefCell::new(None)),
            bottom: None
        }
    }

    pub fn clear(&mut self) {
        self.stick = None;
        self.bp_per_screen = None;
        self.middle = None;
        self.position = Rc::new(RefCell::new(None));
    }

    fn make_position(&self) -> Position {
        let mut position = Position::new();
        position.set_limit(&LEFT,0.);
        position.set_limit(&RIGHT,self.stick.as_ref().unwrap().length() as f64);
        position.set_limit(&DOWN,self.bottom.unwrap());
        position.set_wrapping(&self.stick.as_ref().unwrap().get_wrapping());
        position.inform_screen_size(&self.screen_size.as_ref().unwrap());
        position.set_middle(self.middle.as_ref().unwrap());
        position.set_screen_in_bp(self.bp_per_screen.unwrap());
        position
    }

    fn populate_position(&self) {
        if !self.is_ready() { return; }
        if self.position.borrow().is_some() { return; }
        console!("making position");
        let position = self.make_position();
        self.position.replace(Some(position));
    }

    pub fn set_stick(&mut self, stick: &Stick) {
        self.clear();
        self.stick = Some(stick.clone());
    }

    pub fn set_bp_per_screen(&mut self, bp_per_screen: f64) {
        self.bp_per_screen = Some(bp_per_screen);
        if let Some(position) = self.position.borrow_mut().as_mut() {
            position.set_screen_in_bp(bp_per_screen);
        }
    }

    pub fn set_middle(&mut self, middle: Dot<f64,f64>) {
        self.middle = Some(middle);
        if let Some(position) = self.position.borrow_mut().as_mut() {
            position.set_middle(self.middle.as_ref().unwrap());
        }
    }

    pub fn inform_screen_size(&mut self, screen_size: &Dot<f64,f64>) {
        self.screen_size = Some(screen_size.clone());
        if let Some(position) = self.position.borrow_mut().as_mut() {
            position.inform_screen_size(screen_size);
        }
    }

    pub fn set_bottom(&mut self, bottom: f64) {
        self.bottom = Some(bottom);
        if let Some(position) = self.position.borrow_mut().as_mut() {
            position.set_limit(&DOWN,self.bottom.unwrap());
        }
    }

    pub fn is_ready(&self) -> bool {
        self.stick.is_some() &&
        self.bp_per_screen.is_some() &&
        self.middle.is_some() &&
        self.screen_size.is_some() &&
        self.bottom.is_some()
    }

    pub fn get_stick(&self) -> &Stick {
        self.stick.as_ref().unwrap()
    }

    pub fn get_position(&self) -> Ref<'_,Position> {
        self.populate_position();
        Ref::map(self.position.borrow(),|p| p.as_ref().unwrap())
    }
}