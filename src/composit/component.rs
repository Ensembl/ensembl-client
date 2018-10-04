use std::rc::Rc;

use arena::{ ArenaData, ArenaPrograms };
use shape::{ Shape };
use composit::state::{ StateManager, StateExpr, StateValue, ComponentRedo };
use drawing::{ Drawing, FlatCanvasManager };

pub struct Component {
    prev_value: StateValue,
    cur_value: StateValue,
    ooe: Rc<StateExpr>,
    shapes: Vec<Box<Shape>>,
}

impl Component {
    pub fn new(ooe: Rc<StateExpr>) -> Component {
        Component {
            shapes: Vec::<Box<Shape>>::new(),
            prev_value: StateValue::OffCold(),
            cur_value: StateValue::OffCold(),
            ooe
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
    
    pub fn add_shape(&mut self, item: Box<Shape>) {
        self.shapes.push(item);
    }
    
    pub fn draw_drawings(&mut self,
                        leafdrawman: &mut FlatCanvasManager) -> Vec<Option<Drawing>> {
        let mut drawings = Vec::<Option<Drawing>>::new();
        for s in &mut self.shapes {
            let mut drawing = None;
            if let Some(a) = s.get_artist() {
                let d = leafdrawman.add_request(a);
                drawing = Some(d);
            }
            drawings.push(drawing);
        }
        drawings
    }

    pub fn into_objects(&mut self, progs: &mut ArenaPrograms,
                        leafdrawman: &FlatCanvasManager,
                        drawings: &Vec<Option<Drawing>>) {
        for (i,mut s) in self.shapes.iter().enumerate() {
            let req = &drawings[i];
            let artwork = req.as_ref().map(|r| r.artwork(&leafdrawman));
            let geom_name = s.get_geometry();
            if let Some(geom) = progs.map.get_mut(&geom_name) {                
                s.into_objects(geom_name,&mut geom.data,artwork);
            }
        }
    }
}
