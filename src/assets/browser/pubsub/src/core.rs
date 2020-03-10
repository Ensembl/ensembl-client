use commander::CommanderStream;
use hashbrown::HashMap;
use std::future::Future;
use std::sync::{ Arc, Mutex, Weak };

struct PubCoreImpl<T: Clone> {
    subs: HashMap<u64,Weak<Mutex<CommanderStream<T>>>>
}

impl<T> PubCoreImpl<T> where T: Clone {
    fn new() -> PubCoreImpl<T> {
        PubCoreImpl {
            subs: HashMap::new()
        }
    }

    fn subscribe<U>(&mut self, sub: &SubCore<T,U>) {
        self.subs.insert(sub.id,Arc::downgrade(&sub.stream));
    }

    fn remove(&mut self, id: u64) {
        self.subs.remove(&id);
    }

    fn publish(&self, value: T) {
        for sub in self.subs.values() {
            if let Some(promise) = sub.upgrade() {
                promise.lock().unwrap().add(value.clone());
            }
        }
    }
}

#[derive(Clone)]
struct PubCore<T: Clone>(Arc<Mutex<PubCoreImpl<T>>>);

impl<T> PubCore<T> where T: Clone {
    fn new() -> PubCore<T> {
        PubCore(Arc::new(Mutex::new(PubCoreImpl::new())))
    }

    fn subscribe<U>(&mut self, sub: &SubCore<T,U>) {
        self.0.lock().unwrap().subscribe(sub);
    }

    fn remove(&self, id: u64) {
        self.0.lock().unwrap().remove(id);
    }
}

trait PubCorePublisher<T> {
    fn publish(&self, value: T);
}

impl<T> PubCorePublisher<T> for PubCore<T> where T: Clone {
    fn publish(&self, value: T) {
        self.0.lock().unwrap().publish(value);
    }
}

identitynumber!(SUB_ID);

struct SubCore<T: Clone, U> {
    filter: Box<dyn Fn(T) -> Option<U>>,
    stream: Arc<Mutex<CommanderStream<T>>>,
    id: u64,
    pubcore: PubCore<T>
}

impl<T,U> SubCore<T,U> where T: Clone {
    pub fn new<A>(pubcore: &mut PubCore<T>, filter: A) -> SubCore<T,U> where A: Fn(T) -> Option<U> + 'static {
        let sub_core = SubCore {
            filter: Box::new(filter),
            stream: Arc::new(Mutex::new(CommanderStream::new())),
            id: SUB_ID.next(),
            pubcore: pubcore.clone()
        };
        pubcore.subscribe(&sub_core);
        sub_core
    }

    async fn next(&self) -> Option<U> {
        loop {
            let t = self.stream.lock().unwrap().get().await;
            if let Some(u) = (self.filter)(t) {
                return Some(u);
            }
        }
    }
}

impl<T,U> Drop for SubCore<T,U> where T: Clone {
    fn drop(&mut self) {
        self.pubcore.remove(self.id);
    }
}