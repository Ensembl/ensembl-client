use std::sync::{ Arc, Mutex };
use stdweb::unstable::TryInto;

use stdweb::web::{ Element, HtmlElement, INode };

use controller::global::App;
use dom::{ PLAINSTAGE, PLAINSTAGE_CSS };
use dom::domutil;

pub trait Bling {
    fn apply_bling(&self, el: &HtmlElement) -> HtmlElement;
    fn activate(&mut self, _ar: &Arc<Mutex<App>>, _el: &HtmlElement) {}
    fn key(&mut self, _app: &Arc<Mutex<App>>, _key: &str) {}
}

pub struct NoBling {}

impl NoBling {
    pub fn new() -> NoBling { NoBling{} }
}

impl Bling for NoBling {
    fn apply_bling(&self, el: &HtmlElement) -> HtmlElement {
        let el = el.clone().into();
        domutil::inner_html(&el,PLAINSTAGE);
        if let Some(old) = domutil::query_selector2(&el,"#bpane-css") {
            domutil::remove(&old);
        }       
        let css = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::add_attr(&css,"id","bpane-css");
        domutil::inner_html(&css,PLAINSTAGE_CSS);
        domutil::query_selector(&el.clone().into(),".bpane-canv").clone().try_into().unwrap()
    }
}
