/* Blocks are unblocked in two stages. An unblock can bre REQUESTED from anywhere, asynchronously.
 * The unblock only actually occurs, though, when the executor spots that request. That ensures
 * that no changes of state to block can race tast execution.
 */

use std::pin::Pin;
use std::future::Future;
use std::task::{ Context, Poll };
use crate::agent::Agent;

use std::hash::{Hash, Hasher};

sequence!(IDENTITY);

#[derive(Eq,Clone)]
pub(crate) struct NamedWait {
    identity: u64,
    name: String
}

impl Hash for NamedWait {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.identity.hash(state);
    }
}

impl PartialEq for NamedWait {
    fn eq(&self, other: &Self) -> bool {
        self.identity == other.identity
    }
}

impl NamedWait {
    pub(crate) fn new(name: &str) -> NamedWait {
        let identity = IDENTITY.next();
        NamedWait {
            name: name.to_string(),
            identity
        }
    }

    pub(crate) fn get_name(&self) -> &str {
        &self.name
    }
}

pub struct NamedFuture<R> {
    context: Agent,
    inner: Pin<Box<dyn Future<Output=R>>>,
    name: String,
    namedwait: Option<NamedWait>
}

impl<R> NamedFuture<R> where R: Send {
    pub(crate) fn new<T>(context: &Agent, inner: T, name: &str) -> NamedFuture<R> where T: Future<Output=R> + 'static + Send {
        NamedFuture {
            inner: Box::pin(inner),
            context: context.clone(),
            name: name.to_string(),
            namedwait: None
        }
    }
}

impl<R> Future for NamedFuture<R> {
    type Output = R;

    fn poll(mut self: Pin<&mut Self>, context: &mut Context) -> Poll<R> {
        if self.namedwait.is_none() {
            let namedwait = NamedWait::new(&self.name);
            self.context.push_wait(&namedwait);
            self.namedwait = Some(namedwait);
        }
        let out = self.inner.as_mut().poll(context);
        match &out {
            Poll::Ready(_) => {
                if let Some(namedwait) = self.namedwait.take() {
                    self.context.pop_wait(&namedwait);
                }
            },
            _ => ()
        };
        return out;
    }
}

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;
    use crate::oneshot::OneShot;
    use crate::testintegration::TestIntegration;
    use crate::executor::Executor;
    use crate::slot::RunSlot;
    use crate::runconfig::RunConfig;
    use std::future::Future;
    use std::sync::{ Arc, Mutex };
    use futures::future;

    #[test]
    pub fn test_named_smoke() {
        let mut integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.make_context(&cfg,"first-name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(1).await;
            let agent3 = agent2.clone();
            agent2.named_wait(async move {
                agent3.tick(1).await;
            },"test").await;
            agent2.tick(1).await;
        };
        let mut handle = x.add(step,agent);
        assert_eq!("first-name",handle.get_name());
        assert_eq!(0,handle.get_waits().len());
        x.tick(1.);
        assert_eq!(0,handle.get_waits().len());
        x.tick(1.);
        assert_eq!(vec!["test"],handle.get_waits());
        x.tick(1.);
        assert_eq!(0,handle.get_waits().len());
    }
}
