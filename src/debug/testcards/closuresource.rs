use std::rc::Rc;

use composit::{ Source, LCBuilder, Leaf };
use shape::{ ShapeSpec, DrawnShape };

pub struct ClosureSourceImpl {
    f: Box<Fn(&mut LCBuilder,&Leaf)>
}

#[derive(Clone)]
pub struct ClosureSource(Rc<ClosureSourceImpl>);

impl ClosureSource {
    pub fn new<F>(f: F) -> ClosureSource where F: Fn(&mut LCBuilder,&Leaf) + 'static {
        ClosureSource(Rc::new(ClosureSourceImpl{ f: Box::new(f) }))
    }    
}

impl Source for ClosureSource {
    fn populate(&self, lc: &mut LCBuilder, leaf: &Leaf) {
        (self.0.f)(lc,leaf);
    }
}

pub fn closure_add(lcb: &mut LCBuilder, s: &ShapeSpec) {
    lcb.add_shape(DrawnShape::new(s.create()));
    lcb.done(); // XXX
}
