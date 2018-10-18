use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Source, LeafComponent, Leaf };
use shape::{ ShapeSpec, DrawnShape };

pub struct ClosureSourceImpl {
    f: Box<Fn(&mut LeafComponent,&Leaf)>
}

#[derive(Clone)]
pub struct ClosureSource(Rc<ClosureSourceImpl>);

impl ClosureSource {
    pub fn new<F>(f: F) -> ClosureSource where F: Fn(&mut LeafComponent,&Leaf) + 'static {
        ClosureSource(Rc::new(ClosureSourceImpl{ f: Box::new(f) }))
    }    
}

impl Source for ClosureSource {
    fn populate(&self, lc: &mut LeafComponent, leaf: &Leaf) {
        (self.0.f)(lc,leaf);
    }
}

pub fn closure_add(lc: &mut LeafComponent, s: &ShapeSpec) {
    lc.add_shape(DrawnShape::new(s.create()));
}
