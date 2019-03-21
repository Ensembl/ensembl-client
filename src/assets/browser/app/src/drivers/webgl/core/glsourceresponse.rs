use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use drivers::webgl::DrawnResponse;
use shape::ShapeSpec;
use composit::SourceResponse;

#[derive(Clone)]
pub struct GLSourceResponse(Rc<RefCell<Option<DrawnResponse>>>);

impl GLSourceResponse {
    pub fn new() -> GLSourceResponse {
        GLSourceResponse(Rc::new(RefCell::new(None)))
    }
    
    pub fn set(&mut self, result: SourceResponse) {
        *self.0.borrow_mut() = Some(DrawnResponse::new(result));
    }
    
    pub fn take(&mut self) -> Option<DrawnResponse> {
        self.0.borrow_mut().take()
    }
    
    pub fn check(&self) -> bool {
        self.0.borrow().is_some()
    }
}
