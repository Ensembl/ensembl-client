use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use shape::ShapeSpec;

pub struct SourceResponse {
    shapes: Vec<ShapeSpec>
}

impl SourceResponse {
    pub fn new() -> SourceResponse {
        SourceResponse {
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
