use std::rc::Rc;

use stdweb::web::window;
use stdweb::web::IWindowOrWorker;

use composit::{ Source, LCBuilder, Leaf };
use shape::{ ShapeSpec, DrawnShape };

pub struct ClosureSourceImpl {
    f: Box<Fn(&mut LCBuilder,&Leaf)>,
    delay: f32
}

#[derive(Clone)]
pub struct ClosureSource(Rc<ClosureSourceImpl>);

impl ClosureSource {
    pub fn new<F>(delay: f32, f: F) -> ClosureSource 
                           where F: Fn(&mut LCBuilder,&Leaf) + 'static {
        ClosureSource(Rc::new(ClosureSourceImpl{ f: Box::new(f), delay }))
    }
}

impl Source for ClosureSource {
    fn populate(&self, lc: &mut LCBuilder, leaf: &Leaf) {
        let cs = self.clone();
        let mut lc = lc.clone();
        let leaf = leaf.clone();
        window().set_timeout(move || {
            (cs.0.f)(&mut lc,&leaf);
        },(self.0.delay * 1000.) as u32);
    }
}

pub fn closure_add(lcb: &mut LCBuilder, s: &ShapeSpec) {
    lcb.add_shape(DrawnShape::new(s.create()));
}

pub fn closure_done(lcb: &mut LCBuilder, max_y: i32) {
    lcb.done(max_y);
}
