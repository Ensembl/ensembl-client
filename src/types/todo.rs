/* A Todo brings the world of interior-mutability to event-like APIs.
 * An event like API typically has a large number of top-level entry
 * points which can invoke each other. Immediate invocation is not
 * usually necessary. Deep recursion is always bad but a depth of two
 * can be too much for Rust due to the borrow checker. Two events might
 * borrow some context object and so cannot call each other. It's
 * actually raising a legitimate concern: with direct calling, any
 * state a calling event may have could have been changed by the inner
 * event. Typically an event-driven system will have a means to delay
 * the execution of an inner event until back into the outer loop, which
 * is what Todo does for you. This has the advantage of handling the
 * mutable references for you and make the whole thing internally-
 * mutable (ie you don't need to borrow mutably to use it.
 * 
 * You provide an inner object, which excecutes the events and may issue
 * others, and an outer object which is the external API. Sandwiched
 * in-between is the Todo object. (Note that even events generated in
 * the inner object need to go through the outer layer).
 * 
 * Todos are single-threaded (deliberately). Because they don't fairly
 * distribute tasks (a run could either do nothing or a vast backlog of
 * events) there's no transparent way to implement threads, so it's
 * best left to a wrapping layer.
 * 
 * Usage is best illustrated by example:
 * 
 * struct Inner { ... }
 * impl Inner {
 *     fn method1(&mut self, e: &Outer) {
 *         ...
 *         e.method2();
 *     }
 *     ...
 * }
 *
 * struct Outer(Postings<Inner>);
 *
 * impl Outer {
 *     pub fn method1(&self, g: &mut Rc<RefCell<Global>>) {
 *         let gc = g.clone();
 *             self.0.run(move |e| {
 *             let gc = gc.clone();
 *             e.method1(&gc.borrow());
 *         });
 *     }
 *     ...
 * }
 *
 * struct Global { outer: Outer }
 *
 * fn main() {
 *    let inner = Inner {};
 *    let outer = Outer(Postings::new(inner));
 *    let global = Rc::new(RefCell::new(Global { outer }));
 *    global.borrow().outer.method1(&mut global.clone());
 * }
 */

use std::cell::RefCell;
use std::collections::VecDeque;

pub struct Todo<T> {
    imp: RefCell<T>,
    runlock: RefCell<()>,
    queue: RefCell<VecDeque<Box<FnMut(&mut T)>>>
}

impl<T> Todo<T> {
    pub fn new(imp: T) -> Todo<T> {
        Todo {
            imp: RefCell::new(imp),
            runlock: RefCell::new(()),
            queue: RefCell::new(VecDeque::<Box<FnMut(&mut T)>>::new())
        }
    }
    
    fn drain(&self, imp: &RefCell<T>) {
        loop {
            let cb = &mut self.queue.borrow_mut().pop_front();
            match cb {
                None => break,
                Some(cb) => {
                    cb(&mut imp.borrow_mut());
                }
            }
        }
    }
    
    fn maybe_drain(&self) {
        let lock = self.runlock.try_borrow_mut();
        if lock.is_ok() {
            self.drain(&self.imp);
        }
    }
    
    pub fn run<F>(&self, cb: F) where F: FnMut(&mut T) + 'static {
        self.queue.borrow_mut().push_back(Box::new(cb));
        self.maybe_drain();
    }
}
