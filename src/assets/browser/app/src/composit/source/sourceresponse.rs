use std::collections::HashMap;

use model::driver::{ Printer, PrinterManager };
use model::train::{ TravellerResponse, TravellerResponseData };
use composit::Leaf;

pub struct SourceResponse {
    pm: PrinterManager,
    parts: HashMap<Option<String>,(TravellerResponseData,Box<TravellerResponse>)>,
    done: bool
}

fn new_entry(pm: &mut PrinterManager, leaf: &Leaf) -> (TravellerResponseData,Box<TravellerResponse>) {
    (TravellerResponseData::new(),pm.make_partial(leaf))
}

impl SourceResponse {
    pub fn new(pm: &PrinterManager, parts: &Vec<String>, leaf: &Leaf) -> SourceResponse {
        let mut out = SourceResponse {
            parts: HashMap::<Option<String>,(TravellerResponseData,Box<TravellerResponse>)>::new(),
            done: false,
            pm: pm.clone()
        };
        for p in parts {
            out.parts.insert(Some(p.to_string()),new_entry(&mut out.pm,leaf));
        }
        out.parts.insert(None,new_entry(&mut out.pm,leaf));
        out
    }
    
    pub fn get_srr(&self, part: &Option<String>) -> Box<TravellerResponse> {
        self.parts.get(part).map(|x| x.1.source_response_clone()).unwrap()
    }
    
    pub fn get_mut(&mut self, part: &Option<String>) -> Option<&mut TravellerResponseData> {
        self.parts.get_mut(part).map(|x| &mut x.0)
    }
        
    pub fn done(&mut self) {
        self.done = true;
        for (_,(srb,mut srr)) in self.parts.drain() {
            srr.set(srb);
        }
    }
}
