use std::cell::RefCell;
use std::rc::Rc;

use shape::DrawnShape;

pub struct LCBuilderImpl {
    shapes: Vec<DrawnShape>,
    max_y: Option<i32>,
    done: bool
}

impl LCBuilderImpl {
    fn new() -> LCBuilderImpl {
        LCBuilderImpl {
            shapes: Vec::<DrawnShape>::new(),
            max_y: None,
            done: false
        }
    }
    
    fn add_shape(&mut self, item: DrawnShape) {
        self.shapes.push(item);
    }
    
    fn done(&mut self, max_y: i32) {
        self.max_y = Some(max_y);
        self.done = true;
    }
    
    fn get_max_y(&self) -> i32 { self.max_y.unwrap_or(0) }
    
    fn is_done(&self) -> bool { self.done }
    
    fn each_shape<F>(&mut self, mut cb: F) where F: FnMut(&mut DrawnShape) {
        if self.done {
            for mut s in &mut self.shapes {
                cb(&mut s);
            }
        }
    }
}

#[derive(Clone)]
pub struct LCBuilder(Rc<RefCell<LCBuilderImpl>>);

impl LCBuilder {
    pub fn new() -> LCBuilder {
        LCBuilder(Rc::new(RefCell::new(LCBuilderImpl::new())))
    }
    
    pub fn add_shape(&mut self, item: DrawnShape) {
        self.0.borrow_mut().add_shape(item);
    }
    
    pub fn done(&mut self, max_y: i32) {
        self.0.borrow_mut().done(max_y);
    }
    
    pub fn is_done(&self) -> bool { self.0.borrow().is_done() }
    pub fn get_max_y(&self) -> i32 { self.0.borrow().get_max_y() }
    
    pub fn each_shape<F>(&mut self, cb: F) where F: FnMut(&mut DrawnShape) {
        self.0.borrow_mut().each_shape(cb);
    }
}
