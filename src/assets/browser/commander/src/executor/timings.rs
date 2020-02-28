use ordered_float::OrderedFloat;
use crate::integration::integration::SleepQuantity;
use crate::integration::reentering::ReenteringIntegration;
use super::taskcontainer::{ TaskContainer, TaskContainerHandle };
use super::timerset::TimerSet;

pub(crate) struct ExecutorTimings {
    integration: ReenteringIntegration,
    timers: TimerSet<OrderedFloat<f64>,Option<TaskContainerHandle>>,
    ticks: TimerSet<u64,Option<TaskContainerHandle>>,
    tick_index: u64
}

impl ExecutorTimings {
    pub(crate) fn new(integration: &ReenteringIntegration) -> ExecutorTimings {
        ExecutorTimings {
            integration: integration.clone(),
            timers: TimerSet::new(),
            ticks: TimerSet::new(),
            tick_index: 0,
        }
    }
    
    pub(crate) fn check_timers(&self, tasks: &TaskContainer) {
        let now = self.integration.current_time();
        let (timers,ticks) = (&self.timers,&self.ticks);
        timers.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        ticks.tidy_handles(|h| h.as_ref().map(|j| tasks.get(&j).is_some()).unwrap_or(true) );
        self.timers.check(OrderedFloat(now));
        self.ticks.check(self.tick_index);
    }

    pub(crate) fn check_ticks(&self, delta: u64) {
        self.ticks.check(self.tick_index+delta);
    }

    pub(crate) fn advance_tick(&mut self) {
        self.tick_index += 1;
    }

    pub(crate) fn get_tick_index(&self) -> u64 { self.tick_index }

    pub(crate) fn add_timer(&mut self, handle: &TaskContainerHandle, timeout: f64, callback: Box<dyn FnMut() + 'static>) {
        let now = self.integration.current_time();
        self.timers.add(Some(handle.clone()),OrderedFloat(now+timeout),callback);
    }

    pub(crate) fn add_tick(&mut self, handle: &TaskContainerHandle, tick: u64, callback: Box<dyn FnMut() + 'static>) {
        self.ticks.add(Some(handle.clone()),tick,callback);
    }

    pub(crate) fn calculate_sleep(&self, now: f64) -> SleepQuantity {
        if self.ticks.len() > 0 {
            SleepQuantity::None
        } else if let Some(timer) = self.timers.min() {
            SleepQuantity::Time(timer.0-now)
        } else {
            SleepQuantity::Forever
        }
    }
}

#[cfg(test)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;

    #[test]
    pub fn test_control_timers() {
        /* setup */
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,2,None);
        let ctx = x.new_agent(&cfg,"test");
        let tc = x.add(async {},ctx);        
        /* test */
        let shared = Arc::new(Mutex::new(false));
        let shared2 = shared.clone();
        tc.get_agent().add_timer(1.,move || { *shared2.lock().unwrap() = true; });
        x.service();
        integration.set_time(0.5);
        x.get_tasks().check_timers(x.get_timings());
        assert!(!*shared.lock().unwrap());
        integration.set_time(1.5);
        x.get_tasks().check_timers(x.get_timings());
        assert!(*shared.lock().unwrap());
    } 
}