use std::rc::Rc;

use print::{ Programs, PrintEdition };
use shape::DrawnShape;
use composit::LCBuilder;
use composit::state::{ StateManager, StateExpr, StateValue, ComponentRedo };
use drawing::DrawingSession;

pub struct LeafComponent {
    prev_value: StateValue,
    cur_value: StateValue,
    ooe: Rc<StateExpr>,
    shapes: LCBuilder,
    comp_idx: u32
}

impl LeafComponent {
    pub fn new(ooe: &Rc<StateExpr>, comp_idx: u32) -> LeafComponent {
        LeafComponent {
            shapes: LCBuilder::new(),
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            ooe: ooe.clone(),
            comp_idx
        }
    }
    
    pub fn is_on(&self) -> bool { self.cur_value.on() }
    
    pub fn update_state(&mut self, m: &StateManager) -> ComponentRedo {
        self.prev_value = self.cur_value;
        self.cur_value = self.ooe.is_on(m);
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
    
    pub fn get_lcbuilder(&self) -> LCBuilder {
        self.shapes.clone()
    }
        
    pub fn draw_drawings(&mut self, ds: &mut DrawingSession) -> bool {
        self.shapes.each_shape(|s| {
            s.redraw(ds);
        })
    }

    pub fn into_objects(&mut self, 
                        progs: &mut Programs,
                        ds: &mut DrawingSession, e: &mut PrintEdition) -> bool {
        self.shapes.each_shape(|s| {
            s.into_objects(progs,ds,e);
        })
    }
    
    pub fn get_component_index(&self) -> u32 { self.comp_idx }
}
