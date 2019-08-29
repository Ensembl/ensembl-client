use std::collections::HashMap;
use std::hash::Hash;

use super::{ Walker, NullWalker };
use crate::store::{ BStarTree, BStarTreeWalker };

pub struct SimpleIndex<K: Eq+Hash> {
    data: HashMap<K,BStarTree>
}

impl<K> SimpleIndex<K> where K: Eq+Hash {
    pub fn new() -> SimpleIndex<K> {
        SimpleIndex {
            data: HashMap::new()
        }
    }

    pub fn add(&mut self, key: K, value: usize) {
        self.data.entry(key).or_insert_with(|| BStarTree::new()).add(value);
    }

    pub fn remove(&mut self, key: &K, value: usize) {
        if let Some(tree) = self.data.get_mut(key) {
            tree.remove(value);
        }
    }

    pub fn walker(&self,key: &K) -> Box<dyn Walker> {
        if let Some(tree) = self.data.get(key) {
            Box::new(SimpleIndexWalker(tree.walker()))
        } else {
            Box::new(NullWalker::new())
        }
    }
}

pub struct SimpleIndexWalker(BStarTreeWalker);

impl Walker for SimpleIndexWalker {
    fn after(&mut self,start: usize) -> Option<usize> {
        self.0.after(start)
    }
}