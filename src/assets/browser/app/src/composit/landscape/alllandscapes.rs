use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Mutex };

use util::ValueStore;

use super::landscape::Landscape;

pub struct AllLandscapesImpl {
    vs: ValueStore<Landscape>,
}

impl AllLandscapesImpl {
    fn new() -> AllLandscapesImpl {
        AllLandscapesImpl {
            vs: ValueStore::<Landscape>::new(),
        }
    }
    
    fn allocate(&mut self, name: &str) -> usize {
        let out = self.vs.store(Landscape::new(name));
        out
    }
    
    fn with<F,G>(&mut self, lid: usize, cb: F) -> Option<G>
            where F: FnOnce(&mut Landscape) -> G {
        self.vs.get_mut(lid).map(|ls| cb(ls))
    }

    pub fn every<F,G>(&mut self, mut cb: F) -> Vec<Option<G>>
            where F: FnMut(usize, &mut Landscape) -> G {
        let mut out = Vec::<Option<G>>::new();
        let lids : Vec<usize> = self.vs.every().collect();
        for lid in lids {
            out.push(self.vs.get_mut(lid).map(|ls| cb(lid,ls)));
        }
        out
    }
}

#[derive(Clone)]
pub struct AllLandscapes(Rc<RefCell<AllLandscapesImpl>>);

impl AllLandscapes {
    pub fn new() -> AllLandscapes {
        AllLandscapes(Rc::new(RefCell::new(AllLandscapesImpl::new())))
    }
    
    pub fn allocate(&mut self, name: &str) -> usize {
        let lid = self.0.borrow_mut().allocate(name);
        self.with(lid,|ls| ls.set_lid(lid));
        lid
    }
    
    pub fn with<F,G>(&mut self, lid: usize, cb: F) -> Option<G>
            where F: FnOnce(&mut Landscape) -> G {
        self.0.borrow_mut().with(lid,cb)
    }
    
    pub fn every<F,G>(&mut self, mut cb: F) -> Vec<Option<G>>
            where F: FnMut(usize, &mut Landscape) -> G {
        self.0.borrow_mut().every(cb)
    }
}
