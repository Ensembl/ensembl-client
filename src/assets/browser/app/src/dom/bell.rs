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

struct BellReceiverState {
    callbacks: Arc<Mutex<Vec<Box<FnMut() + 'static>>>>,
    name: String,
    el: HtmlElement,
    js_ref: Option<Value>
}

impl BellReceiverState {
    fn new(identity: u64, el: &HtmlElement) -> BellReceiverState {
        let mut out = BellReceiverState {
            name: format!("{}-{}",MESSAGE_KEY,identity),
            callbacks: Arc::new(Mutex::new(Vec::new())),
            el: el.clone(),
            js_ref: None
        };
        out.call_dom();
        out
    }

    fn add(&mut self, callback: Box<FnMut() + 'static>) {
        self.callbacks.lock().unwrap().push(callback);
    }

    fn call_dom(&mut self) {
        let callbacks = self.callbacks.clone();
        let js_cb = move |_: Reference| {
            for cb in callbacks.lock().unwrap().iter_mut() {
                (cb)();
            }
        };
        let el = self.el.clone();
        let name = self.name.clone();
        self.js_ref = Some(js! {
            let cb = @{js_cb};
            @{el}.addEventListener(@{name},cb);
            return cb;
        });
    }
}

impl Drop for BellReceiverState {
    fn drop(&mut self) {
        if let Some(cb) = self.js_ref.take() {
            js! { 
                let cb = @{cb};
                @{&self.el}.removeEventListener(@{&self.name},cb);
                cb.drop()
            };
        }
    }
}

#[derive(Clone)]
pub struct BellReceiver(Arc<Mutex<BellReceiverState>>);

impl BellReceiver {
    fn new(identity: u64, el: &HtmlElement) -> BellReceiver {
        BellReceiver(Arc::new(Mutex::new(BellReceiverState::new(identity,el))))
    }

    pub fn add<T>(&mut self, callback: T) where T: FnMut() + 'static {
        self.0.lock().unwrap().add(Box::new(callback));
    }
}

pub fn make_bell(el: &HtmlElement) -> (BellSender,BellReceiver) {
    let mut source = IDENTITY.lock().unwrap();
    let identity = *source;
    *source += 1;
    drop(source);
    (BellSender::new(identity,el),BellReceiver::new(identity,el))
}