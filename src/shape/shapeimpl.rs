use arena::ArenaData;
use program::ProgramAttribs;

pub trait Shape {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData);
}

pub struct SolidShapeManager {
    shapes: Vec<Box<Shape>>
}

impl SolidShapeManager {
    pub fn new() -> SolidShapeManager {
        SolidShapeManager {
            shapes: Vec::<Box<Shape>>::new()
        }
    }
    
    pub fn add_item(&mut self, item: Box<Shape>) {
        self.shapes.push(item);
    }
    
    pub fn into_objects(&mut self, tg: &mut ProgramAttribs, adata: &mut ArenaData) {
        for s in &mut self.shapes {
            s.into_objects(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.shapes.clear();
    }        
}
