use std::sync::{ Arc, Mutex, MutexGuard };
use crate::taskcontext::TaskContext;
use crate::integration::{ CommanderIntegration2, SleepQuantity };

#[derive(Clone)] // XXX test only
pub(crate) enum TestState<R> {
    //Again,
    Block,
    Done(R),
}

#[derive(Clone)]
pub struct TestIntegration {
    timer: Arc<Mutex<f64>>,
    sleeps: Arc<Mutex<Vec<SleepQuantity>>>
}

impl TestIntegration {
    pub(crate) fn new() -> TestIntegration {
        TestIntegration {
            timer: Arc::new(Mutex::new(0.)),
            sleeps: Arc::new(Mutex::new(vec![]))
        }
    }

    pub(crate) fn get_time(&self) -> f64 { *self.timer.lock().unwrap() }
    pub(crate) fn set_time(&mut self, t: f64) { *self.timer.lock().unwrap() = t; }

    pub(crate) fn get_sleeps(&self) -> MutexGuard<Vec<SleepQuantity>> { self.sleeps.lock().unwrap() }
}

impl CommanderIntegration2 for TestIntegration {
    fn current_time(&mut self) -> f64 {*self.timer.lock().unwrap() }
    fn sleep(&self, quantity: SleepQuantity) { self.sleeps.lock().unwrap().push(quantity); }
}

pub async fn tick_helper(ctx: TaskContext, ticks: &[u64]) {
    for tick in ticks {
        ctx.tick(*tick).await;
    }
}
