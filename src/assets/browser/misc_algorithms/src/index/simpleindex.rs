use super::Walker;
use crate::store::{ BStarTree, BStarTreeWalker };

pub struct SimpleIndex {
    data: BStarTree
}

impl SimpleIndex {
    pub fn new() -> SimpleIndex {
        SimpleIndex {
            data: BStarTree::new()
        }
    }

    pub fn add(&mut self, value: usize) {
        self.data.add(value);
    }

    pub fn remove(&mut self, value: usize) {
        self.data.remove(value);
    }

    pub fn walker(&self) -> Box<dyn Walker> {
        Box::new(SimpleIndexWalker(self.data.walker()))
    }
}

pub struct SimpleIndexWalker(BStarTreeWalker);

impl Walker for SimpleIndexWalker {
    fn after(&mut self,start: usize) -> Option<usize> {
        self.0.after(start)
    }
}