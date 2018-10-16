use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Source };
use composit::page::{ Page, Leaf };
use shape::{ ShapeSpec };

pub struct FixedSourceImpl {
    shapes: HashMap<Leaf,Vec<ShapeSpec>>,
}

#[derive(Clone)]
pub struct FixedSource(Rc<RefCell<FixedSourceImpl>>);

impl FixedSource {
    pub fn new() -> FixedSource {
        FixedSource(Rc::new(RefCell::new(FixedSourceImpl{
            shapes: HashMap::<Leaf,Vec<ShapeSpec>>::new(),
        })))
    }
    
    pub fn add_shape(&mut self, leaf: &Leaf, item: ShapeSpec) {
        self.0.borrow_mut().shapes.entry(leaf.clone()).or_insert_with(||
            Vec::<ShapeSpec>::new()
        ).push(item);
    }    
}

impl Source for FixedSource {
    fn get_shapes(&self, _page: &Page, leaf: &Leaf) -> Vec<ShapeSpec> {
        if let Some(v) = self.0.borrow().shapes.get(leaf) {
            v.to_vec()
        } else {
            Vec::<ShapeSpec>::new()
        }
    }
}
