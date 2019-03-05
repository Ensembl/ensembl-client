pub struct ChangeDetect<T> where T: Clone + PartialEq {
    prev: Option<T>,
    pending: Option<T>
}

impl<T> ChangeDetect<T> where T: Clone + PartialEq {
    pub fn new() -> ChangeDetect<T> {
        ChangeDetect {
            prev: None,
            pending: None
        }
    }
    
    pub fn set(&mut self, value: T) {
        if let Some(ref old_value) = self.prev {
            if value == *old_value { return; }
        }
        self.prev = Some(value.clone());
        self.pending = Some(value);
    }
    
    pub fn report(&mut self) -> Option<T> {
        self.pending.take()
    }
}
