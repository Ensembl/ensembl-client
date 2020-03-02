use futures::task::Context;
use std::future::Future;
use std::marker::Unpin;
use std::pin::Pin;
use std::task::Poll;

pub struct ValueFuture<T: Unpin>(Option<T>);

impl<T> ValueFuture<T> where T: Unpin {
    pub fn new(v: T) -> ValueFuture<T> {
        ValueFuture(Some(v))
    }
}

impl<T> Future for ValueFuture<T> where T: Unpin {
    type Output = T;

    fn poll(self: Pin<&mut Self>, _ctx: &mut Context) -> Poll<T> {
        Poll::Ready(self.get_mut().0.take().unwrap())
    }
}