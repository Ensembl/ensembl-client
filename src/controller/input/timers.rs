use std::collections::HashMap;

use controller::global::App;

struct TimerImpl {
    cb: Box<FnMut(&mut App, f64) + 'static>
}

#[derive(Clone,Copy)]
pub struct Timer(u32);

pub struct Timers {
    next: u32,
    timers: HashMap<u32,TimerImpl>
}

impl Timers {
    pub fn new() -> Timers {
        Timers {
            next: 0,
            timers: HashMap::<u32,TimerImpl>::new()
        }
    }
    
    pub fn add<F>(&mut self, cb: F) -> Timer where F: FnMut(&mut App, f64) + 'static {
        let idx = self.next;
        self.next += 1;
        self.timers.insert(idx,TimerImpl {
            cb: Box::new(cb)
        });
        Timer(idx)
    }

    #[allow(unused)]
    pub fn remove(&mut self, t: Timer) {
        self.timers.remove(&t.0);
    }
    
    pub fn run(&mut self, cg: &mut App, time: f64) {
        for t in self.timers.values_mut() {
            (t.cb)(cg,time);
        }
    }
}
