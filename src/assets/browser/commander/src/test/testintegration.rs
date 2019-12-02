use std::sync::{ Arc, Mutex };
use crate::commander::{ Commander, CommanderIntegration };

pub(super) trait EventAccumulator {
    fn test_event(&mut self, event: &str);
}

pub(super) struct TestIntegration {
    ticking: Vec<Commander>,
    time: f64,
    waiting: Vec<(Commander,Option<f64>)>,
    events: Vec<String>
}

impl TestIntegration {
    pub(super) fn new() -> TestIntegration {
        TestIntegration {
            ticking: Vec::new(),
            time: 0.,
            waiting: Vec::new(),
            events: Vec::new()
        }
    }

    fn ticking_index(&self, commander: &mut Commander) -> Option<usize> {
        self.ticking.iter().position(|c| c == commander)
    }

    fn unwait(&mut self) {
        let mut finished = Vec::new();
        for (i,(_,timeout)) in self.waiting.iter().enumerate() {
            if let Some(timeout) = timeout {
                if *timeout <= self.time {
                    finished.push(i-finished.len());
                }
            }
        }
        for idx in finished {
            self.ticking.push(self.waiting.remove(idx).0);
        }
    }

    fn do_tick(&mut self) {
        for cmdr in self.ticking.iter_mut() {
            cmdr.tick(1.);
        }
    }

    fn tick(&mut self) {
        self.unwait();
        self.do_tick();
        self.time += 1.;
    }
}

impl CommanderIntegration for TestIntegration {
    fn enable_ticks(&mut self, cmdr: &mut Commander) {
        assert!(self.ticking_index(cmdr).is_none());
        if let Some(idx) = self.waiting.iter().position(|(c,_)| c == cmdr) {
            self.waiting.remove(idx);
        }
        self.ticking.push(cmdr.clone());
    }

    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>) {
        match self.ticking_index(cmdr) {
            Some(pos) => {
                self.ticking.remove(pos);
                self.waiting.push((cmdr.clone(),timeout));
            },
            None => { assert!(false) }
        }
    }
}

impl CommanderIntegration for Arc<Mutex<TestIntegration>> {
    fn enable_ticks(&mut self, cmdr: &mut Commander) {
        self.enable_ticks(cmdr);
    }

    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>) {
        self.disable_ticks(cmdr,timeout);
    }
}
