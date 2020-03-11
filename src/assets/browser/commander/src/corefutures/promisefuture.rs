use futures::task::{ Context, Waker };
use std::future::Future;
use std::pin::Pin;
use std::sync::{ Arc, Mutex };
use std::task::Poll;

struct PromiseFutureState<T> {
    value: Option<T>,
    waker: Option<Waker>
}

/// A PromiseFuture is pending until `satisfy(value: T)` is called in which case it is ready with that value.
/// 
/// Used internally in many places, but useful outside this crate.
pub struct PromiseFuture<T>(Arc<Mutex<PromiseFutureState<T>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<T> Clone for PromiseFuture<T> {
    fn clone(&self) -> Self {
        PromiseFuture(self.0.clone())
    }
}

impl<T> PromiseFuture<T> {
    /// Create PromiseFuture in Pending state.
    pub fn new() -> PromiseFuture<T> {
        PromiseFuture(Arc::new(Mutex::new(PromiseFutureState {
            value: None,
            waker: None
        })))
    }

    /// Satisfy promise.
    pub fn satisfy(&self, value: T) {
        let mut state = self.0.lock().unwrap();
        if state.value.is_none() {
            state.value = Some(value);
            if let Some(waker) = state.waker.take() {
                waker.wake();
            }
        }
    }
}

impl<T> Future for PromiseFuture<T> {
    type Output = T;

    fn poll(self: Pin<&mut Self>, ctx: &mut Context) -> Poll<T> {
        let mut state = self.0.lock().unwrap();
        if let Some(value) = state.value.take() {
            Poll::Ready(value)
        } else {
            state.waker = Some(ctx.waker().clone());
            Poll::Pending
        }
    }
}
