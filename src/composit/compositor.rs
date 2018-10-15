use std::collections::HashMap;

use composit::{ Component, StateManager };
use composit::state::ComponentRedo;

pub struct Compositor {
    idx: u32,
    components: HashMap<u32,Component>
}

pub struct ComponentRemover(u32);

#[allow(unused)]
impl Compositor {
    pub fn new() -> Compositor {
        Compositor {
            components: HashMap::<u32,Component>::new(),
            idx: 0
        }
    }
    
    pub fn add_component(&mut self, c: Component) -> ComponentRemover {
        self.idx += 1;
        self.components.insert(self.idx,c);
        ComponentRemover(self.idx)
    }

    pub fn remove(&mut self, k: ComponentRemover) {
        self.components.remove(&k.0);
    }
    
    pub fn calc_level(&mut self, oom: &StateManager) -> ComponentRedo {
        let mut redo = ComponentRedo::None;
        for c in &mut self.components.values_mut() {
            redo = redo | c.update_state(oom);
        }
        redo
    }
    
    pub fn components(&mut self) -> Vec<&mut Component> {
        self.components.values_mut().collect()
    }
}
