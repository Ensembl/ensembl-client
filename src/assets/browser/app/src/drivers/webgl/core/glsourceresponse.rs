use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use drivers::webgl::DrawnResponse;
use shape::ShapeSpec;
use composit::SourceResponse;

#[derive(Clone)]
pub struct GLSourceResponse(Rc<RefCell<Option<DrawnResponse>>>);

impl GLSourceResponse {
    /* source/allsourceresponsebuilder */
    pub(in super) fn new() -> GLSourceResponse {
        GLSourceResponse(Rc::new(RefCell::new(None)))
    }
    
    /* source/allsourceresponsebuilder */
    pub fn set(&mut self, result: SourceResponse) {
        *self.0.borrow_mut() = Some(DrawnResponse::new(result));
    }
    
    /* train/traveller */
    pub fn take(&mut self) -> Option<DrawnResponse> {
        self.0.borrow_mut().take()
    }
    
    /* train/traveller */
    pub fn check(&self) -> bool {
        self.0.borrow().is_some()
    }
}
