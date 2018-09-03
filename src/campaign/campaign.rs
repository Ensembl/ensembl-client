use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use shape::{ Shape, ShapeContext };
use program::Program;
use campaign::onoff::{ OnOffManager, OnOffExpr };
use drawing::Drawing;
use geometry::ProgramType;

pub struct Campaign {
    pub id: Option<u32>,
    ooe: Rc<OnOffExpr>,
    contexts: Vec<Box<ShapeContext>>,
    shapes: Vec<(Option<Drawing>,Box<Shape>)>,
}

impl Campaign {
    pub fn new(ooe: Rc<OnOffExpr>) -> Campaign {
        Campaign {
            contexts: Vec::<Box<ShapeContext>>::new(),
            shapes: Vec::<(Option<Drawing>,Box<Shape>)>::new(),
            ooe, id: None
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn add_item(&mut self, req: Option<Drawing>, item: Box<Shape>) {
        self.shapes.push((req,item));
    }
    
    pub fn into_objects(&mut self, map: &mut HashMap<ProgramType,Program>,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        /* context */
        for c in &mut self.contexts {
            c.reset();
        }
        for (ref gk,ref mut geom) in map.iter_mut() {
            for c in &mut self.contexts {
                c.into_objects(gk,&mut geom.data,adata);
            }
        }
        /* shapes */                    
        let src = &adata.leafdrawman;
        for (ref mut req,ref mut s) in &mut self.shapes {
            if self.ooe.is_on(oom) {
                if let Some(req) = req {
                  let tp = req.measure(src);
                  s.set_texpos(&tp);
                }
                let geom_name = s.get_geometry();
                if let Some(geom) = map.get_mut(&geom_name) {                
                    s.into_objects(geom_name,&mut geom.data,adata);
                }
            }
        }
    }
}
