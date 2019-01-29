use std::collections::HashMap;

use controller::global::App;

struct TimerImpl {
    cb: Box<FnMut(&mut App, f64) + 'static>,
    min_interval: Option<f64>,
    last_run: Option<f64>
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
    
    pub fn add<F>(&mut self, cb: F, min_interval: Option<f64>) -> Timer where F: FnMut(&mut App, f64) + 'static {
        let idx = self.next;
        self.next += 1;
        self.timers.insert(idx,TimerImpl {
            cb: Box::new(cb),
            min_interval,
            last_run: None
        });
        Timer(idx)
    }

    #[allow(unused)]
    pub fn remove(&mut self, t: Timer) {
        self.timers.remove(&t.0);
    }
    
    pub fn run(&mut self, cg: &mut App, time: f64) {
        for t in self.timers.values_mut() {
            if let Some(min_interval) = t.min_interval {
                if let Some(last_run) = t.last_run {
                    if last_run + min_interval > time { return; }
                }
            }
            (t.cb)(cg,time);
            t.last_run = Some(time);
        }
    }
}
