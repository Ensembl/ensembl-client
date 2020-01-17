use std::sync::{ Arc, Mutex };
use std::future::{ Future };
use std::pin::Pin;
use std::task::Poll;
use futures::task::{ Context, Waker };

struct OneShotState {
    flag: bool,
    waker: Option<Waker>
}

#[derive(Clone)]
pub struct OneShot(Arc<Mutex<OneShotState>>);

impl OneShot {
    pub fn new() -> OneShot {
        OneShot(Arc::new(Mutex::new(OneShotState {
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

impl Future for OneShot {
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
