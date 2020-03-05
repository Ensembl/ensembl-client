use std::future::Future;
use std::pin::Pin;
use std::task::{ Context, Poll };
use crate::agent::agent::Agent;

/* NamedFuture implements named futures. NamedFutures wrap inner futures. While these have
 * been called at least once but are unfinished, a string is pushed into the state of the
 * task. This is useful for debugging purposes.
 * 
 * NamedWait wraps a string in a struct with per-creation uniqueness. This allows for
 * later clean removal.
 */

identitynumber!(IDENTITY);

#[derive(Clone)]
pub(crate) struct NamedWait {
    identity: u64,
    name: String
}

hashable!(NamedWait,identity);

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

pub(crate) struct NamedFuture<R> {
    agent: Agent,
    inner: Pin<Box<dyn Future<Output=R> + 'static>>,
    name: String,
    namedwait: Option<NamedWait>
}

impl<R> NamedFuture<R> {
    pub(crate) fn new<T>(agent: &Agent, inner: T, name: &str) -> NamedFuture<R> where T: Future<Output=R> + 'static {
        NamedFuture {
            inner: Box::pin(inner),
            agent: agent.clone(),
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
            self.agent.name_agent().push_wait(&namedwait);
            self.namedwait = Some(namedwait);
        }
        let out = self.inner.as_mut().poll(context);
        match &out {
            Poll::Ready(_) => {
                if let Some(namedwait) = self.namedwait.take() {
                    self.agent.name_agent().pop_wait(&namedwait);
                }
            },
            _ => ()
        };
        return out;
    }
}

#[cfg(test)]
mod test {
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;

    #[test]
    pub fn test_named_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"first-name");
        let agent2 = agent.clone();
        let step = async move {
            agent2.tick(1).await;
            let agent3 = agent2.clone();
            agent2.named_wait(async move {
                agent3.tick(1).await;
            },"test").await;
            agent2.tick(1).await;
        };
        let handle = x.add(step,agent);
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
