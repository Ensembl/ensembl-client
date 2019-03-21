use std::collections::HashMap;

use drivers::webgl::GLSourceResponse;
use super::SourceResponse;

pub struct AllSourceResponseBuilder {
    parts: HashMap<Option<String>,(SourceResponse,GLSourceResponse)>,
    done: bool
}

fn new_entry() -> (SourceResponse,GLSourceResponse) {
    (SourceResponse::new(),GLSourceResponse::new())
}

impl AllSourceResponseBuilder {    
    pub fn new(parts: &Vec<String>) -> AllSourceResponseBuilder {
        let mut out = AllSourceResponseBuilder {
            parts: HashMap::<Option<String>,(SourceResponse,GLSourceResponse)>::new(),
            done: false
        };
        for p in parts {
            out.parts.insert(Some(p.to_string()),new_entry());
        }
        out.parts.insert(None,new_entry());
        out
    }
    
    pub fn get_srr(&self, part: &Option<String>) -> GLSourceResponse {
        self.parts.get(part).map(|x| x.1.clone()).unwrap()
    }
    
    pub fn get_mut(&mut self, part: &Option<String>) -> Option<&mut SourceResponse> {
        self.parts.get_mut(part).map(|x| &mut x.0)
    }
    
    pub fn remove(&mut self, part: &Option<String>) -> Option<SourceResponse> {
        self.parts.remove(part).map(|x| x.0)
    }
    
    pub fn done(&mut self) {
        self.done = true;
        for (_,(srb,mut srr)) in self.parts.drain() {
            srr.set(srb);
        }
    }
    
    pub fn is_done(&mut self) -> bool {
        self.done
    }
}
