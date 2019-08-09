use std::cell::RefCell;
use std::rc::Rc;

use tánaiste::Value;

use composit::{ Leaf, AllLandscapes };
use controller::global::WindowState;
use data::{ XferClerk, XferConsumer, BackendConfig, BackendBytecode };
use model::focus::FocusObject;
use model::shape::DrawingSpec;
use model::supply::{ PendingOrder, Supplier };
use tácode::{ Tácode, TáTask };

pub struct TáSourceImpl {
    window: WindowState,
    lid: usize
}

#[derive(Clone)]
pub struct TáSource(Rc<RefCell<TáSourceImpl>>);

impl TáSource {
    pub fn new(window: &WindowState, lid: usize) -> TáSource {
        TáSource(Rc::new(RefCell::new(TáSourceImpl {
            window: window.clone(),
            lid
        })))
    }    
}

impl Supplier for TáSource {
    fn supply(&self, lc: PendingOrder) {
        let lid = self.0.borrow_mut().lid;
        let leaf = lc.get_purchase_order().get_leaf().clone();
        let po = lc.get_purchase_order().clone();
        let window = self.0.borrow().window.clone();
        let xcons = TáXferConsumer::new(&window,&leaf,lc,lid);
        let mut xf = self.0.borrow_mut().window.get_http_clerk().clone();
        xf.satisfy(&po,false,Box::new(xcons));
    }
}

struct TáXferConsumer {
    window: WindowState,
    lc: Option<PendingOrder>,
    lid: usize,
    leaf: Leaf
}

impl TáXferConsumer {
    fn new(window: &WindowState, leaf: &Leaf, lc: PendingOrder, lid: usize) -> TáXferConsumer {
        TáXferConsumer {
            window: window.clone(),
            lc: Some(lc),
            lid,
            leaf: leaf.clone()
        }
    }
}

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, code: Rc<BackendBytecode>, mut data: Vec<Value>) {
        let window = self.window.clone();
        let mut tc = self.window.get_tánaiste_interp();
        match tc.assemble(&code.get_source()) {
            Ok(code) => {
                match tc.run(&code) {
                    Ok(pid) => {
                        if let Some(asrb) = self.lc.take() {
                            tc.context().set_task(pid,TáTask::MakeShapes(
                                window,
                                self.leaf.clone(),asrb,
                                Vec::<DrawingSpec>::new(),self.lid,None));
                            for (i,reg) in data.drain(..).enumerate() {
                                tc.set_reg(pid,i+1,reg);
                            }
                            tc.start(pid);
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
