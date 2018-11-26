use stdweb::web::Element;

use dom::{ DEBUGSTAGE, PLAINSTAGE, DEBUGSTAGE_CSS };
use dom::domutil;

pub trait Bling {
    fn apply_bling(&self, el: &Element) -> Element;
}

pub struct NoBling {}

impl NoBling {
    pub fn new() -> NoBling { NoBling{} }
}

impl Bling for NoBling {
    fn apply_bling(&self, el: &Element) -> Element {
        domutil::inner_html(el,PLAINSTAGE);
        console!("PLAIN {:?} ({:?})",el,domutil::query_selector(el,".bpane-canv"));
        domutil::query_selector(el,".bpane-canv").clone()        
    }
}

pub struct DebugBling {}

impl DebugBling {
    pub fn new() -> DebugBling { DebugBling{} }
}

impl Bling for DebugBling {
    fn apply_bling(&self, el: &Element) -> Element {
        console!("DEBUG");
        let css = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::inner_html(&css,DEBUGSTAGE_CSS);
        domutil::inner_html(el,DEBUGSTAGE);
        domutil::query_selector(el,".bpane-canv").clone()
    }
}
