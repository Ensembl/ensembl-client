use std::collections::HashMap;

use composit::page::Leaf;
use shape::{ Shape, DrawnShape };

struct FixedSource {
    shapes: HashMap<Leaf,Vec<DrawnShape>>,
}

impl FixedSource {
    pub fn new() -> FixedSource {
        FixedSource {
            shapes: HashMap::<Leaf,Vec<DrawnShape>>::new(),
        }
    }
    
    pub fn add_shape(&mut self, leaf: &Leaf, item: Box<Shape>) {
        self.shapes.entry(leaf.clone()).or_insert_with(||
            Vec::<DrawnShape>::new()
        ).push(DrawnShape::new(item));
    }    
}
