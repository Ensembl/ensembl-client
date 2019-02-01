use std::sync::{ Arc, Mutex };
use stdweb::web::Element;

use controller::global::App;
use dom::{ PLAINSTAGE, PLAINSTAGE_CSS };
use dom::domutil;

pub trait Bling {
    fn apply_bling(&self, el: &Element) -> Element;
    fn activate(&mut self, _ar: &Arc<Mutex<App>>, _el: &Element) {}
    fn key(&mut self, _app: &Arc<Mutex<App>>, _key: &str) {}
}

pub struct NoBling {}

impl NoBling {
    pub fn new() -> NoBling { NoBling{} }
}

impl Bling for NoBling {
    fn apply_bling(&self, el: &Element) -> Element {
        domutil::inner_html(el,PLAINSTAGE);
        let css = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::inner_html(&css,PLAINSTAGE_CSS);
        domutil::query_selector(el,".bpane-canv").clone()        
    }
}
