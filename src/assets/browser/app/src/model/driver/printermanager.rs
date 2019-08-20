use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use composit::{ Leaf, Compositor };
use model::stage::{ Screen, Position };
use model::supply::PurchaseOrder;
use model::train::{ CarriageId, TravellerId };
use types::Dot;
use super::{ DriverTraveller, Printer };

struct PrinterManagerImpl {
    printer: Box<Printer>,
    leaf_count: HashMap<CarriageId,u32>
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
    fn print(&mut self, screen: &Screen, position: &Position, compo: &mut Compositor) {
        self.0.borrow_mut().printer.print(screen,position,compo);
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
    
    fn add_carriage(&mut self, carriage: &CarriageId) {
        let mut imp = self.0.borrow_mut();
        if *imp.leaf_count.entry(carriage.clone()).and_modify(|v| *v += 1).or_insert(1) == 1 {
            imp.printer.add_carriage(carriage);
        }
    }
    
    fn remove_carriage(&mut self, carriage: &CarriageId) {
        let mut imp = self.0.borrow_mut();
        if *imp.leaf_count.entry(carriage.clone()).and_modify(|v| *v -= 1).or_insert(0) == 0 {
            imp.printer.remove_carriage(carriage);
        }
    }
        
    fn make_driver_traveller(&mut self, traveller_id: &TravellerId) -> Box<DriverTraveller> {
        self.0.borrow_mut().printer.make_driver_traveller(traveller_id)
    }
    
    fn redraw_carriage(&mut self, carriage_id: &CarriageId) {
        self.0.borrow_mut().printer.redraw_carriage(carriage_id);
    }
}
