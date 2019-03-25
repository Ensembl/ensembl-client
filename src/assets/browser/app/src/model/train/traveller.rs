use std::fmt;

use composit::{
    SourceResponseData, Leaf, ActiveSource,
};
use composit::{ StateManager, StateValue, ComponentRedo };
use model::driver::{ Printer, PrinterManager, SourceResponse };

pub struct Traveller {
    pm: PrinterManager,
    comp: ActiveSource,
    prev_value: StateValue,
    cur_value: StateValue,
    srr: Option<Box<SourceResponse>>,
    part: Option<String>,
    leaf: Leaf
}

impl Traveller {
    pub fn new(pm: &PrinterManager, comp: ActiveSource, part: &Option<String>, leaf: &Leaf, srr: Box<SourceResponse>) -> Traveller {
        Traveller {
            pm: pm.clone(),
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            leaf: leaf.clone(),
            part: part.clone(),
            comp,
            srr: Some(srr)
        }
    }
    
    pub(in super) fn update_state(&mut self, m: &StateManager) -> ComponentRedo {
        self.prev_value = self.cur_value;
        self.cur_value = self.comp.is_on(m,&self.part);
        if self.prev_value != self.cur_value {
            self.srr.as_mut().unwrap().set_state(self.cur_value);
        }
        
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
        return self.srr.as_ref().unwrap().check();
    }
    
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
}

impl Drop for Traveller {
    fn drop(&mut self) {
        self.srr.take().unwrap().destroy();
    }
}


impl fmt::Debug for Traveller {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}:{:?}({:?})",self.comp,self.leaf,self.part)
    }
}
