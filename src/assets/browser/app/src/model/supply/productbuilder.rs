use std::rc::Rc;

use controller::global::WindowState;
use composit::{ Plot,StateAtom, StateExpr };
use super::product::Product;
use debug::add_debug_sources;

use super::{ Subassembly, SupplierChooser };

const TOP : i32 = 50;
const PITCH : i32 = 63;

fn build_supplier(window: &mut WindowState) -> SupplierChooser {
    let backend = window.get_http_clerk().clone();
    SupplierChooser::new(Box::new(backend))
}

fn make_subassembly(product: &mut Product, name: Option<String>, atom_name: String) {
    let expr: Rc<dyn StateExpr> = Rc::new(StateAtom::new(&atom_name));
    let sa = Subassembly::new(product,&name);
    product.add_subassembly(&sa,&expr);
}

fn build_product_main(window: &mut WindowState, type_name: &str, supplier: SupplierChooser, lid: usize) -> Product {
    let cfg_track = window.get_backend_config().get_track(type_name);
    let focus_dep = cfg_track.map(|t| t.focus_dependent()).unwrap_or(true);
    let mut product = Product::new(type_name,Rc::new(supplier),lid,focus_dep);
    make_subassembly(&mut product,None,type_name.to_string());
    if let Some(parts) = cfg_track.map(|t| t.get_parts()) {
        for part in parts {
            let state_name = format!("{}:{}",type_name,part);
            make_subassembly(&mut product,Some(part.to_string()),state_name);
        }
    }
    product
}

fn allocate_shelf_space(window: &mut WindowState, type_name: &str) -> usize {
    let mut als = window.get_all_landscapes().clone();
    let lid = als.allocate(type_name);
    let track = window.get_backend_config().get_track(type_name);
    let (y_pos,letter) = track.map(|track|
        (track.get_position(),track.get_letter())
    ).unwrap_or((-1,""));
    let plot = Plot::new(y_pos*PITCH+TOP,PITCH,letter.to_string(),y_pos!=-1);
    als.with(lid, |ls| ls.set_plot(plot) );
    lid
}

pub fn build_product(window: &mut WindowState, type_name: &str) -> Product {
    let lid = allocate_shelf_space(window,type_name);
    let mut supplier = build_supplier(window);
    add_debug_sources(&mut supplier,type_name);
    build_product_main(window,type_name,supplier,lid)
}
