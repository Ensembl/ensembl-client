use std::cell::RefCell;
use std::collections::HashMap;
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use super::DrawnResponse;
use shape::ShapeSpec;
use composit::{ Leaf, SourceResponse };

#[derive(Clone)]
pub struct GLSourceResponse {
    idx: usize,
    dr: Rc<RefCell<Option<DrawnResponse>>>,
    leaf: Leaf
}

impl PartialEq for GLSourceResponse {
    fn eq(&self, other: &GLSourceResponse) -> bool {
        self.idx == other.idx
    }
}
impl Eq for GLSourceResponse {}

impl Hash for GLSourceResponse {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.idx.hash(state);
    }
}

impl GLSourceResponse {    
    /* source/allsourceresponsebuilder */
    pub(in super) fn new(idx: usize, leaf: &Leaf) -> GLSourceResponse {
        GLSourceResponse {
            idx,
            dr: Rc::new(RefCell::new(None)),
            leaf: leaf.clone()
        }
    }
    
    /* source/allsourceresponsebuilder */
    pub fn set(&mut self, result: SourceResponse) {
        *self.dr.borrow_mut() = Some(DrawnResponse::new(result));
    }
    
    /* train/traveller */
    pub fn take(&mut self) -> Option<DrawnResponse> {
        self.dr.borrow_mut().take()
    }
    
    /* train/traveller */
    pub fn check(&self) -> bool {
        self.dr.borrow().is_some()
    }
    
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
}

impl fmt::Debug for GLSourceResponse {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}[{}]",self.leaf,self.idx)
    }
}
