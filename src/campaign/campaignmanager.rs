use std::collections::HashMap;

use arena::ArenaData;
use program::Program;
use campaign::{ Campaign, OnOffManager };

pub struct CampaignManager {
    idx: u32,
    requests: HashMap<u32,Campaign>
}

#[allow(unused)]
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
    
    pub fn into_objects(&mut self, map: &mut HashMap<String,Program>,
                        adata: &mut ArenaData, oom: &OnOffManager) {
        for r in &mut self.requests.values_mut() {
            r.into_objects(map,adata,oom);
        }
    }
}
