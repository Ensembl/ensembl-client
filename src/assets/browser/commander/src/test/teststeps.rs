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

pub struct Waiter(pub u64,pub bool);

impl Step<(),i32,()> for Waiter {
    fn execute(&mut self, _: &(), control: &mut StepControl) -> StepState<i32,()> {
        if self.1 {
            StepState::Done(Ok(23))
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
