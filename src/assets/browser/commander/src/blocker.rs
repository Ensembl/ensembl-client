use std::sync::{ Arc, Mutex };

#[derive(Clone)]
pub struct Blocker {
    blocked: Arc<Mutex<bool>>,
    downstream: Arc<Mutex<Vec<Blocker>>>
}

impl Blocker {
    pub(crate) fn new() -> Blocker {
        Blocker {
            blocked: Arc::new(Mutex::new(true)),
            downstream: Arc::new(Mutex::new(vec![]))
        }
    }

    pub(crate) fn add(&mut self, upstream: &Blocker) {
        upstream.downstream.lock().unwrap().push(self.clone());
    }

    pub(crate) fn unblock_real(&mut self) {
        *self.blocked.lock().unwrap() = false;
        for other in self.downstream.lock().unwrap().iter_mut() {
            other.unblock_real();
        }
    }

    pub(crate) fn is_blocked(&self) -> bool {
        *self.blocked.lock().unwrap()
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::timer::TimerSet;
    use crate::taskcontainer::TaskContainer;
    use crate::step::RunConfig;
    use crate::executoraction::ExecutorActionHandle;
    use crate::testintegration::TestIntegration;
    use crate::integration::ReenteringIntegration;

    #[test]
    pub fn test_blocker() {
        let mut b1 = Blocker::new();
        let mut b2 = Blocker::new();
        b1.add(&b2);
        assert!(b1.is_blocked());
        assert!(b2.is_blocked());
        b2.unblock_real();
        assert!(!b1.is_blocked());
        assert!(!b2.is_blocked());
    }
}