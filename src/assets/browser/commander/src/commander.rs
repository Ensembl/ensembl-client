use std::future::Future;
use std::hash::Hash;
use std::marker::PhantomData;
use std::sync::{ Arc, Mutex };

pub struct StepSignal {

}

impl StepSignal {
    pub fn signal(&mut self) {}
}

pub trait Step<X,Y> {
    fn execute(&mut self, input: X, signal: &mut StepSignal) -> Y;
    fn tidy(&mut self, input: X);
    fn failure(&mut self, input: X);
}

pub struct Commander<S> {
    _slots: PhantomData<S>
}

impl<S> Commander<S> where S: PartialEq+Eq+Hash+Clone {
    pub fn new() -> Commander<S> {
        Commander {
            _slots: PhantomData
        }
    }

    pub fn add<T,X>(&mut self, step: T, input: X, slot: Option<&S>, priority: i8) where T: Step<X,()> {

    }

    pub fn tick(&mut self, slice: f64) {

    }
}