pub struct ValueStore<T> {
    values: Vec<Option<T>>,
    try: usize
}

impl<T> ValueStore<T> {
    pub fn new() -> ValueStore<T> {
        ValueStore {
            values: Vec::<Option<T>>::new(),
            try: 0,
        }
    }
    
    pub fn store(&mut self, v: T) -> usize {
        while self.try < self.values.len() {
            if self.values[self.try].is_none() {
                self.values[self.try] = Some(v);
                self.try += 1;
                return self.try-1
            } else {
                self.try += 1;
            }
        }
        self.values.push(Some(v));
        self.values.len()-1
    }
        
    pub fn replace(&mut self, k: usize, v: T) {
        self.values[k] = Some(v);
    }
    
    pub fn unstore(&mut self, k: usize) -> T {
        let out = self.values[k].take();
        self.try = k;
        out.unwrap()
    }
}
