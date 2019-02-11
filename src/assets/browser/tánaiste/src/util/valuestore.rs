use util::Smallest;

pub struct ValueStore<T> {
    smallest: Smallest,
    values: Vec<Option<T>>
}

impl<T> ValueStore<T> {
    pub fn new() -> ValueStore<T> {
        ValueStore {
            smallest: Smallest::new(),
            values: Vec::<Option<T>>::new(),
        }
    }
    
    pub fn store(&mut self, v: T) -> usize {
        let k = self.smallest.get();
        while k >= self.values.len() {
            self.values.push(None);
        }
        self.values[k] = Some(v);
        k
    }

    pub fn get_mut(&mut self, k: usize) -> &mut T {
        self.values.get_mut(k).unwrap().as_mut().unwrap()
    }
        
    pub fn replace(&mut self, k: usize, v: T) {
        self.values[k] = Some(v);
    }
    
    pub fn unstore(&mut self, k: usize) -> T {
        let out = self.values[k].take();
        self.smallest.put(k);
        out.unwrap()
    }
}
