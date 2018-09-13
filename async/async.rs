use std::rc::Rc;
use std::cell::RefCell;
use std::collections::VecDeque;
use std::sync::{ Arc, Mutex };

struct PostingsQueue<T>(VecDeque<Box<FnMut(&mut T)>>);

impl<T> PostingsQueue<T> {
    fn new() -> PostingsQueue<T> {
        PostingsQueue(
            VecDeque::<Box<FnMut(&mut T)>>::new()
        )
    }    
}

struct Postings<T> {
    imp: Arc<Mutex<T>>,
    runlock: Mutex<()>,
    queue: Mutex<PostingsQueue<T>>,
}

impl<T> Postings<T> {
    fn new(imp: T) -> Postings<T> {
        Postings {
            imp: Arc::new(Mutex::new(imp)),
            runlock: Mutex::new(()),
            queue: Mutex::new(PostingsQueue::new()),
        }
    }
    
    fn drain(&self, imp: Arc<Mutex<T>>) {
        loop {
            let cb = {
                let cbl = &mut self.queue.lock().unwrap();
                &mut cbl.0.pop_front()
            };
            match cb {
                None => break,
                Some(cb) => {
                    cb(&mut imp.lock().unwrap());
                }
            }
        }
    }
    
    fn maybe_drain(&self) {
        let lock = self.runlock.try_lock();
        if lock.is_ok() {
            let imp = self.imp.clone();
            self.drain(imp);
        }
    }
    
    fn run<F>(&self, cb: F) where F: FnMut(&mut T) + 'static {
        {
            let cbl = &mut self.queue.lock().unwrap();
            cbl.0.push_back(Box::new(cb));
        }
        self.maybe_drain();
    }
}

struct Inner {
}

impl Inner {
    fn method1(&mut self, g: &Global) {
        let outer = &g.outer;
        outer.method2();
        println!("method1");
    }
    
    fn method2(&mut self) {
        println!("method2");
    }
}

struct Outer(RefCell<Postings<Inner>>);

impl Outer {
    pub fn method1(&self, g: &mut Rc<RefCell<Global>>) {
        let gc = g.clone();
        self.0.borrow().run(move |e| {
            let gc = gc.clone();
            e.method1(&gc.borrow());
        });
    }

    pub fn method2(&self) {
        self.0.borrow().run(|e| e.method2());
    }
}

struct Global {
    outer: Outer
}

fn main() {
    let inner = Inner {};
    let mut outer = Outer(RefCell::new(Postings::new(inner)));
    let global = Rc::new(RefCell::new(Global { outer }));
    global.borrow().outer.method1(&mut global.clone());
}
