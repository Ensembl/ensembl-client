use std::sync::{ Arc, Mutex };
use binary_heap_plus::{ BinaryHeap, MinComparator };
use std::cmp::{ Ordering };

#[derive(Clone)]
pub struct Trigger(Arc<Mutex<bool>>);

impl Trigger {
    pub fn set(&self) {
        *self.0.lock().unwrap() = true;
    }
}

pub struct OneShot<'a> {
    trigger: Trigger,
    callback: Option<Box<dyn FnOnce() + 'a>>
}

impl<'a> OneShot<'a> {
    pub fn new<T>(callback: T) -> OneShot<'a> where T: FnOnce() + 'a {
        OneShot {
            trigger: Trigger(Arc::new(Mutex::new(false))),
            callback: Some(Box::new(callback))
        }
    }

    pub fn get_trigger(&self) -> &Trigger { &self.trigger }

    pub fn set(&self) {
        self.trigger.set()
    }

    pub fn reset(&mut self) -> bool {
        let mut flag = self.trigger.0.lock().unwrap();
        if *flag {
            (self.callback.take().unwrap())();
            *flag = false;
            true
        } else {
            false
        }
    }
}
