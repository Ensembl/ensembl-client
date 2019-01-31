use std::collections::{ HashMap, HashSet };
use std::hash::Hash;

const MIN_AGED : f32 = 0.50;

pub struct Cache<K,V> where K: Clone+Eq+Hash, V: Clone {
    cache:  HashMap<K,V>,
    aged: HashSet<K>,
    size: usize
}

impl<K,V> Cache<K,V> where K:Clone+Eq+Hash, V: Clone {
    pub fn new(size: usize) -> Cache<K,V> {
        Cache {
            cache: HashMap::<K,V>::new(),
            aged: HashSet::<K>::new(),
            size
        }
    }
    
    fn fix_overfill(&mut self) {
        while self.cache.len() > self.size {
            let victim = {
                let cache = &mut self.cache;
                self.aged.iter().next().unwrap_or_else(||
                    cache.keys().next().unwrap()
                ).clone()
            };
            self.cache.remove(&victim);
            self.aged.remove(&victim);
        }
        if (self.aged.len() as f32) < MIN_AGED * self.size as f32 {
            for k in self.cache.keys() {
                self.aged.insert(k.clone());
            }
        }
    }
    
    pub fn get(&mut self, key: &K) -> Option<V> {
        if let Some(out) = self.cache.get(key) {
            self.aged.remove(key);
            Some(out.clone())
        } else {
            None
        }
    }

    pub fn put(&mut self, key: &K, value: V) {
        self.cache.insert(key.clone(),value);
        self.fix_overfill();
    }
}
