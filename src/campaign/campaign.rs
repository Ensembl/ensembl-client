use canvasutil;
use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use shape::{ Shape, ShapeContext };
use program::Program;
use campaign::onoff::{ OnOffManager, OnOffExpr };
use drawing::{ Drawing, LeafDrawingManager };
use geometry::ProgramType;

pub struct Campaign {
    pub id: Option<u32>,
    ooe: Rc<OnOffExpr>,
    contexts: Vec<Box<ShapeContext>>,
    shapes: Vec<Box<Shape>>,
}

impl Campaign {
    pub fn new(ooe: Rc<OnOffExpr>) -> Campaign {
        Campaign {
            contexts: Vec::<Box<ShapeContext>>::new(),
            shapes: Vec::<Box<Shape>>::new(),
            ooe, id: None
        }
    }
    
    pub fn add_context(&mut self, ctx: Box<ShapeContext>) {
        self.contexts.push(ctx);
    }
    
    pub fn add_item(&mut self, item: Box<Shape>) {
        self.shapes.push(item);
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
        /* canvas */
        let mut leafdrawman = LeafDrawingManager::new();
        let mut drawings = Vec::<Option<Drawing>>::new();
        for s in &mut self.shapes {
            let mut drawing = None;
            if self.ooe.is_on(oom) {
                if let Some(a) = s.get_artist() {
                    let d = leafdrawman.add_request(&mut adata.canvases,a);
                    drawing = Some(d);
                }
            }
            drawings.push(drawing);
        }
        let size = leafdrawman.allocate();
        adata.canvases.flat = Rc::new(canvasutil::FlatCanvas::create(size.0,size.1));
        leafdrawman.draw(&mut adata.canvases);
        /* shapes */
        for (i,mut s) in self.shapes.iter().enumerate() {
            let req = &drawings[i];
            if self.ooe.is_on(oom) {
                let mut tp = None;
                if let Some(ref req) = req {
                    tp = Some(req.measure(&leafdrawman));
                }
                let geom_name = s.get_geometry();
                if let Some(geom) = map.get_mut(&geom_name) {                
                    s.into_objects(geom_name,&mut geom.data,adata,tp);
                }
            }
        }
    }
}
