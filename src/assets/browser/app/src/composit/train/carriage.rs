use std::fmt;

use print::{ Programs, PrintEdition };
use composit::{ SourceResponse, Leaf, ActiveSource, DrawnResponse };
use composit::state::{ StateManager, StateValue, ComponentRedo };
use drawing::DrawingSession;

pub struct Carriage {
    comp: ActiveSource,
    prev_value: StateValue,
    cur_value: StateValue,
    response: Option<DrawnResponse>,
    part: Option<String>,
    leaf: Leaf
}

impl Carriage {
    pub fn new(comp: ActiveSource, part: &Option<String>, leaf: &Leaf) -> Carriage {
        Carriage {
            response: None,
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            leaf: leaf.clone(),
            part: part.clone(),
            comp
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
        self.response.as_ref().map(|x| x.get_response().is_done()).unwrap_or(false)
    }
    
    pub(in super) fn get_max_y(&self) -> i32 {
        self.response.as_ref().map(|x| x.get_response().get_max_y()).unwrap_or(0)
    }
        
    pub fn draw_drawings(&mut self, ds: &mut DrawingSession) {
        if let Some(ref mut response) = self.response {
            response.each_shape(|s| s.redraw(ds));
        }
    }

    pub fn into_objects(&mut self, 
                        progs: &mut Programs,
                        ds: &mut DrawingSession, e: &mut PrintEdition) {
        if let Some(ref mut response) = self.response {
            response.each_shape(|s| s.into_objects(progs,ds,e));
        }
    }
    
    pub fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub fn get_source(&self) -> &ActiveSource { &self.comp }
    pub(in super) fn get_part(&self) -> &Option<String> { &self.part }
    
    pub fn set_response(&mut self, r: SourceResponse) {
        self.response = Some(DrawnResponse::new(r,&self.part));
    }
}

impl fmt::Debug for Carriage {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{:?}:{:?}({:?})",self.comp,self.leaf,self.part)
    }
}
