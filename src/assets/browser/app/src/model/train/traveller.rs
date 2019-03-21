use std::fmt;

use composit::{
    SourceResponse, Leaf, ActiveSource,
};
use composit::{ StateManager, StateValue, ComponentRedo };
use drawing::CarriageCanvases;
use drivers::webgl::{ DrawnResponse, GLSourceResponse };

pub struct Traveller {
    comp: ActiveSource,
    prev_value: StateValue,
    cur_value: StateValue,
    srr: GLSourceResponse,
    response: Option<DrawnResponse>,
    part: Option<String>,
    leaf: Leaf
}

impl Traveller {
    pub fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf, srr: GLSourceResponse) -> Traveller {
        Traveller {
            response: None,
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            leaf: leaf.clone(),
            part: part.clone(),
            comp, srr
        }
    }
    
    pub fn is_on(&self) -> bool { self.cur_value.on() }
    
    pub(in super) fn update_state(&mut self, m: &StateManager) -> ComponentRedo {
        self.prev_value = self.cur_value;
        self.cur_value = self.comp.is_on(m,&self.part);
        
        if self.prev_value == self.cur_value {
            ComponentRedo::None // no change => Noop
        } else if self.prev_value.on() && self.cur_value.on() {
            ComponentRedo::None // was on, is on => Noop
        } else if self.prev_value.offcold() || self.cur_value.offcold() {
            ComponentRedo::Major // was/now off-cold => Major
        } else {
            ComponentRedo::Minor // was/is off-warm, is/was on => Minor
        }
    }
    
    pub(in super) fn is_done(&self) -> bool { 
        if self.srr.check() { return true; }
        return self.response.is_some();
    }
    
    fn promote(&mut self) {
        if self.response.is_none() {
            self.response = Some(self.srr.take().unwrap());
        }
    }
    
    pub fn get_response(&mut self) -> Option<&mut DrawnResponse> {
        self.promote();
        return self.response.as_mut()
    }
        
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_source(&self) -> &ActiveSource { &self.comp }
    pub(in super) fn get_part(&self) -> &Option<String> { &self.part }
}

impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}:{:?}({:?})",self.comp,self.leaf,self.part)
    }
}
