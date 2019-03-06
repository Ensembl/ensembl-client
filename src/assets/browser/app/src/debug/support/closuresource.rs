use std::rc::Rc;

use stdweb::web::window;
use stdweb::web::IWindowOrWorker;

use composit::{ Source, SourceResponse, Leaf, ActiveSource };
use shape::ShapeSpec;

pub struct ClosureSourceImpl {
    f: Box<Fn(&mut SourceResponse,&Leaf)>,
    delay: f32
}

#[derive(Clone)]
pub struct ClosureSource(Rc<ClosureSourceImpl>);

impl ClosureSource {
    pub fn new<F>(delay: f32, f: F) -> ClosureSource 
                           where F: Fn(&mut SourceResponse,&Leaf) + 'static {
        ClosureSource(Rc::new(ClosureSourceImpl{ f: Box::new(f), delay }))
    }
}

impl Source for ClosureSource {
    fn populate(&self, acs: &ActiveSource, lc: &mut SourceResponse, leaf: &Leaf) {
        let cs = self.clone();
        let mut lc = lc.clone();
        let leaf = leaf.clone();
        window().set_timeout(move || {
            (cs.0.f)(&mut lc,&leaf);
        },(self.0.delay * 1000.) as u32);
    }
}

pub fn closure_add_opt(lcb: &mut SourceResponse, s: &Option<ShapeSpec>) {
    if let Some(s) = s {
        closure_add(lcb,s);
    }
}
pub fn closure_add(lcb: &mut SourceResponse, s: &ShapeSpec) {
    lcb.add_shape(&None,s.clone());
}

pub fn closure_done(lcb: &mut SourceResponse, max_y: i32) {
    lcb.done(max_y);
}
