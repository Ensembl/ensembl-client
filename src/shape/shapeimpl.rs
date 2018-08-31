use std::rc::Rc;
use std::collections::HashMap;
use arena::{ Arena, ArenaData };
use program::{ ProgramAttribs, DataGroup, Program };
use coord::{ Colour, RPixel };
use drawing::Drawing;
use onoff::{ OnOffManager, OnOffExpr };

pub trait Shape {
    fn into_objects(&self, geom: &mut ProgramAttribs, adata: &ArenaData);
    fn set_texpos(&mut self, _data: &RPixel) {}
    fn get_geometry(&self) -> &str;
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
    requests: Vec<(Option<Drawing>,Box<Shape>,Rc<OnOffExpr>)>
}

impl ShapeManager {
    pub fn new() -> ShapeManager {
        ShapeManager {
            requests: Vec::<(Option<Drawing>,Box<Shape>,Rc<OnOffExpr>)>::new()
        }
    }
    
    pub fn add_item(&mut self, req: Option<Drawing>, item: Box<Shape>, ooe: Rc<OnOffExpr>) {
        self.requests.push((req,item,ooe));
    }
    
    pub fn into_objects(&mut self, map: &mut HashMap<String,Program>,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        let src = &adata.leafdrawman;
        for (ref mut req,ref mut s,ref ooe) in &mut self.requests {
            if ooe.is_on(oom) {
                if let Some(req) = req {
                  let tp = req.measure(src);
                  s.set_texpos(&tp);
                }
                if let Some(geom) = map.get_mut(s.get_geometry()) {                
                    s.into_objects(&mut geom.data,adata);
                }
            }
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
