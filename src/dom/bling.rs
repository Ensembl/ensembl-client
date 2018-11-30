use stdweb::web::html_element::SelectElement;
use stdweb::traits::IEvent;
use stdweb::unstable::TryInto;
use stdweb::web::{ Element, IEventTarget };
use stdweb::web::event::ChangeEvent;

use controller::global::AppRunner;
use debug::testcard_base;
use dom::{ DEBUGSTAGE, PLAINSTAGE, DEBUGSTAGE_CSS };
use dom::domutil;

pub trait Bling {
    fn apply_bling(&self, el: &Element) -> Element;
    fn activate(&self, ar: &mut AppRunner, el: &Element);
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
    
    fn activate(&self, ar: &mut AppRunner, el: &Element) {}
}

fn setup_testcard_selector(ar: &mut AppRunner, el: &Element) {
    let ar = ar.clone();
    let sel_el = domutil::query_selector2(el,".console .testcard").unwrap();
    sel_el.add_event_listener(enclose! { (ar,el) move |e: ChangeEvent| {
        let mut a = ar.state();
        let mut a = a.lock().unwrap();
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            console!("A {}",name);
            testcard_base(&mut a,&name);
        }
    }});
    /*
    let ar = ar.clone();
    sel_el.add_event_listener(enclose! { (cont_el) move |e: ChangeEvent| {
        let mut ar = ar.clone();
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            debug_panel_buttons_clear(&po,&cont_el);
            setup_testcard(&po,&cont_el,&g,&mut ar,&name);
        }
    }});
    let mark_el = domutil::query_selector2(cont_el,".console .mark").unwrap();
    mark_el.add_event_listener(enclose! { (cont_el) move |_e: ClickEvent| {
        debug_panel_entry_mark(&cont_el);
    }});
    */
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
    
    fn activate(&self, ar: &mut AppRunner, el: &Element) {
        setup_testcard_selector(ar,el);
    }
}
