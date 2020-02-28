use std::sync::{ Arc, Mutex };
use crate::dom::domutil;
use stdweb::{ Reference, Value };
use stdweb::web::{ document, HtmlElement };

lazy_static! {
    static ref IDENTITY : Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

const MESSAGE_KEY : &str = "domutil-bell";

#[derive(Clone)]
pub struct BellSender {
    el: HtmlElement,
    identity: u64
}

impl BellSender {
    fn new(identity: u64, el: &HtmlElement) -> BellSender {
        BellSender {
            el: el.clone(),
            identity
        }
    }

    pub fn ring(&self) {
        let name = &format!("{}-{}",MESSAGE_KEY,self.identity);
        js! {
            var e = new CustomEvent(@{name},{ detail: {}, bubbles: false });
            @{self.el.as_ref()}.dispatchEvent(e);
        };
    }
}

// XXX drop/unregister

struct BellReceiverCallbacks {
    callbacks: Vec<Box<FnMut() + 'static>>,
    listener: Option<Value>
}

impl BellReceiverCallbacks {
    fn new() -> BellReceiverCallbacks {
        BellReceiverCallbacks {
            callbacks: Vec::new(),
            listener: None
        }
    }

    fn add(&mut self, callback: Box<FnMut() + 'static>) {
        self.callbacks.push(callback);
    }

    fn run_all(&mut self) {
        for cb in self.callbacks.iter_mut() {
            (cb)();
        }
    }

    fn call_dom(&mut self, el: &HtmlElement, name: &str, again: BellReceiver) {
        let js_cb : Box<FnMut(Reference)> = Box::new(move |_: Reference| {
            again.callbacks.lock().unwrap().run_all();
        });
        if let Some(listener) = self.listener.take() {
            js! { @{listener}.drop() };
        }
        let el = el.clone();
        self.listener = Some(js! {
            let cb = @{js_cb};
            return @{el}.addEventListener(@{name},cb);
        });
    }
}

#[derive(Clone)]
pub struct BellReceiver {
    identity: u64,
    el: HtmlElement,
    callbacks: Arc<Mutex<BellReceiverCallbacks>>
}

impl BellReceiver {
    fn new(identity: u64, el: &HtmlElement) -> BellReceiver {
        let mut out = BellReceiver {
            identity,
            el: el.clone(),
            callbacks: Arc::new(Mutex::new(BellReceiverCallbacks::new()))
        };
        out.listen();
        out
    }

    pub fn add<T>(&mut self, callback: T) where T: FnMut() + 'static {
        self.callbacks.lock().unwrap().add(Box::new(callback));
    }

    fn listen(&mut self) {
        let mut again = self.clone();
        let name = &format!("{}-{}",MESSAGE_KEY,self.identity);
        self.callbacks.lock().unwrap().call_dom(&self.el,name,again);
    }
}

pub fn make_bell(el: &HtmlElement) -> (BellSender,BellReceiver) {
    let mut source = IDENTITY.lock().unwrap();
    let identity = *source;
    *source += 1;
    drop(source);
    (BellSender::new(identity,el),BellReceiver::new(identity,el))
}