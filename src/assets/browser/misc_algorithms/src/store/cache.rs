use std::hash::{ Hash, Hasher };
use std::collections::hash_map::DefaultHasher;
use std::marker::PhantomData;

/* 4-bit true LRU via bitmask: see lrugen.py */
const CACHE_LRU : [u8;64] = [
  3,  3,  9,  3,  3,  9,  3,  3,
  9,  9,  9,  0,  9,  9,  9,  0,
  9,  9,  9,  9,  1,  9,  1,  9,
  9,  9,  9,  9,  9,  9,  1,  0,
  2,  2,  9,  9,  9,  9,  9,  9,
  9,  2,  9,  0,  9,  9,  9,  9,
  2,  9,  9,  9,  1,  9,  9,  9,
  2,  2,  9,  0,  1,  9,  1,  0
];

const CACHE_USE_KEEP : [u8;4] = [
  0b110100, 0b101011, 0b011111, 0b111111
];

const CACHE_USE_SET : [u8;4] = [
  0b000000, 0b000001, 0b000110, 0b111000
];

pub struct Cache<K,V> {
    _k: PhantomData<K>,
    values: Vec<Option<(u64,V)>>,
    lru: Vec<u8>,
    dropper: Option<Box<dyn FnMut(usize,V)>>
}

impl<K,V> Cache<K,V> where K:Eq+Hash {
    pub fn new(size: usize) -> Cache<K,V> {
        if size % 4 != 0 {
            panic!("Cache size must be multiple of 4!");
        }
        let mut values = Vec::<Option<(u64,V)>>::new();
        values.reserve(size);
        for _ in 0..size {
            values.push(None);
        }
        let lru = std::iter::repeat(63).take(size/4).collect();
        Cache {
            _k: PhantomData,
            values,
            lru,
            dropper: None
        }
    }
    
    pub fn set_dropper(&mut self, cb: Box<dyn FnMut(usize,V)>) {
        self.dropper = Some(cb);
    }

    fn hash(&self, key: &K) -> u64 {
        let mut hasher = DefaultHasher::new();
        key.hash(&mut hasher);
        hasher.finish()
    }
    
    pub fn put(&mut self, key: &K, value: V) -> usize {
        let hash = self.hash(key);
        let h = hash as usize % (self.values.len()/4);
        let mut c = self.lru[h];
        let pos = CACHE_LRU[c as usize] as usize;
        if pos == 9 { panic!("Bad lookup ({:?})!",c); }
        c &= CACHE_USE_KEEP[pos];
        c |= CACHE_USE_SET[pos];
        self.lru[h] = c;
        let slot = h*4+pos;
        if let Some(old) = self.values[slot].take() {
            if let Some(ref mut cb) = self.dropper {
                cb(slot,old.1);
            }
        }
        let slot = h*4+pos;
        self.values[slot] = Some((hash,value));
        slot
    }
    
    pub fn get(&mut self, key: &K) -> Option<&V> {
        let hash = self.hash(key);
        let h = hash as usize % (self.values.len()/4);
        let mut c = self.lru[h];
        for i in 0..4 {
            if let Some((k,ref v)) = self.values[4*h+i] {
                if k == hash {
                    c &= CACHE_USE_KEEP[i as usize];
                    c |= CACHE_USE_SET[i as usize];
                    self.lru[h] = c;
                    return Some(v)
                }
            }
        }
        None
    }

    pub fn get_row(&self, row: usize) -> Option<&V> {
        self.values[row].as_ref().map(|v| &v.1)
    }
}

#[cfg(test)]
mod test {
    use std::rc::Rc;
    use std::cell::RefCell;
    use super::*;

    #[test]
    fn cache_smoke() {
        let mut c = Cache::<u32,u32>::new(4);
        let d = Rc::new(RefCell::new(Vec::<(usize,u32)>::new()));
        let d2 = d.clone();
        c.set_dropper(Box::new(move |slot,v|
            d2.borrow_mut().push((slot,v))
        ));
        assert_eq!(0,c.put(&0,0));
        assert_eq!(1,c.put(&1,1));
        assert_eq!(2,c.put(&2,2));
        assert_eq!(3,c.put(&3,3)); /* lru 0123 mru (0123) */
        assert_eq!(0,c.put(&4,4)); /* lru 1230 mru (4123)  */
        assert_eq!(Some(&1),c.get(&1)); /* lru 2301 mru (4123) */
        assert_eq!(2,c.put(&5,5)); /* lru 3012 mru (4153) */
        let v: Vec<u32> = c.values.iter().map(|v| v.unwrap().1).collect();
        assert_eq!(vec![4,1,5,3],v);
        /* lru: 3<2 3<1 3<0 2<1 2<0 1<0 => 2<1<0<3 = 000111 = 7 */
        assert_eq!(vec![7],c.lru);
        assert_eq!(vec![(0,0),(2,2)],d.borrow_mut().clone());
    }
}