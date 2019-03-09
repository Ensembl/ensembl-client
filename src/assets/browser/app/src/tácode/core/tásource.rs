use std::cell::RefCell;
use std::rc::Rc;

use tánaiste::Value;

use composit::{ Landscape, Leaf, Source, SourceResponse, ActiveSource };
use data::{ XferClerk, XferRequest, XferConsumer };
use drawing::DrawingSpec;
use tácode::{ Tácode, TáTask };

pub struct TáSourceImpl {
    tc: Tácode,
    xf: Box<XferClerk>,
    lid: usize,
    name: String
}

#[derive(Clone)]
pub struct TáSource(Rc<RefCell<TáSourceImpl>>);

impl TáSource {
    pub fn new(tc: &Tácode, xf: Box<XferClerk>, name: &str, lid: usize) -> TáSource {
        TáSource(Rc::new(RefCell::new(TáSourceImpl{
            tc: tc.clone(),
            xf, lid,
            name: name.to_string()
        })))
    }
}

impl Source for TáSource {
    fn populate(&self, acs: &ActiveSource, lc: &mut SourceResponse, leaf: &Leaf) {
        let xfer_req = XferRequest::new(&self.0.borrow_mut().name,leaf,false);
        let tc = self.0.borrow_mut().tc.clone();
        let lid = self.0.borrow_mut().lid;
        let xcons = TáXferConsumer::new(&tc,acs,leaf,lc,lid);
        self.0.borrow_mut().xf.satisfy(xfer_req,Box::new(xcons));
    }
}

struct TáXferConsumer {
    lc: SourceResponse,
    tc: Tácode,
    lid: usize,
    leaf: Leaf,
    acs: ActiveSource
}

impl TáXferConsumer {
    pub fn new(tc: &Tácode, acs: &ActiveSource, leaf: &Leaf, lc: &SourceResponse, lid: usize) -> TáXferConsumer {
        TáXferConsumer {
            lc: lc.clone(),
            lid,
            tc: tc.clone(),
            leaf: leaf.clone(),
            acs: acs.clone()
        }
    }
}

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, code: String, mut data: Vec<Value>) {
        match self.tc.assemble(&code) {
            Ok(code) => {
                match self.tc.run(&code) {
                    Ok(pid) => {
                        self.tc.context().set_task(pid,TáTask::MakeShapes(
                            self.acs.clone(),
                            self.leaf.clone(),self.lc.clone(),
                            Vec::<DrawingSpec>::new(),self.lid,None));
                        for (i,reg) in data.drain(..).enumerate() {
                            self.tc.set_reg(pid,i+1,reg);
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
