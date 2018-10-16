use std::rc::Rc;

use print::{ Programs, PrintEdition };
use shape::{ DrawnShape, ShapeSpec };
use composit::state::{ StateManager, StateExpr, StateValue, ComponentRedo };
use composit::{ Source, LeafComponent, Leaf };
use drawing::DrawingSession;

pub struct Component {
    ooe: Rc<StateExpr>,
    shapes: Vec<DrawnShape>,
    source: Box<Source>
}

impl Component {
    pub fn new(source: Box<Source>, ooe: Rc<StateExpr>) -> Component {
        Component {
            shapes: Vec::<DrawnShape>::new(),
            ooe,
            source: source
        }
    }
    
    pub fn make_leafcomp(&self, leaf: &Leaf) -> LeafComponent {
        let mut out = LeafComponent::new(&self.source,&self.ooe);
        self.source.populate(&mut out,leaf);
        out
    }
}
