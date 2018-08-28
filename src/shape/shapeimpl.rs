use std::collections::HashMap;
use arena::{ Arena, ArenaData };
use program::{ ProgramAttribs, DataGroup };
use coord::Colour;

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

const SPOTS : [&str;2] = ["stretchspot","pinspot"];

pub struct Spot {
    group: HashMap<&'static str,DataGroup>
}

impl Spot {
    pub fn new(arena: &mut Arena, c: &Colour) -> Spot {
        let mut groups = HashMap::<&str,DataGroup>::new();
        for g in SPOTS.iter() {    
            let geom = arena.get_geom(g);
            let group = geom.new_group();
            let s = format!("{:?} -> {:?}",g,group);
            js! { console.log(@{s}); };
            groups.insert(g,group);
            if let Some(obj) = geom.get_object("uColour") {
                obj.set_uniform(Some(group),c.to_uniform());
            }
        }
        Spot { group: groups }
    }
    
    pub fn get_group(&self, name: &str) -> DataGroup {
        let s = format!("? {:?}",name);
        js! { console.log(@{s}); };
        self.group[name]
    }
}

pub enum ColourSpec {
    Colour(Colour),
    Spot(Spot)
}
