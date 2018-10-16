use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Source, LeafComponent, Leaf };
use shape::{ ShapeSpec, DrawnShape };

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
    fn populate(&self, lc: &mut LeafComponent, leaf: &Leaf) {
        if let Some(specs) = self.0.borrow().shapes.get(leaf) {
            for s in specs {
                lc.add_shape(DrawnShape::new(s.create()));
            }
        }
    }
}
