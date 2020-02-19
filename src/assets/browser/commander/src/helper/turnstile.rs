/* A TurnstileFuture wraps an inner future, and ensures that the inner future
 * is not awoken by wakeup events from futures outside of it. This is useful
 * as an optimisation for exmaple in very broad joins to prevent too many
 * wakeups.
 */

use std::pin::Pin;
use std::future::Future;
use std::task::{ Context, Poll };

use crate::task::block::Block;
use crate::agent::Agent;
use futures::task::waker_ref;

pub struct TurnstileFuture<R> {
    context: Agent,
    inner: Pin<Box<dyn Future<Output=R> + 'static+Send>>,
    our_block: Option<Block>,
}

impl<R> TurnstileFuture<R> where R: Send {
    pub(crate) fn new<T>(context: &Agent, inner: T) -> TurnstileFuture<R> where T: Future<Output=R> + 'static + Send {
        TurnstileFuture {
            inner: Box::pin(inner),
            context: context.clone(),
            our_block: None
        }
    }
}

impl<R> Future for TurnstileFuture<R> {
    type Output = R;

    fn poll(mut self: Pin<&mut Self>, _context: &mut Context) -> Poll<R> {
        if let Some(ref block) = self.our_block {
            if block.is_blocked() {
                return Poll::Pending;
            }
        } else {
            let their_block = self.context.block_agent().top_block();
            self.our_block = Some(self.context.new_block(Box::new(move |_| {
                their_block.send_unblock_to_executor();
            })));
        }
        let block = self.our_block.as_ref().unwrap();
        self.context.block_agent().push_block(&block);
        let waker = block.make_waker();
        let out = self.inner.as_mut().poll(&mut Context::from_waker(&*waker_ref(&waker)));
        self.context.block_agent().pop_block();
        if let Poll::Pending = out {
            self.our_block.as_ref().unwrap().block();
        }
        out
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::helper::flagfuture::FlagFuture;
    use crate::integration::testintegration::TestIntegration;
    use crate::executor::executor::Executor;
    use crate::task::runconfig::RunConfig;
    use std::future::Future;
    use std::sync::{ Arc, Mutex };
    use futures::future;

    struct TurnstileTestBranchState {
        called: bool,
        flag: bool
    }

    #[derive(Clone)]
    struct TurnstileTestBranch(Arc<Mutex<TurnstileTestBranchState>>);

    impl TurnstileTestBranch {
        fn new() -> TurnstileTestBranch {
            TurnstileTestBranch(Arc::new(Mutex::new(
                TurnstileTestBranchState {
                    called: false,
                    flag: false
                }
            )))
        }

        fn was_called(&self) -> bool {
            self.0.lock().unwrap().called
        }

        fn reset(&mut self) {
            self.0.lock().unwrap().called = false;
        }

        fn flag(&mut self) {
            self.0.lock().unwrap().called = true;
        }
    }

    impl Future for TurnstileTestBranch {
        type Output = ();

        fn poll(mut self: Pin<&mut Self>, context: &mut Context) -> Poll<()> {
            let mut state = self.0.lock().unwrap();
            if state.flag {
                context.waker().wake_by_ref();
                state.flag = false;
            }
            state.called = true;
            Poll::Pending
        }
    }

    #[test]
    pub fn test_turnstile_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let ctx = x.new_agent(&cfg,"test");
        let ctx2 = ctx.clone();
        let mut left = TurnstileTestBranch::new();
        let mut right = TurnstileTestBranch::new();
        let left2 = left.clone();
        let right2 = right.clone();
        let step = async move {
            future::join(ctx2.turnstile(left2),ctx2.turnstile(right2)).await;
        };
        x.add(step,ctx);
        assert!(!left.was_called());
        assert!(!right.was_called());
        x.tick(10.);
        assert!(left.was_called());
        assert!(right.was_called());
        left.reset();
        right.reset();
        x.tick(10.);
        assert!(!left.was_called());
        assert!(!right.was_called());
        left.flag();
        x.tick(10.);
        assert!(left.was_called());
        assert!(!right.was_called());
        left.reset();
        right.flag();
        x.tick(10.);
        assert!(!left.was_called());
        assert!(right.was_called());
        right.reset();
        left.flag();
        right.flag();
        x.tick(10.);
        assert!(left.was_called());
        assert!(right.was_called());
        left.reset();
        right.reset();
        x.tick(10.);
        assert!(!left.was_called());
        assert!(!right.was_called());
    }
}
