use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use tánaiste::Value;

use composit::{ Leaf, AllLandscapes };
use controller::global::WindowState;
use data::{ XferClerk, XferConsumer, BackendConfig, BackendBytecode, UnpackedProductConsumer };
use model::focus::FocusObject;
use model::item::{ DeliveredItem, UnpackedProduct};
use model::shape::DrawingSpec;
use model::supply::{ PurchaseOrder, Subassembly, Supplier };
use model::train::Traveller;
use tácode::{ Tácode, TáTask };

pub fn run_tánaiste_makeshapes(window: &mut WindowState, consumer: Box<dyn UnpackedProductConsumer>, unpacked_item: &mut UnpackedProduct, item: &DeliveredItem) {
    let lid = item.get_id().get_product().get_lid();
    let mut tc = window.get_tánaiste_interp().clone();
    let mut all_landscapes = window.get_all_landscapes().clone();
    let mut focus_object = window.get_focus().get_focus();
    let mut backend_config = window.get_backend_config().clone();
    match tc.assemble(&item.get_bytecode().get_source()) {
        Ok(code) => {
            match tc.run(&code) {
                Ok(pid) => {
                    tc.context().set_task(pid,TáTask::MakeShapes(
                        backend_config,
                        item.get_id().get_leaf().clone(),
                        unpacked_item.clone(),
                        Vec::<DrawingSpec>::new(),lid,
                        Some(Subassembly::new(item.get_id().get_product(),&None)),
                        all_landscapes,
                        focus_object.clone(),consumer));
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
