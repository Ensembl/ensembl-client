use controller::global::WindowState;
use data::UnpackedProductConsumer;
use model::item::{ DeliveredItem, UnpackedProduct};
use model::shape::DrawingSpec;
use model::supply::Subassembly;
use model::train::TrainContext;
use tácode::TáTask;

pub fn run_tánaiste_makeshapes(window: &mut WindowState, consumer: Box<dyn UnpackedProductConsumer>, unpacked_item: &mut UnpackedProduct, 
                               item: &DeliveredItem, context: &TrainContext) {
    let lid = item.get_id().get_product().get_lid();
    let tc = window.get_tánaiste_interp().clone();
    let all_landscapes = window.get_all_landscapes().clone();
    let focus_object = context.get_focus().clone();
    let backend_config = window.get_backend_config().clone();
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
                        tc.set_reg(pid,i+1,reg.full_copy());
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
