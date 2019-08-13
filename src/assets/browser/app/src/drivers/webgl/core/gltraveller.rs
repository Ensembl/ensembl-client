use std::cell::RefCell;
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use super::{ GLDrawing, GLProgInstances, GLPrinter };
use super::super::drawing::CarriageCanvases;
use composit::Leaf;
use model::driver::DriverTraveller;
use model::supply::ItemContents;
use model::train::TravellerId;

#[derive(Clone)]
pub struct GLTraveller {
    printer: GLPrinter,
    idx: usize,
    dr: Rc<RefCell<Option<GLDrawing>>>,
    pending_refresh: Rc<RefCell<bool>>,
    state: Rc<RefCell<bool>>,
    traveller_id: TravellerId
}

impl PartialEq for GLTraveller {
    fn eq(&self, other: &GLTraveller) -> bool {
        self.idx == other.idx
    }
}
impl Eq for GLTraveller {}

impl Hash for GLTraveller {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.idx.hash(state);
    }
}

impl GLTraveller {    
    /* train/partyresponses */
    pub(in super) fn new(printer: &GLPrinter, idx: usize, traveller_id: &TravellerId) -> GLTraveller {
        GLTraveller {
            printer: printer.clone(),
            idx,
            dr: Rc::new(RefCell::new(None)),
            pending_refresh: Rc::new(RefCell::new(false)), // XXX unused
            state: Rc::new(RefCell::new(false)),
            traveller_id: traveller_id.clone()
        }
    }
        
    pub fn get_traveller_id(&self) -> &TravellerId { &self.traveller_id }

    pub fn redraw_drawings(&self, cc: &mut CarriageCanvases) {
        let mut dr = self.dr.borrow_mut();
        if dr.is_some() {
            dr.as_mut().unwrap().redraw(cc);
        }
    }
    
    pub fn redraw_objects(&self, e: &mut GLProgInstances) {
        let mut dr = self.dr.borrow_mut();
        if dr.is_some() && *self.state.borrow() {
            dr.as_mut().unwrap().into_objects(e);
        }
    }    
}

impl DriverTraveller for GLTraveller {
    fn set_state(&self, state: bool) {
        *self.state.borrow_mut() = state;
    }

    fn set_contents(&mut self, result: &ItemContents) {
        *self.dr.borrow_mut() = Some(GLDrawing::new(result));
    }

    fn refresh(&mut self) {
        *self.pending_refresh.borrow_mut() = true;
    }
    
    fn destroy(&mut self) {
        let mut p = self.printer.clone();
        p.remove_traveller(self);
    }    
}

impl fmt::Debug for GLTraveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}[{}]",self.traveller_id,self.idx)
    }
}
