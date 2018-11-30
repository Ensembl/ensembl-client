use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{ Source, LeafComponent, Leaf };

pub struct Component {
    name: String,
    ooe: Rc<StateExpr>,
    source: Box<Source>
}

impl Component {
    pub fn new(name: &str, source: Box<Source>, ooe: Rc<StateExpr>) -> Component {
        Component { ooe, source, name: name.to_string() }
    }
    
    pub fn make_leafcomp(&self, leaf: &Leaf) -> LeafComponent {
        let out = LeafComponent::new(&self.ooe,&self.name);
        self.source.populate(&mut out.get_lcbuilder(),leaf);
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
