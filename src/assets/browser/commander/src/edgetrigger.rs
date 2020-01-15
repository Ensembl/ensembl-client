/* An EdgeTrigger contains a bool which runs a callback on a positive edge.
 * It protects against multiple calls to set between resets and in thread-safe.
 */

use std::sync::{ Arc, Mutex };

pub(crate) struct EdgeTrigger<'a> {
    trigger: Arc<Mutex<bool>>,
    callback: Box<dyn FnMut() + 'a + Send>
}

impl<'a> EdgeTrigger<'a> {
    pub(crate) fn new<T>(callback: T) -> EdgeTrigger<'a> where T: FnMut() + 'a + Send {
        EdgeTrigger {
            trigger: Arc::new(Mutex::new(false)),
            callback: Box::new(callback)
        }
    }

    pub(crate) fn set(&mut self) {
        let mut t = self.trigger.lock().unwrap();
        if !*t {
            *t = true;
            (self.callback)();
        }
    }
}

#[allow(unused)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::edgetrigger::EdgeTrigger;

    #[test]
    pub fn test_edge_trigger() {
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        let mut trigger = EdgeTrigger::new(|| { *shared2.lock().unwrap() = true });
        assert!(!*trigger.trigger.lock().unwrap());
        assert!(!*shared.lock().unwrap());
        trigger.set();
        assert!(*trigger.trigger.lock().unwrap());
        assert!(*shared.lock().unwrap());
        *shared.lock().unwrap() = false;
        trigger.set();
        assert!(*trigger.trigger.lock().unwrap());
        assert!(!*shared.lock().unwrap());
    }
}
