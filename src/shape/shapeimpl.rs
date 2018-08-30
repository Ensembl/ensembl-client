use std::collections::HashMap;
use arena::{ Arena, ArenaData };
use program::{ ProgramAttribs, DataGroup };
use coord::{ Colour, RPixel };
use drawing::Drawing;

pub trait Shape {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData);
    fn set_texpos(&mut self, _data: &RPixel) {}   
}

const SPOTS : [&str;4] = [
    "stretchspot","pinspot","pinstripspot","stretchstrip"];

pub struct Spot {
    group: HashMap<&'static str,DataGroup>
}

impl Spot {
    pub fn new(arena: &mut Arena, c: &Colour) -> Spot {
        let mut groups = HashMap::<&str,DataGroup>::new();
        for g in SPOTS.iter() {    
            let geom = arena.get_geom(g);
            let group = geom.new_group();
            groups.insert(g,group);
            if let Some(obj) = geom.get_object("uColour") {
                obj.set_uniform(Some(group),c.to_uniform());
            }
        }
        Spot { group: groups }
    }
    
    pub fn get_group(&self, name: &str) -> DataGroup {
        self.group[name]
    }
}

pub enum ColourSpec<'a> {
    Colour(&'a Colour),
    Spot(&'a Spot)
}

pub struct ShapeManager {
    requests: Vec<(Option<Drawing>,Box<Shape>)>
}

impl ShapeManager {
    pub fn new() -> ShapeManager {
        ShapeManager {
            requests: Vec::<(Option<Drawing>,Box<Shape>)>::new()
        }
    }
    
    pub fn add_item(&mut self, req: Option<Drawing>, item: Box<Shape>) {
        self.requests.push((req,item));
    }
    
    pub fn into_objects(&mut self, tg: &mut ProgramAttribs, adata: &mut ArenaData) {
        let src = &adata.gtexreqman;
        for (ref mut req,ref mut obj) in &mut self.requests {
            if let Some(req) = req {
              let tp = req.measure(src);
              obj.set_texpos(&tp);
            }
            obj.into_objects(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
