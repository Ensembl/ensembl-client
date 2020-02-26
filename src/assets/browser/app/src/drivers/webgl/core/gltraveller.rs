use std::cell::RefCell;
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use super::{ GLDrawing, GLProgInstances, GLPrinter };
use super::super::drawing::CarriageCanvases;
use crate::model::driver::DriverTraveller;
use crate::model::item::UnpackedSubassembly;
use crate::model::train::TravellerId;

#[derive(Clone)]
pub struct GLTraveller {
    printer: GLPrinter,
    dr: Rc<RefCell<Option<GLDrawing>>>,
    state: Rc<RefCell<bool>>,
    traveller_id: TravellerId
}

impl PartialEq for GLTraveller {
    fn eq(&self, other: &GLTraveller) -> bool {
        self.traveller_id == other.traveller_id
    }
}
impl Eq for GLTraveller {}

impl Hash for GLTraveller {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.traveller_id.hash(state);
    }
}

impl GLTraveller {    
    /* train/partyresponses */
    pub(super) fn new(printer: &GLPrinter, traveller_id: &TravellerId, data: UnpackedSubassembly) -> GLTraveller {
        let out = GLTraveller {
            printer: printer.clone(),
            dr: Rc::new(RefCell::new(None)),
            state: Rc::new(RefCell::new(false)),
            traveller_id: traveller_id.clone()
        };
        *out.dr.borrow_mut() = Some(GLDrawing::new(&data));
        out
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
    
    fn destroy(&mut self) {
    }
}

impl fmt::Debug for GLTraveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}",self.traveller_id)
    }
}
