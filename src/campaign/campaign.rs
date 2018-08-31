use std::rc::Rc;
use std::collections::HashMap;

use arena::ArenaData;
use shape::Shape;
use program::ProgramAttribs;
use onoff::{ OnOffManager, OnOffExpr };
use drawing::Drawing;

pub struct Campaign {
    id: Option<u32>,
    ooe: Rc<OnOffExpr>,
    shapes: Vec<(Option<Drawing>,Box<Shape>)>,
}

impl Campaign {
    pub fn new(ooe: Rc<OnOffExpr>) -> Campaign {
        Campaign {
            shapes: Vec::<(Option<Drawing>,Box<Shape>)>::new(),
            ooe, id: None
        }
    }
    
    pub fn add_item(&mut self, req: Option<Drawing>, item: Box<Shape>) {
        self.shapes.push((req,item));
    }
    
    pub fn into_objects(&mut self, tg: &mut ProgramAttribs,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        let src = &adata.leafdrawman;
        for (ref mut req,ref mut obj) in &mut self.shapes {
            if self.ooe.is_on(oom) {
                if let Some(req) = req {
                  let tp = req.measure(src);
                  obj.set_texpos(&tp);
                }
                obj.into_objects(tg,adata);
            }
        }
    }
}

pub struct CampaignManager {
    idx: u32,
    requests: HashMap<u32,Campaign>
}

impl CampaignManager {
    pub fn new() -> CampaignManager {
        CampaignManager {
            requests: HashMap::<u32,Campaign>::new(),
            idx: 0
        }
    }
    
    pub fn add(&mut self, mut c: Campaign) {
        self.idx += 1;
        c.id = Some(self.idx);
        self.requests.insert(self.idx,c);
    }

    pub fn remove(&mut self, c: &mut Campaign) {
        if let Some(idx) = c.id {
            c.id = None;
            self.requests.remove(&idx);
        }
    }
    
    pub fn into_objects(&mut self, tg: &mut ProgramAttribs,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        for r in &mut self.requests.values_mut() {
            r.into_objects(tg,adata,oom);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
