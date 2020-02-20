/* A Tidier is a future which wraps an inner future. It is guaranteed that the
 * inner future is driven to completion even if a task is killed. The inner
 * future can be completed by awaiting on the returned Tidier. If this doesn't
 * happen, it is run when the task is finished. This is useful for freeing up
 * resources when also using kills or slots.
 */

use std::pin::Pin;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use std::task::{ Context, Poll };

sequence!(IDENTITY);

pub struct TidierState {
    future: Pin<Box<dyn Future<Output=()> + Send>>,
    done: bool
}

#[derive(Clone)]
pub struct Tidier {
    state: Arc<Mutex<TidierState>>,
    identity: u64
}

hashable!(IDENTITY,Tidier,identity);

impl Tidier {
    pub(crate) fn new(future: Pin<Box<dyn Future<Output=()> + Send>>) -> Tidier {
        Tidier {
            state: Arc::new(Mutex::new(TidierState {
                future,
                done: false
            })),
            identity: IDENTITY.next()
        }
    }

    pub(crate) fn finished(&self) -> bool { self.state.lock().unwrap().done }
}

impl Future for Tidier {
    type Output = ();

    fn poll(self: Pin<&mut Self>, waker: &mut Context) -> Poll<()> {
        let mut state = self.state.lock().unwrap();
        if state.done {
            return Poll::Ready(());
        }
        let out = state.future.as_mut().poll(waker);
        if let Poll::Ready(_) = out {
            state.done = true;
        }
        out
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::integration::testintegration::TestIntegration;
    use crate::executor::executor::Executor;
    use crate::task::runconfig::RunConfig;
    use crate::task::task::TaskResult;

    #[test]
    pub fn test_tidier_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(false));
        let tidied2 = tidied.clone();
        let step = async move {
            agent2.tidy(async move {
                *tidied2.lock().unwrap() = true;
            });
            agent2.tick(1).await;
        };
        let handle = x.add(step,agent);
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.tick(1.);
        assert!(!*tidied.lock().unwrap());
        x.tick(1.);
        assert!(*tidied.lock().unwrap());
    }

    #[test]
    pub fn test_tidier_once() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(false));
        let tidied2 = tidied.clone();
        let step = async move {
            let t = agent2.tidy(async move {
                *tidied2.lock().unwrap() = true;
            });
            agent2.tick(1).await;
            t.await;
            agent2.tick(1).await;
        };
        let handle = x.add(step,agent);
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.tick(1.);
        assert!(!*tidied.lock().unwrap());
        x.tick(1.);
        assert!(*tidied.lock().unwrap());
        *tidied.lock().unwrap() = false;
        x.tick(1.);
        assert!(!*tidied.lock().unwrap());
    }

    #[test]
    pub fn test_tidier_multiple() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let agent2 = agent.clone();
        let tidied = Arc::new(Mutex::new(0));
        let tidied2 = tidied.clone();
        let step = async move {
            let tidied3 = tidied2.clone();
            agent2.tidy(async move {
                *tidied3.lock().unwrap() += 1;
            });
            let tidied4 = tidied2.clone();
            let u = agent2.tidy(async move {
                *tidied4.lock().unwrap() += 2;
            });
            agent2.tidy(async move {
                *tidied2.lock().unwrap() += 4;
            });
            agent2.tick(1).await;
            u.await;
            agent2.tick(1).await;
        };
        let handle = x.add(step,agent);
        assert!(handle.peek_result() == TaskResult::Ongoing);
        x.tick(1.);
        assert_eq!(*tidied.lock().unwrap(),0);
        x.tick(1.);
        assert_eq!(*tidied.lock().unwrap(),2);
        x.tick(1.);
        assert_eq!(*tidied.lock().unwrap(),7);
    }
}
