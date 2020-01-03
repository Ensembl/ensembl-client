use std::future::Future;
use std::pin::Pin;
use futures::executor::block_on;

use crate::commander::{ Step, StepControl,StepState };

struct FutureStep<Y> where Y: Send {
    future: Option<Pin<Box<dyn Future<Output=Y> + Send>>>
}

impl<Y> Step<(),Y> for FutureStep<Y> where Y: Send {
    fn execute(&mut self, _: &(), _: &mut StepControl) -> StepState<Y,()> {
        if let Some(future) = self.future.take() {
            StepState::Done(Ok(block_on(future))) // XXX not correct implementation
        } else {
            StepState::Done(Err(()))
        }
    }
}

pub fn future_to_step<F,Y>(future: F) -> impl Step<(),Y> where F: Future<Output=Y> + 'static + Send, Y: Send {
    FutureStep { future: Some(Box::pin(future)) }
}
