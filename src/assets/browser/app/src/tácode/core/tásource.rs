use std::cell::RefCell;
use std::rc::Rc;

use composit::{ Leaf, Source, SourceResponse };
use data::{ XferResponse, XferConsumer };
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
        let mut xf = self.0.borrow_mut().xf.clone(); // XXX no!
        let mut tc = self.0.borrow_mut().tc.clone();
        let mut xcons = TáXferConsumer::new(&tc,leaf,lc);
        xcons.consume(xf);
    }
}

struct TáXferConsumer {
    lc: SourceResponse,
    tc: Tácode,
    leaf: Leaf
}

impl TáXferConsumer {
    pub fn new(tc: &Tácode, leaf: &Leaf, lc: &SourceResponse) -> TáXferConsumer {
        TáXferConsumer {
            lc: lc.clone(),
            tc: tc.clone(),
            leaf: leaf.clone()
        }
    }
}

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, mut xf: XferResponse) {
        let b = self.tc.assemble(&xf.get_code());
        let pid = self.tc.run(&b.ok().unwrap()).ok().unwrap();
        self.tc.context().set_task(pid,TáTask::MakeShapes(self.leaf.clone(),self.lc.clone()));
        let len = xf.len();
        for reg in 0..len {
            self.tc.set_reg(pid,reg+1,xf.take_data(reg));
        }
        self.tc.start(pid);
    }
}
