use std::cmp::{ Eq, PartialEq };
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::state::StateExpr;
use composit::{ Source, LeafComponent, Leaf };

pub struct Component {
    ooe: Rc<StateExpr>,
    source: Box<Source>,
    index: Option<u32>
}

impl Component {
    pub fn new(source: Box<Source>, ooe: Rc<StateExpr>) -> Component {
        Component { ooe, source, index: None }
    }
    
    pub fn make_leafcomp(&self, leaf: &Leaf) -> LeafComponent {
        let mut out = LeafComponent::new(&self.ooe,self.index.unwrap());
        self.source.populate(&mut out.get_lcbuilder(),leaf);
        out
    }
    
    pub fn set_index(&mut self, index: u32) {
        self.index = Some(index);
    }
}

impl PartialEq for Component {
    fn eq(&self, other: &Component) -> bool {
        self.index == other.index
    }
}
impl Eq for Component {}

impl Hash for Component {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.index.hash(state);
    }
}
