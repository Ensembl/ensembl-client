use std::cell::RefCell;
use std::rc::Rc;

use composit::{ Leaf, Stage, StateManager, Compositor };
use types::Dot;
use super::Printer;

struct PrinterManagerImpl {
    printer: Box<Printer>
}

impl PrinterManagerImpl {
    fn new(printer: Box<Printer>) -> PrinterManagerImpl {
        PrinterManagerImpl {
            printer
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
    fn print(&mut self, stage: &Stage, oom: &StateManager, compo: &mut Compositor) {
        self.0.borrow_mut().printer.print(stage,oom,compo);
    }
    
    /* Finished with printer */
    fn destroy(&mut self) {
        self.0.borrow_mut().printer.destroy();
    }
    
    /* Set your size to this */
    fn set_size(&mut self, s: Dot<i32,i32>) {
        self.0.borrow_mut().printer.set_size(s);
    }
    
    /* How much size is available to expand into, should you be
     * requested to do so?
     */
    fn get_available_size(&self) -> Dot<i32,i32> {
        self.0.borrow().printer.get_available_size()
    }
    
    fn add_leaf(&mut self, leaf: &Leaf) {
        self.0.borrow_mut().printer.add_leaf(leaf);
    }
    
    fn remove_leaf(&mut self, leaf: &Leaf) {
        self.0.borrow_mut().printer.remove_leaf(leaf);
    }
}
