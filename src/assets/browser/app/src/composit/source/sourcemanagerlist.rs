use composit::{ ActiveSource, SourceManager };

pub struct SourceManagerList {
    cs: Vec<Box<SourceManager>>
}

impl SourceManagerList {
    pub fn new() -> SourceManagerList {
        SourceManagerList {
            cs: Vec::<Box<SourceManager>>::new()
        }
    }
    
    pub fn add_compsource(&mut self, cs: Box<SourceManager>) {
        self.cs.push(cs);
    }
}

impl SourceManager for SourceManagerList {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource> {
        self.cs.iter_mut().find_map(|cs| cs.get_component(name))
    }
}
