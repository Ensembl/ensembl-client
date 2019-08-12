use std::cell::RefCell;
use std::rc::Rc;

use tánaiste::Value;

use composit::{ Leaf, AllLandscapes };
use controller::global::WindowState;
use data::{ XferClerk, XferConsumer, BackendConfig, BackendBytecode };
use model::focus::FocusObject;
use model::shape::DrawingSpec;
use model::supply::{ DeliveredItem, PendingOrder, Supplier };
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
    fn supply(&self, po: PendingOrder) {
        let purchase_order = po.get_purchase_order().clone();
        let window = self.0.borrow().window.clone();
        let mut xf = self.0.borrow_mut().window.get_http_clerk().clone();
        let xcons = TáXferConsumer::new(&window,po);
        xf.satisfy(&purchase_order,false,Box::new(xcons));
    }

    fn get_lid(&self) -> usize {
        self.0.borrow().lid
    }
}

struct TáXferConsumer {
    window: WindowState,
    pending_order: Option<PendingOrder>
}

impl TáXferConsumer {
    fn new(window: &WindowState, po: PendingOrder) -> TáXferConsumer {
        TáXferConsumer {
            window: window.clone(),
            pending_order: Some(po)
        }
    }
}

fn run_tánaiste_makeshapes(window: &mut WindowState, pending_order: PendingOrder, item: &DeliveredItem) {
    let lid = item.get_product().get_supplier().get_lid();
    let mut tc = window.get_tánaiste_interp().clone();
    let mut all_landscapes = window.get_all_landscapes().clone();
    let mut focus_object = window.get_focus().clone();
    let mut backend_config = window.get_backend_config().clone();
    match tc.assemble(&item.get_bytecode().get_source()) {
        Ok(code) => {
            match tc.run(&code) {
                Ok(pid) => {
                    tc.context().set_task(pid,TáTask::MakeShapes(
                        window.clone(),
                        item.clone(),
                        pending_order,
                        Vec::<DrawingSpec>::new(),lid,None,
                        all_landscapes,
                        focus_object));
                    for (i,reg) in item.get_data().iter().enumerate() {
                        tc.set_reg(pid,i+1,reg.clone());
                    }
                    tc.start(pid);
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

impl XferConsumer for TáXferConsumer {
    fn consume(&mut self, item: &DeliveredItem) {
        if let Some(pending_order) = self.pending_order.take() {
            run_tánaiste_makeshapes(&mut self.window,pending_order,item)
        }
    }
    
    /*
    fn abandon(&mut self) {
        if let Some(ref mut po) = self.pending_order {
            po.done();
        }
        self.pending_order = None;
    }
    */
}
