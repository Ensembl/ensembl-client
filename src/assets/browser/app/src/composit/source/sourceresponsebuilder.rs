use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::DrawnResponse;
use shape::ShapeSpec;

#[derive(Clone)]
pub struct SourceResponseResult(Rc<RefCell<Option<DrawnResponse>>>);

impl SourceResponseResult {
    pub fn new() -> SourceResponseResult {
        SourceResponseResult(Rc::new(RefCell::new(None)))
    }
    
    pub fn set(&mut self, result: SourceResponseBuilder) {
        *self.0.borrow_mut() = Some(DrawnResponse::new(result));
    }
    
    pub fn take(&mut self) -> Option<DrawnResponse> {
        self.0.borrow_mut().take()
    }
    
    pub fn check(&self) -> bool {
        self.0.borrow().is_some()
    }
}

pub struct SourceResponseBuilder {
    shapes: Vec<ShapeSpec>
}

impl SourceResponseBuilder {
    pub fn new() -> SourceResponseBuilder {
        SourceResponseBuilder {
            shapes: Vec::<ShapeSpec>::new()
        }
    }

    pub fn expect(&mut self, amt: usize) {
        self.shapes.reserve(amt);
    }
    
    pub fn add_shape(&mut self, item: ShapeSpec) {
        self.shapes.push(item);
    }

    pub fn get_shapes(&self) -> &Vec<ShapeSpec> {
        &self.shapes
    }
        
    pub fn size(&self) -> usize {
        self.shapes.len()
    }
}
