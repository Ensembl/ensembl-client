use std::rc::Rc;

use composit::state::{ StateExpr, StateValue, StateManager };

#[derive(Clone)]
pub struct SourcePart {
    part: Option<String>,
    ooe: Rc<StateExpr>
}

impl SourcePart {
    pub(in super) fn new(part: Option<&str>, ooe: &Rc<StateExpr>) -> SourcePart {
        SourcePart { part: part.map(|x| x.to_string()), ooe: ooe.clone() }
    }
    
    pub(in super) fn is_on(&self, m: &StateManager) -> StateValue {
        self.ooe.is_on(m)
    }
}
