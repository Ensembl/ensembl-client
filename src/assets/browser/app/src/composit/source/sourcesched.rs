use std::collections::HashMap;

use composit::{ Carriage, SourceResponse, ActiveSource, Leaf };
use util::Cache;

pub struct SourceSched {
    max_pending: i32,
    cache: Cache<(ActiveSource,Leaf),SourceResponse>,
    queued: Vec<(ActiveSource,Leaf,SourceResponse)>,
    pending: HashMap<(ActiveSource,Leaf),SourceResponse>
}

impl SourceSched {
    pub fn new(max_pending: i32, cache_size: usize) -> SourceSched {
        SourceSched {
            max_pending,
            cache: Cache::<(ActiveSource,Leaf),SourceResponse>::new(cache_size),
            queued: Vec::<(ActiveSource,Leaf,SourceResponse)>::new(),
            pending: HashMap::<(ActiveSource,Leaf),SourceResponse>::new()
        }
    }

    fn run_queue(&mut self) {
        while self.queued.len() > 0  && (self.pending.len() < self.max_pending as usize || self.max_pending == 0) {
            let (source,leaf,mut resp) = self.queued.remove(0);
            debug!("sources","start {:?}:{:?}",source,leaf);
            self.pending.insert((source.clone(),leaf.clone()),resp.clone());            
            source.populate(&mut resp,&leaf);
        }
    }

    fn remove_finished(&mut self) {
        let mut togo = Vec::<(ActiveSource,Leaf)>::new();
        for (k,r) in &self.pending {
            if r.is_done() {
                debug!("sources","end {:?}",k,);
                togo.push(k.clone());
            }
        }
        for k in togo {
            self.pending.remove(&k);
        }
        self.run_queue();
    }
    
    pub fn tick(&mut self, _t: f64) {
        self.remove_finished();
    }
        
    pub fn populate_carriage(&mut self, c: &mut Carriage) {
        let key = (c.get_source().clone(),c.get_leaf().clone());
        let resp = if let Some(resp) = self.cache.get(&key) {
            debug!("sources","cache {:?} [{}]",c,resp.size());
            resp
        } else {
            let mut resp = SourceResponse::new();
            debug!("sources","queue {:?}",c);
            self.queued.push((c.get_source().clone(),c.get_leaf().clone(),resp.clone()));
            self.run_queue();
            self.cache.put(&key,resp.clone());
            resp
        };
        c.set_response(resp.clone());
    }
}
