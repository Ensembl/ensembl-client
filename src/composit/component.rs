use std::rc::Rc;

use composit::state::StateExpr;
use composit::{ Source, LeafComponent, Leaf };

pub struct Component {
    ooe: Rc<StateExpr>,
    source: Box<Source>
}

impl Component {
    pub fn new(source: Box<Source>, ooe: Rc<StateExpr>) -> Component {
        Component { ooe, source }
    }
    
    pub fn make_leafcomp(&self, leaf: &Leaf) -> LeafComponent {
        let mut out = LeafComponent::new(&self.ooe);
        self.source.populate(&mut out,leaf);
        out
    }
}
