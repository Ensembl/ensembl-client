use arena::ArenaData;
use program::ProgramAttribs;

pub trait Shape {
    fn process(&self, geom: &mut ProgramAttribs, adata: &ArenaData);
}

pub struct ShapeManager {
    requests: Vec<Box<Shape>>
}

impl ShapeManager {
    pub fn new() -> ShapeManager {
        ShapeManager {
            requests: Vec::<Box<Shape>>::new()
        }
    }
    
    pub fn add_item(&mut self, item: Box<Shape>) {
        self.requests.push(item);
    }
    
    pub fn draw(&mut self, tg: &mut ProgramAttribs, adata: &mut ArenaData) {
        for obj in &mut self.requests {
            obj.process(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
