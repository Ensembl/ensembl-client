use std::cell::RefCell;
use std::rc::Rc;

use composit::state::StateExpr;
use shape::DrawnShape;

pub struct LCBuilderImpl {
    shapes: Vec<DrawnShape>,
    done: bool
}

impl LCBuilderImpl {
    fn new() -> LCBuilderImpl {
        LCBuilderImpl {
            shapes: Vec::<DrawnShape>::new(),
            done: false
        }
    }
    
    fn add_shape(&mut self, item: DrawnShape) {
        self.shapes.push(item);
    }
    
    fn done(&mut self) {
        self.done = true;
    }
    
    fn get_shapes(&self) -> Option<&Vec<DrawnShape>> {
        if self.done {
            Some(&self.shapes)
        } else {
            None
        }
    }
    
    fn each_shape<F>(&mut self, mut cb: F) -> bool where F: FnMut(&mut DrawnShape) {
        if self.done {
            for mut s in &mut self.shapes {
                cb(&mut s);
            }
        }
        self.done
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
    
    pub fn done(&mut self) {
        self.0.borrow_mut().done();
    }
    
    pub fn each_shape<F>(&mut self, cb: F) -> bool where F: FnMut(&mut DrawnShape) {
        self.0.borrow_mut().each_shape(cb)
    }
}
