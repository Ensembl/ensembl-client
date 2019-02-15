use std::cell::RefCell;
use std::rc::Rc;

use composit::{ Leaf, Source, SourceResponse };
use data::XferResponse;
use tácode::{ Tácode, TáTask };

pub struct TáSourceImpl {
    tc: Tácode,
    xf: XferResponse
}

#[derive(Clone)]
pub struct TáSource(Rc<RefCell<TáSourceImpl>>);

impl TáSource {
    pub fn new(tc: &Tácode, xf: XferResponse) -> TáSource {
        TáSource(Rc::new(RefCell::new(TáSourceImpl{
            tc: tc.clone(), xf
        })))
    }
}

impl Source for TáSource {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf) {
        let mut imp = self.0.borrow_mut();        
        let mut xf = imp.xf.clone(); // XXX no!
        let b = imp.tc.assemble(&xf.get_code());
        let pid = imp.tc.run(&b.ok().unwrap()).ok().unwrap();
        imp.tc.context().set_task(pid,TáTask::MakeShapes(leaf.clone(),lc.clone()));
        let len = xf.len();
        for reg in 0..len {
            imp.tc.set_reg(pid,reg+1,xf.take_data(reg));
        }
        imp.tc.start(pid);
        lc.done(200);
    }
}
