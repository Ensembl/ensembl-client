use std::rc::Rc;
use std::collections::HashMap;

pub trait OnOffExpr {
    fn is_on(&self, _m: &OnOffManager) -> bool { false }
}

pub struct OnOffFixed(pub bool);

impl OnOffExpr for OnOffFixed {
    fn is_on(&self, _m: &OnOffManager) -> bool { self.0 }
}

pub struct OnOffAtom {
    name: String
}

impl OnOffAtom {
    fn new(name: &str) -> OnOffAtom {
        OnOffAtom {
            name: name.to_string()
        }
    }
}

impl OnOffExpr for OnOffAtom {
    fn is_on(&self, m: &OnOffManager) -> bool {
        m.get_atom_state(&self.name)
    }
}

#[allow(unused)]
pub enum OnOffOp {
    And(Rc<OnOffExpr>,Rc<OnOffExpr>),
    Or(Rc<OnOffExpr>,Rc<OnOffExpr>),
    Not(Rc<OnOffExpr>)
}

impl OnOffExpr for OnOffOp {
    fn is_on(&self, m: &OnOffManager) -> bool {
        match self {
        OnOffOp::And(a,b) =>
            a.is_on(m) && b.is_on(m),
        OnOffOp::Or(a,b) =>
            a.is_on(m) || b.is_on(m),
        OnOffOp::Not(a) =>
            !a.is_on(m)
        }
    }    
}

#[allow(unused,dead_code)]
pub struct OnOffManager {
    atoms: HashMap<String,bool>,
    exprs: HashMap<String,Rc<OnOffExpr>>,
    changed: bool
}

#[allow(unused)]
impl OnOffManager {
    pub fn new() -> OnOffManager {
        OnOffManager {
            atoms: HashMap::<String,bool>::new(),
            exprs: HashMap::<String,Rc<OnOffExpr>>::new(),
            changed: false
        }
    }
    
    pub fn get_atom(&self, name: &str) -> OnOffAtom {
        OnOffAtom::new(name)
    }
    
    fn get_atom_state(&self, name: &str) -> bool {
        *self.atoms.get(name).unwrap_or(&false)
    }
    
    pub fn set_atom_state(&mut self, name: &str, val: bool) {
       self.atoms.insert(name.to_string(),val); 
       self.changed = true;
    }
    
    pub fn has_changed(&self) -> bool { self.changed }
    pub fn reset_changed(&mut self) { self.changed = false; }
}
