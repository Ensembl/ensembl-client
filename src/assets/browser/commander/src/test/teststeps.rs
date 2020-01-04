use std::fmt::Debug;
use std::marker::PhantomData;
use std::thread;
use std::time::Duration;
use crate::{ Step, StepControl, StepState };

pub struct Adder(i32,bool);

impl Adder {
    pub fn new(val: i32) -> Adder {
        Adder(val,false)
    }
}

impl Step<i32,i32,String> for Adder {
    fn execute(&mut self, input: &i32, _: &mut StepControl) -> StepState<i32,String> {
        if !self.1 {
            self.1 = true;
            return StepState::Wait(2.);
        }
        let output = input+self.0;
        if output < 0 {
            StepState::Done(Err("Cannot generate negative numbers".to_string()))
        } else {
            StepState::Done(Ok(output))
        }
    }
}

pub struct CatchErrors();

impl Step<String,(),()> for CatchErrors {
    fn execute(&mut self, input: &String, _: &mut StepControl) -> StepState<(),()> {
        blackbox_log!("test-logger","error: {}",input);
        StepState::Done(Ok(()))
    }
}

pub struct Logger<T>(pub PhantomData<T>) where T: Send+Debug;

impl<T,E> Step<T,(),E> for Logger<T> where T: Send+Debug {
    fn execute(&mut self, input: &T, _: &mut StepControl) -> StepState<(),E> {
        blackbox_log!("test-logger","output: {:?}",input);
        StepState::Done(Ok(()))
    }
}

pub struct Waiter(u64,bool,Option<StepState<i32,()>>);

impl Waiter {
    pub fn new(time: u64, result: StepState<i32,()>) -> Waiter {
        Waiter(time,false,Some(result))
    }
}

impl Step<(),i32,()> for Waiter {
    fn execute(&mut self, _: &(), control: &mut StepControl) -> StepState<i32,()> {
        if self.1 {
            self.2.take().unwrap()
        } else {
            let t = self.0;
            let mut control = control.clone();
            thread::spawn(move || {
                thread::sleep(Duration::from_millis(t));
                control.wake();
            });
            self.1 = true;
            StepState::Sleep
        }
    }
}

pub struct Sleeper(pub f64,pub i32);

impl Step<(),i32,()> for Sleeper {
    fn execute(&mut self, _: &(), _: &mut StepControl) -> StepState<i32,()> {
        if self.1 < 3 {
            self.1 += 1;
            StepState::Wait(self.0)
        } else {
            StepState::Done(Ok(42))
        }
    }
}

pub struct Blocker(pub u64,pub i32);

impl Step<(),i32,()> for Blocker {
    fn execute(&mut self, _: &(), control: &mut StepControl) -> StepState<i32,()> {
        if self.1 < 3 {
            let t = self.0;
            self.1 += 1;
            let mut control = control.clone();
            thread::spawn(move || {
                thread::sleep(Duration::from_millis(t));
                control.wake();
            });
            StepState::Sleep
        } else {
            StepState::Done(Ok(42))
        }
    }
}

pub struct Infinite();

impl Step<(),i32,()> for Infinite {
    fn execute(&mut self, _: &(), _: &mut StepControl) -> StepState<i32,()> {
        StepState::NotDone
    }
}