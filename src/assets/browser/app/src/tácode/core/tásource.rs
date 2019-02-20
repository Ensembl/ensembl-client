use std::cell::RefCell;
use std::rc::Rc;

use composit::{ Landscape, Leaf, Source, SourceResponse };
use data::{ XferClerk, XferRequest, XferResponse, XferConsumer };
use drawing::DrawingSpec;
use tácode::{ Tácode, TáTask };

pub struct TáSourceImpl {
    tc: Tácode,
    xf: Box<XferClerk>,
    ls: Landscape,
    name: String
}

#[derive(Clone)]
pub struct TáSource(Rc<RefCell<TáSourceImpl>>);

impl TáSource {
    pub fn new(tc: &Tácode, xf: Box<XferClerk>, name: &str, ls: Landscape) -> TáSource {
        TáSource(Rc::new(RefCell::new(TáSourceImpl{
            tc: tc.clone(),
            xf, ls,
            name: name.to_string()
        })))
    }
}

impl Source for TáSource {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf) {
        let xfer_req = XferRequest::new(&self.0.borrow_mut().name,leaf);
        let tc = self.0.borrow_mut().tc.clone();
        let ls = self.0.borrow_mut().ls.clone();
        let xcons = TáXferConsumer::new(&tc,leaf,lc,ls);
        self.0.borrow_mut().xf.satisfy(xfer_req,Box::new(xcons));
    }
}

struct TáXferConsumer {
    lc: SourceResponse,
    ls: Landscape,
    tc: Tácode,
    leaf: Leaf
}

impl TáXferConsumer {
    pub fn new(tc: &Tácode, leaf: &Leaf, lc: &SourceResponse, ls: Landscape) -> TáXferConsumer {
        TáXferConsumer {
            lc: lc.clone(),
            ls,
            tc: tc.clone(),
            leaf: leaf.clone()
        }
    }
}

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, mut xf: XferResponse) {
        match self.tc.assemble(&xf.get_code()) {
            Ok(code) => {
                match self.tc.run(&code) {
                    Ok(pid) => {
                        self.tc.context().set_task(pid,TáTask::MakeShapes(
                            self.leaf.clone(),self.lc.clone(),
                            Vec::<DrawingSpec>::new(),self.ls.clone()));
                        let len = xf.len();
                        for reg in 0..len {
                            self.tc.set_reg(pid,reg+1,xf.take_data(reg));
                        }
                        self.tc.start(pid);         
                    },
                    Err(error) => {
                        console!("error running: {:?}",error);
                    }
                }
            },
            Err(err) => {
                console!("error assembling: {:?}",err);
            }
        }        
    }
    
    fn abandon(&mut self) {
        self.lc.done(0);
    }
}
