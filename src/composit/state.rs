use std::rc::Rc;
use std::collections::HashMap;
use std::ops::{ BitAnd, BitOr, Not };

#[derive(PartialEq,Debug)]
pub enum ComponentRedo {
    Major,
    Minor,
    None
}

impl BitOr for ComponentRedo {
    type Output = Self;
    
    fn bitor(self, other: Self) -> Self {
        if self == ComponentRedo::Major || other == ComponentRedo::Major {
            ComponentRedo::Major
        } else if self == ComponentRedo::Minor || other == ComponentRedo::Minor {
            ComponentRedo::Minor
        } else {
            ComponentRedo::None
        }
    }
}

// (on/off,permanentish?)
#[derive(Clone,Copy,PartialEq)]
pub struct StateValue(bool,bool);

impl BitAnd for StateValue {
    type Output = Self;
    
    fn bitand(self, other: Self) -> Self {
        StateValue(self.0 && other.0, 
                   (!self.1 && !other.1) || // A tmp, B tmp => tmp
                   ( self.0 && !other.1) || // A on, B tmp  => tmp
                   (other.0 && !self.1))    // B on, A tmp  => tmp
    }
}

impl BitOr for StateValue {
    type Output = Self;
    
    fn bitor(self, other: Self) -> Self {
        StateValue(self.0 || other.0,
                   (!self.1  && !other.1) || // A tmp, B tmp => tmp
                   (!other.0 && !self.1) ||  // B off, A tmp => tmp
                   (!self.0  && !other.1))   // A off, B tmp => tmp
    }
}

impl Not for StateValue {
    type Output = Self;
    
    fn not(self) -> Self {
        StateValue(!self.0,self.1)
    }
}

#[allow(unused,non_snake_case)]
impl StateValue {
    pub fn OffCold() -> StateValue { StateValue(false,true) }
    pub fn OffWarm() -> StateValue { StateValue(false,false) }
    pub fn On() -> StateValue { StateValue(true,true) }
    pub fn OnTemp() -> StateValue { StateValue(true,false) }

    
    pub fn on(self) -> bool { self.0 }
    pub fn offcold(self) -> bool { !self.0 && self.1 }
}

pub trait StateExpr {
    fn is_on(&self, _m: &StateManager) -> StateValue { StateValue::OffCold() }
}

pub struct StateFixed(pub StateValue);

impl StateExpr for StateFixed {
    fn is_on(&self, _m: &StateManager) -> StateValue { self.0 }
}

pub struct StateAtom {
    name: String
}

impl StateAtom {
    pub fn new(name: &str) -> StateAtom {
        StateAtom {
            name: name.to_string()
        }
    }
}

impl StateExpr for StateAtom {
    fn is_on(&self, m: &StateManager) -> StateValue {
        m.get_atom_state(&self.name)
    }
}

#[allow(unused)]
pub enum StateOp {
    And(Rc<StateExpr>,Rc<StateExpr>),
    Or(Rc<StateExpr>,Rc<StateExpr>),
    Not(Rc<StateExpr>)
}

impl StateExpr for StateOp {
    fn is_on(&self, m: &StateManager) -> StateValue {
        match self {
        StateOp::And(a,b) =>
            a.is_on(m) & b.is_on(m),
        StateOp::Or(a,b) =>
            a.is_on(m) | b.is_on(m),
        StateOp::Not(a) =>
            !a.is_on(m)
        }
    }    
}

#[allow(unused,dead_code)]
pub struct StateManager {
    atoms: HashMap<String,StateValue>,
    exprs: HashMap<String,Rc<StateExpr>>,
    changed: bool
}

#[allow(unused)]
impl StateManager {
    pub fn new() -> StateManager {
        StateManager {
            atoms: HashMap::<String,StateValue>::new(),
            exprs: HashMap::<String,Rc<StateExpr>>::new(),
            changed: false
        }
    }
    
    pub fn get_atom(&self, name: &str) -> StateAtom {
        StateAtom::new(name)
    }
    
    fn get_atom_state(&self, name: &str) -> StateValue {
        *self.atoms.get(name).unwrap_or(&StateValue::OffCold())
    }
    
    pub fn set_atom_state(&mut self, name: &str, val: StateValue) {
       self.atoms.insert(name.to_string(),val); 
       self.changed = true;
    }
    
    pub fn has_changed(&self) -> bool { self.changed }
    pub fn reset_changed(&mut self) { self.changed = false; }
}
