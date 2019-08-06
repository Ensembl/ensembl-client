use std::cell::RefCell;
use std::rc::Rc;

use tánaiste::Value;

use composit::{ Leaf, Source, ActiveSource };
use composit::source::PurchaseOrder;
use data::{ XferClerk, XferConsumer, BackendConfig, BackendBytecode };
use model::focus::FocusObject;
use model::shape::DrawingSpec;
use composit::source::SourceResponse;
use tácode::{ Tácode, TáTask };

pub struct TáSourceImpl {
    tc: Tácode,
    xf: Box<XferClerk>,
    lid: usize,
    config: BackendConfig,
    focus: FocusObject
}

#[derive(Clone)]
pub struct TáSource(Rc<RefCell<TáSourceImpl>>);

impl TáSource {
    pub fn new(tc: &Tácode, xf: Box<XferClerk>, lid: usize, config: &BackendConfig, focus: &FocusObject) -> TáSource {
        TáSource(Rc::new(RefCell::new(TáSourceImpl{
            tc: tc.clone(),
            xf, lid,
            config: config.clone(),
            focus: focus.clone()
        })))
    }
}

impl Source for TáSource {
    fn request_data(&self, acs: &ActiveSource, lc: SourceResponse, po: &PurchaseOrder) {
        let tc = self.0.borrow_mut().tc.clone();
        let lid = self.0.borrow_mut().lid;
        let config = &self.0.borrow().config.clone();
        let xcons = TáXferConsumer::new(&tc,acs,po.get_leaf(),lc,lid,config,&self.0.borrow_mut().focus);
        self.0.borrow_mut().xf.satisfy(po,false,Box::new(xcons));
    }
}

struct TáXferConsumer {
    lc: Option<SourceResponse>,
    tc: Tácode,
    lid: usize,
    leaf: Leaf,
    acs: ActiveSource,
    config: Rc<BackendConfig>,
    focus: FocusObject
}

impl TáXferConsumer {
    fn new(tc: &Tácode, acs: &ActiveSource, leaf: &Leaf, lc: SourceResponse, lid: usize, config: &BackendConfig, focus: &FocusObject) -> TáXferConsumer {
        TáXferConsumer {
            lc: Some(lc),
            lid,
            tc: tc.clone(),
            leaf: leaf.clone(),
            acs: acs.clone(),
            config: Rc::new(config.clone()),
            focus: focus.clone()
        }
    }
}

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, mut data: Vec<Value>) {
        match self.tc.assemble(&code.get_source()) {
            Ok(code) => {
                match self.tc.run(&code) {
                    Ok(pid) => {
                        if let Some(asrb) = self.lc.take() {
                            self.tc.context().set_task(pid,TáTask::MakeShapes(
                                self.acs.clone(),
                                self.leaf.clone(),asrb,
                                Vec::<DrawingSpec>::new(),self.lid,None,
                                self.config.clone(),
                                self.focus.clone()));
                            for (i,reg) in data.drain(..).enumerate() {
                                self.tc.set_reg(pid,i+1,reg);
                            }
                            self.tc.start(pid);
                        }
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
        if let Some(ref mut asrb) = self.lc {
            asrb.done();
        }
        self.lc = None;
    }
}
