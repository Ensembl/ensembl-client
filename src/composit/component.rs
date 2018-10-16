use std::rc::Rc;

use print::{ Programs, PrintEdition };
use shape::{ DrawnShape, ShapeSpec };
use composit::state::{ StateManager, StateExpr, StateValue, ComponentRedo };
use composit::Source;
use drawing::DrawingSession;

pub struct Component {
    prev_value: StateValue,
    cur_value: StateValue,
    ooe: Rc<StateExpr>,
    shapes: Vec<DrawnShape>,
    source: Box<Source>
}

impl Component {
    pub fn new(source: Box<Source>, ooe: Rc<StateExpr>) -> Component {
        Component {
            shapes: Vec::<DrawnShape>::new(),
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            ooe,
            source: source
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
    
    pub fn add_shape(&mut self, item: ShapeSpec) {
        self.shapes.push(DrawnShape::new(item.create()));
    }
    
    pub fn draw_drawings(&mut self, ds: &mut DrawingSession) {
        for s in &mut self.shapes {
            s.redraw(ds);
        }
    }

    pub fn into_objects(&mut self, 
                        progs: &mut Programs,
                        ds: &mut DrawingSession, e: &mut PrintEdition) {
        for s in &mut self.shapes {
            s.into_objects(progs,ds,e);
        }
    }
}
