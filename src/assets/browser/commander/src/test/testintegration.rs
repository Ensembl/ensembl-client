use std::sync::{ Arc, Mutex };
use crate::commander::{ Commander, CommanderIntegration };

use blackbox::Integration as BlackboxIntegration;

pub(super) trait EventAccumulator {
    fn test_event(&mut self, event: &str);
}

pub(super) struct TestIntegrationImpl {
    ticking: Vec<Commander>,
    time: f64,
    waiting: Vec<(Commander,Option<f64>)>
}

impl TestIntegrationImpl {
    pub(super) fn new() -> TestIntegrationImpl {
        TestIntegrationImpl {
            ticking: Vec::new(),
            time: 0.,
            waiting: Vec::new()
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
            blackbox_log!("test-integration","tick {:p}",cmdr);
            cmdr.tick(1.);
        }
    }

    fn tick(&mut self) {
        self.unwait();
        self.do_tick();
        self.time += 1.;
    }

    fn enable_ticks(&mut self, cmdr: &mut Commander) {
        assert!(self.ticking_index(cmdr).is_none());
        blackbox_log!("test-integration","ticks enabled for {:p}",cmdr);
        if let Some(idx) = self.waiting.iter().position(|(c,_)| c == cmdr) {
            self.waiting.remove(idx);
        }
        self.ticking.push(cmdr.clone());
    }

    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>) {
        match self.ticking_index(cmdr) {
            Some(pos) => {
                blackbox_log!("test-integration","ticks disabled for {:p}",cmdr);
                self.ticking.remove(pos);
                self.waiting.push((cmdr.clone(),timeout));
            },
            None => { assert!(false) }
        }
    }
}

#[derive(Clone)]
pub struct TestIntegration(Arc<Mutex<TestIntegrationImpl>>,Arc<Mutex<f64>>);

impl TestIntegration {
    pub fn new() -> TestIntegration {
        TestIntegration(Arc::new(Mutex::new(TestIntegrationImpl::new())),Arc::new(Mutex::new(0.)))
    }

    pub fn tick(&mut self) {
        self.0.lock().unwrap().tick();
        *self.1.lock().unwrap() += 1.;
    }
}

impl CommanderIntegration for TestIntegration {
    fn enable_ticks(&mut self, cmdr: &mut Commander) {
        self.0.lock().unwrap().enable_ticks(cmdr);
    }

    fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>) {
        self.0.lock().unwrap().disable_ticks(cmdr,timeout);
    }

    fn current_time(&mut self) -> f64 {
        *self.1.lock().unwrap()
    }
}

impl BlackboxIntegration for TestIntegration {
    fn get_time(&self) -> f64 { *self.1.lock().unwrap() }
    fn get_instance_id(&self) -> String { "test".to_string() }
    fn get_time_units(&self) -> String { "units".to_string() }
}
