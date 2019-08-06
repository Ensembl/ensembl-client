use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Leaf, Stage, Compositor };
use composit::source::PurchaseOrder;
use model::train::TravellerResponse;
use types::Dot;
use super::Printer;

struct PrinterManagerImpl {
    printer: Box<Printer>,
    leaf_count: HashMap<(Leaf,Option<String>),u32>
}

impl PrinterManagerImpl {
    fn new(printer: Box<Printer>) -> PrinterManagerImpl {
        PrinterManagerImpl {
            printer,
            leaf_count: HashMap::new()
        }
    }
}

#[derive(Clone)]
pub struct PrinterManager(Rc<RefCell<PrinterManagerImpl>>);

impl PrinterManager {
    pub fn new(printer: Box<Printer>) -> PrinterManager {
        PrinterManager(Rc::new(RefCell::new(PrinterManagerImpl::new(printer))))
    }
}

impl Printer for PrinterManager {
    /* Print one run of objects from compositor with given stage and
     * state.
     */
    fn print(&mut self, stage: &Stage, compo: &mut Compositor) {
        self.0.borrow_mut().printer.print(stage,compo);
    }
    
    /* Finished with printer */
    fn destroy(&mut self) {
        self.0.borrow_mut().printer.destroy();
    }
    
    /* Set your size to this */
    fn set_size(&mut self, s: Dot<f64,f64>) {
        self.0.borrow_mut().printer.set_size(s);
    }
    
    fn settle(&mut self) {
        self.0.borrow_mut().printer.settle();
    }
    
    /* How much size is available to expand into, should you be
     * requested to do so?
     */
    fn get_available_size(&self) -> Dot<f64,f64> {
        self.0.borrow().printer.get_available_size()
    }
    
    fn add_leaf(&mut self, leaf: &Leaf, focus: &Option<String>) {
        let mut imp = self.0.borrow_mut();
        if *imp.leaf_count.entry((leaf.clone(),focus.clone())).and_modify(|v| *v += 1).or_insert(1) == 1 {
            imp.printer.add_leaf(leaf,focus);
        }
    }
    
    fn remove_leaf(&mut self, leaf: &Leaf, focus: &Option<String>) {
        let mut imp = self.0.borrow_mut();
        if *imp.leaf_count.entry((leaf.clone(),focus.clone())).and_modify(|v| *v -= 1).or_insert(0) == 0 {
            imp.printer.remove_leaf(leaf,focus);
        }
    }
    
    fn set_current(&mut self, leaf: &Leaf) {
        self.0.borrow_mut().printer.set_current(leaf);
    }
    
    fn make_traveller_response(&mut self, po: &PurchaseOrder) -> Box<TravellerResponse> {
        self.0.borrow_mut().printer.make_traveller_response(po)
    }
    
    fn redraw_carriage(&mut self, leaf: &Leaf) {
        self.0.borrow_mut().printer.redraw_carriage(leaf);
    }
}
