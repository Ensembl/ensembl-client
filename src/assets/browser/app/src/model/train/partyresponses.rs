use std::collections::HashMap;

use drivers::webgl::GLSourceResponse;
use model::driver::{ Printer, PrinterManager };
use composit::{ Leaf, SourceResponse };

pub struct PartyResponses {
    pm: PrinterManager,
    parts: HashMap<Option<String>,(SourceResponse,GLSourceResponse)>,
    done: bool
}

fn new_entry(pm: &mut PrinterManager, leaf: &Leaf) -> (SourceResponse,GLSourceResponse) {
    (SourceResponse::new(),pm.make_partial(leaf))
}

impl PartyResponses {
    /* travellercreator */
    pub fn new(pm: &PrinterManager, parts: &Vec<String>, leaf: &Leaf) -> PartyResponses {
        let mut out = PartyResponses {
            parts: HashMap::<Option<String>,(SourceResponse,GLSourceResponse)>::new(),
            done: false,
            pm: pm.clone()
        };
        for p in parts {
            out.parts.insert(Some(p.to_string()),new_entry(&mut out.pm,leaf));
        }
        out.parts.insert(None,new_entry(&mut out.pm,leaf));
        out
    }
    
    /* activesource */
    pub fn get_srr(&self, part: &Option<String>) -> GLSourceResponse {
        self.parts.get(part).map(|x| x.1.clone()).unwrap()
    }
    
    /* shapecmd/shape (x4), support/closure_source */
    pub fn get_mut(&mut self, part: &Option<String>) -> Option<&mut SourceResponse> {
        self.parts.get_mut(part).map(|x| &mut x.0)
    }
        
    /* tásource, tácontext, closuresource */
    pub fn done(&mut self) {
        self.done = true;
        for (_,(srb,mut srr)) in self.parts.drain() {
            srr.set(srb);
        }
    }    
}
