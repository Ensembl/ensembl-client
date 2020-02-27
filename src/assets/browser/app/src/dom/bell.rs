use std::sync::{ Arc, Mutex };
use crate::dom::domutil;
use stdweb::Reference;
use stdweb::web::{ document, HtmlElement };

lazy_static! {
    static ref IDENTITY : Arc<Mutex<u64>> = Arc::new(Mutex::new(0));
}

const MESSAGE_KEY : &str = "domutil-bell";

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

#[derive(Clone)]
pub struct BellReceiver {
    identity: u64,
    el: HtmlElement,
    callback: Arc<Mutex<Box<Fn() + 'static>>>
}

impl BellReceiver {
    fn new(identity: u64, el: &HtmlElement, callback: Box<Fn() + 'static>) -> BellReceiver {
        let mut out = BellReceiver {
            identity,
            el: el.clone(),
            callback: Arc::new(Mutex::new(callback))
        };
        out.listen();
        out
    }

    fn listen(&mut self) {
        let mut again = self.clone();
        let js_cb = move |_: Reference| {
            (again.callback.lock().unwrap())();
            again.listen();
        };
        let name = &format!("{}-{}",MESSAGE_KEY,self.identity);
        let el =self.el.clone();
        js! {
            let cb = @{js_cb};
            @{el}.addEventListener(@{name},function() { cb(); cb.drop(); });
        }
    }
}

pub fn make_bell<T>(el: &HtmlElement, callback: T) -> (BellSender,BellReceiver) where T: Fn() + 'static {
    let mut source = IDENTITY.lock().unwrap();
    let identity = *source;
    *source += 1;
    drop(source);
    (BellSender::new(identity,el),BellReceiver::new(identity,el,Box::new(callback)))
}