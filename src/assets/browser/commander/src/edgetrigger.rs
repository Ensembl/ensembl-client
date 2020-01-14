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

    pub(crate) fn reset(&mut self) {
        *self.trigger.lock().unwrap() = false;
    }

    /* NOTE: this function is dangerous to rely on because of potential races, but not
     * completely useless. If you are the only thread doing resets then returning false
     * guarantees that any operations between your last reset and immediately prior to this 
     * call, no set has been executed. Returning true guarantees nothing either way but will
     * "usually" mean that such a set call occurred. Therefore if an action which can be 
     * regarded as idempotent when considering correctness, but is potentially costly should
     * be required in the case that a set has been called between your last reset and now, it
     * can occur inside an is_set conditional.
     */
    pub(crate) fn is_set(&self) -> bool {
        *self.trigger.lock().unwrap()
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
        assert!(!trigger.is_set());
        assert!(!*shared.lock().unwrap());
        trigger.set();
        assert!(trigger.is_set());
        assert!(*shared.lock().unwrap());
        *shared.lock().unwrap() = false;
        trigger.set();
        assert!(trigger.is_set());
        assert!(!*shared.lock().unwrap());
        *shared.lock().unwrap() = true;
        trigger.reset();
        assert!(!trigger.is_set());
        assert!(*shared.lock().unwrap());
        *shared.lock().unwrap() = false;
        trigger.set();
        assert!(trigger.is_set());
        assert!(*shared.lock().unwrap());
    }
}
