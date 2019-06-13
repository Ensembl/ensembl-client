use std::collections::HashMap;

use model::driver::{ Printer, PrinterManager };
use model::train::{ TravellerResponse, TravellerResponseData };
use composit::Leaf;

pub struct SourceResponse {
    pm: PrinterManager,
    leaf: Leaf,
    parts: HashMap<Option<String>,(TravellerResponseData,Box<TravellerResponse>)>,
    done: bool
}

fn new_entry(pm: &mut PrinterManager, leaf: &Leaf) -> (TravellerResponseData,Box<TravellerResponse>) {
    (TravellerResponseData::new(),pm.make_traveller_response(leaf))
}

impl SourceResponse {
    pub fn new(pm: &PrinterManager, parts: &Vec<String>, leaf: &Leaf) -> SourceResponse {
        let mut out = SourceResponse {
            parts: HashMap::<Option<String>,(TravellerResponseData,Box<TravellerResponse>)>::new(),
            leaf: leaf.clone(),
            done: false,
            pm: pm.clone()
        };
        for p in parts {
            out.make_part(Some(p.to_string()));
        }
        out.make_part(None);
        out
    }

    fn new_entry(&mut self) -> (TravellerResponseData,Box<TravellerResponse>) {
        (TravellerResponseData::new(),self.pm.make_traveller_response(&self.leaf))
    }
    
    fn make_part(&mut self, name: Option<String>) {
        let entry = new_entry(&mut self.pm,&self.leaf);
        self.parts.insert(name,entry);
    }
    
    pub fn make_traveller_response(&self, part: &Option<String>) -> Box<TravellerResponse> {
        self.parts.get(part).map(|x| x.1.source_response_clone()).unwrap()
    }
    
    /* called after response receipt and decoding by decoder */
    pub fn get_data_mut(&mut self, part: &Option<String>) -> Option<&mut TravellerResponseData> {
        self.parts.get_mut(part).map(|x| &mut x.0)
    }
        
    pub fn done(&mut self) {
        self.done = true;
        for (_,(tr_data,mut tr)) in self.parts.drain() {
            tr.set_response(tr_data);
        }
    }
}
