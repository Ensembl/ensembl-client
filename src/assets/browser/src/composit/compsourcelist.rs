use composit::{ Component, ComponentSource };

pub struct ComponentSourceList {
    cs: Vec<Box<ComponentSource>>
}

impl ComponentSourceList {
    pub fn new() -> ComponentSourceList {
        ComponentSourceList {
            cs: Vec::<Box<ComponentSource>>::new()
        }
    }
    
    pub fn add_compsource(&mut self, cs: Box<ComponentSource>) {
        self.cs.push(cs);
    }
}

impl ComponentSource for ComponentSourceList {
    fn get_component(&mut self, name: &str) -> Option<Component> {
        self.cs.iter_mut().find_map(|cs| cs.get_component(name))
    }
}
