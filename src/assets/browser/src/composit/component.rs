use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{ Source, Carriage, Leaf, SourceFactory };

pub struct Component {
    name: String,
    ooe: Rc<StateExpr>,
    source: Rc<Source>
}

impl Component {
    pub fn new(name: &str, source: Rc<Source>, ooe: Rc<StateExpr>) -> Component {
        Component { ooe, source, name: name.to_string() }
    }
    
    pub fn make_carriage(&self, sf: &mut SourceFactory, leaf: &Leaf) -> Carriage {
        let out = Carriage::new(&self.ooe,&self.name,leaf,&self.source);
        sf.populate_carriage(&out);
        out
    }
    
    pub fn get_name(&self) -> &str { &self.name }  
}

impl PartialEq for Component {
    fn eq(&self, other: &Component) -> bool {
        self.name == other.name
    }
}
impl Eq for Component {}

impl Hash for Component {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name.hash(state);
    }
}
