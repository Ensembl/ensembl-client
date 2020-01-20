use std::pin::Pin;
use std::future::Future;
use std::task::{ Context, Poll };

use crate::taskcontext::TaskContext;
use futures::task::{ ArcWake, waker_ref };

pub struct TurnstileFuture<R> {
    context: TaskContext,
    inner: Pin<Box<Future<Output=R>>>
}

impl<R> TurnstileFuture<R> {
    pub fn new<T>(context: &TaskContext, inner: T) -> TurnstileFuture<R> where T: Future<Output=R> + 'static {
        TurnstileFuture {
            inner: Box::pin(inner),
            context: context.clone()
        }
    }
}

impl<R> Future for TurnstileFuture<R> {
    type Output = R;

    fn poll(mut self: Pin<&mut Self>, context: &mut Context) -> Poll<R> {
        let block = self.context.push_block();
        let waker = block.future_waker();
        let out = self.inner.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker)));
        self.context.pop_block();
        out
    }
}