use futures::task::{ Context, Waker };
use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };
use std::task::Poll;

/* A FlagFuture is a future which is always pending until its flag method is
 * called (probably from outside the future) after which it is always ready.
 * The flag method also calls the waker.wake() method to alert the Executor
 * for speedy resumption.
 * 
 * FlagFuture is used internally in a number of places, but should also be
 * useful outside the crate.
 */

struct FlagFutureState {
    flag: bool,
    waker: Option<Waker>
}

#[derive(Clone)]
pub struct FlagFuture(Arc<Mutex<FlagFutureState>>);

impl FlagFuture {
    pub fn new() -> FlagFuture {
        FlagFuture(Arc::new(Mutex::new(FlagFutureState {
            flag: false,
            waker: None
        })))
    }

    pub fn flag(&self) {
        let mut state = self.0.lock().unwrap();
        if !state.flag {
            state.flag = true;
            if let Some(waker) = state.waker.take() {
                waker.wake();
            }
        }
    }
}

impl Future for FlagFuture {
    type Output = ();

    fn poll(self: Pin<&mut Self>, ctx: &mut Context) -> Poll<()> {
        let mut state = self.0.lock().unwrap();
        if state.flag {
            Poll::Ready(())
        } else {
            state.waker = Some(ctx.waker().clone());
            Poll::Pending
        }
    }
}
