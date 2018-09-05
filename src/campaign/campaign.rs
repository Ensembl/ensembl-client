use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use shape::{ Shape };
use program::Program;
use campaign::onoff::{ OnOffManager, OnOffExpr };
use drawing::{ Drawing, LeafDrawingManager };
use geometry::ProgramType;

pub struct Campaign {
    ooe: Rc<OnOffExpr>,
    shapes: Vec<Box<Shape>>,
}

impl Campaign {
    pub fn new(ooe: Rc<OnOffExpr>) -> Campaign {
        Campaign {
            shapes: Vec::<Box<Shape>>::new(),
            ooe
        }
    }
        
    pub fn add_shape(&mut self, item: Box<Shape>) {
        self.shapes.push(item);
    }
    
    pub fn draw_drawings(&mut self,
                        leafdrawman: &mut LeafDrawingManager,
                        adata: &mut ArenaData, oom: &OnOffManager) -> Vec<Option<Drawing>> {
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
        drawings
    }

    pub fn into_objects(&mut self, map: &mut HashMap<ProgramType,Program>,
                        leafdrawman: &mut LeafDrawingManager,
                        adata: &mut ArenaData, oom: &OnOffManager,
                        drawings: &Vec<Option<Drawing>>) {
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
