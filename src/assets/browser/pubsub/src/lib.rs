extern crate commander;
extern crate hashbrown;
#[macro_use]
extern crate identitynumber;

use commander::CommanderStream;
use hashbrown::HashMap;
use std::sync::{ Arc, Mutex };

/* Internals:
 *
 * T = Type publisher generates
 * U = Type subscriber generates
 *
 * Listener: trait wrapping add/remove callback type APIs
 * PublisherImpl: contains subscriptions and lisener ref
 * Publisher: clonable wrapping of PublisherImpl for external use for publishing (or by Listener)
 * PublisherHandle: interface to Publisher that can only drop subsrcriptions. This functionality doesn't need T and so
 *     separating it here allows Subscriber (which needs to do such) not to depend on T.
 * PubSubState: Publisher end of a subscription. Takes a &T and puts a U into subscribers pipe. Contains filter, etc.
 * PubSub: Trait of PubSubState for publisher for publishing not dependent upon U (so publisher need not be).
 * Subscriber: Subscriber end of U pipe and PublisherHandle for deletion when dropped.
 */

pub trait Listener<T> {
    fn add(&mut self, pc: &Publisher<T>);
    fn remove(&mut self);
}

struct PublisherImpl<T> {
    listener: Option<Box<dyn Listener<T>>>,
    subs: HashMap<u64,Box<dyn PubSub<T>>>
}

impl<T> PublisherImpl<T> {
    fn new(listener: Option<Box<dyn Listener<T>>>) -> PublisherImpl<T> {
        PublisherImpl {
            listener,
            subs: HashMap::new()
        }
    }

    fn subscribe(&mut self, twin: &Publisher<T>, id: u64, sub: Box<dyn PubSub<T>>) {
        if self.subs.len() == 0 {
            if let Some(listener) = self.listener.as_mut() {
                listener.add(twin);
            }
        }
        self.subs.insert(id,sub);
    }

    fn publish(&self, value: T) {
        for sub in self.subs.values() {
            sub.publish(&value);
        }
    }

    fn remove(&mut self, id: u64) {
        self.subs.remove(&id);
        if self.subs.len() == 0 {
            if let Some(listener) = self.listener.as_mut() {
                listener.remove();
            }
        }
    }
}

pub struct Publisher<T>(Arc<Mutex<PublisherImpl<T>>>);

impl<T> Clone for Publisher<T> {
    fn clone(&self) -> Self {
        Publisher(self.0.clone())
    }
}

impl<T> Publisher<T> {
    pub fn new(listener: Option<Box<dyn Listener<T>>>) -> Publisher<T> {
        Publisher(Arc::new(Mutex::new(PublisherImpl::new(listener))))
    }

    pub fn publish(&self, value: T) {
        self.0.lock().unwrap().publish(value);
    }

    fn subscribe<U>(&self, id: u64, sub: PubSubState<T,U>) {
        let twin = self.clone();
        self.0.lock().unwrap().subscribe(&twin,id,Box::new(sub));
    }
}

trait PublisherHandle {
    fn remove(&mut self, id: u64);
}

impl<T> PublisherHandle for Publisher<T> {
    fn remove(&mut self, id: u64) {
        self.0.lock().unwrap().remove(id);
    }
}

identitynumber!(SUB_ID);

struct PubSubState<T, U> where T: 'static, U: 'static {
    filter: Box<dyn Fn(&T) -> Option<U>>,
    stream: Arc<Mutex<CommanderStream<U>>>,
}

trait PubSub<T> {
    fn publish(&self, value: &T);
}

impl<T,U> PubSub<T> for PubSubState<T,U> {
    fn publish(&self, value: &T) {
        if let Some(u) = (self.filter)(value) {
            self.stream.lock().unwrap().add(u);
        }
    }
}

#[derive(Clone)]
pub struct Subscriber<U> {
    stream: Arc<Mutex<CommanderStream<U>>>,
    id: u64,
    pubcore: Arc<Mutex<dyn PublisherHandle>>
}

impl<U> Subscriber<U> where U: 'static {
    pub fn new<A,T>(pubcore: &Publisher<T>, filter: A) -> Subscriber<U> where T: 'static, A: Fn(&T) -> Option<U> + 'static {
        let stream = Arc::new(Mutex::new(CommanderStream::new()));
        let id = SUB_ID.next();
        let sis = PubSubState {
            filter: Box::new(filter),
            stream: stream.clone()
        };
        pubcore.subscribe(id,sis);
        Subscriber {
            stream: stream.clone(),
            id,
            pubcore: Arc::new(Mutex::new(pubcore.clone()))
        }
    }

    pub async fn next(&self) -> U {
        self.stream.lock().unwrap().get().await
    }
}

impl<U> Drop for Subscriber<U> {
    fn drop(&mut self) {
        self.pubcore.lock().unwrap().remove(self.id);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::commander::{ Executor, RunConfig, SleepQuantity, Integration, TaskResult };

    #[derive(Clone)]
    pub struct TestIntegration {}

    impl Integration for TestIntegration {
        fn current_time(&self) -> f64 { 0. }
        fn sleep(&self, _quantity: SleepQuantity) {}
    }

    async fn collect_values<T,A>(sub: Subscriber<T>, quit: A) -> Vec<T> where A: Fn(&T) -> bool, T: 'static {
        let mut out = Vec::new();
        loop {
            let x = sub.next().await;
            if (quit)(&x) {
                return out;
            }
            out.push(x);
        }
    }

    fn collect<T,A>(x: &mut Executor, sub: Subscriber<T>, quit: A) -> Vec<T> where A: Fn(&T) -> bool + 'static, T: 'static {
        let cfg = RunConfig::new(None,3,None);
        let agent = x.new_agent(&cfg,"test");
        let th = x.add(collect_values(sub,quit),agent);
        while let TaskResult::Ongoing = th.task_state() {
            x.tick(1.);
        }
        th.take_result().unwrap()
    }

    #[test]
    pub fn test_smoke() {
        let integration = TestIntegration{};
        let mut x = Executor::new(integration.clone());
        let p = Publisher::new(None);
        let s = Subscriber::new(&p,|x| Some(*x));
        p.publish(23);
        p.publish(42);
        p.publish(0);
        let r = collect(&mut x,s,|x| *x==0);
        assert_eq!(vec![23,42],r);
    }

    #[test]
    pub fn test_multisub() {
        let integration = TestIntegration{};
        let mut x = Executor::new(integration.clone());
        let p = Publisher::new(None);
        let s1 = Subscriber::new(&p,|x| Some(*x));
        p.publish(23);
        let s2 = Subscriber::new(&p,|x| Some(*x));
        p.publish(42);
        p.publish(43);
        assert_eq!(vec![23,42],collect(&mut x,s1,|x| *x == 43));
        p.publish(99);
        p.publish(0);
        assert_eq!(vec![42,43,99],collect(&mut x,s2,|x| *x == 0));
    }

    #[derive(Clone)]
    struct TestListener<T>(Arc<Mutex<Option<Publisher<T>>>>);

    impl<T> TestListener<T> {
        fn new() -> TestListener<T> {
            TestListener(Arc::new(Mutex::new(None)))
        }

        fn publish(&mut self, value: T) {
            if let Some(publisher) = &*self.0.lock().unwrap() {
                publisher.publish(value);
            }
        }

        fn active(&self) -> bool {
            self.0.lock().unwrap().is_some()
        }
    }

    impl<T> Listener<T> for TestListener<T> {
        fn add(&mut self, pc: &Publisher<T>) {
            assert!(self.0.lock().unwrap().is_none());
            *self.0.lock().unwrap() = Some(pc.clone());
        }
        
        fn remove(&mut self) {
            assert!(self.0.lock().unwrap().is_some());
            self.0.lock().unwrap().take();
        }
    }

    #[test]
    pub fn test_listener() {
        let integration = TestIntegration{};
        let mut x = Executor::new(integration.clone());
        let mut r = TestListener::new();
        let p = Publisher::new(Some(Box::new(r.clone())));
        assert!(!r.active());
        let s1 = Subscriber::new(&p,|x| Some(*x));
        assert!(r.active());
        r.publish(23);
        let s2 = Subscriber::new(&p,|x| Some(*x));
        r.publish(42);
        r.publish(43);
        assert_eq!(vec![23,42],collect(&mut x,s1,|x| *x == 43));
        r.publish(99);
        r.publish(0);
        assert_eq!(vec![42,43,99],collect(&mut x,s2,|x| *x == 0));
        assert!(!r.active());
    }
}