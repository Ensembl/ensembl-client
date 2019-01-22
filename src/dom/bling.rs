use stdweb::web::Element;

use controller::global::AppRunner;
use dom::PLAINSTAGE;
use dom::domutil;

pub trait Bling {
    fn apply_bling(&self, el: &Element) -> Element;
    fn activate(&mut self, ar: &mut AppRunner, el: &Element);
}

pub struct NoBling {}

impl NoBling {
    pub fn new() -> NoBling { NoBling{} }
}

impl Bling for NoBling {
    fn apply_bling(&self, el: &Element) -> Element {
        domutil::inner_html(el,PLAINSTAGE);
        domutil::query_selector(el,".bpane-canv").clone()        
    }
    
    fn activate(&mut self, _ar: &mut AppRunner, _el: &Element) {}
}
