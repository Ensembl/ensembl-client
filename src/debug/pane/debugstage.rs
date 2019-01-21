use std::iter;
use std::sync::{ Mutex, Arc };
use std::rc::{ Rc, Weak };
use std::cell::RefCell;
use serde_json::Value as JSONValue;

use stdweb::web::{ IEventTarget, Element, HtmlElement };
use stdweb::traits::IEvent;
use stdweb::web::event::{ ClickEvent, ChangeEvent };
use stdweb::web::html_element::SelectElement;
use stdweb::unstable::TryInto;
use stdweb::traits::IKeyboardEvent;

use controller::global::{ Global, AppRunner };
use dom::{ DEBUGSTAGE, DEBUGSTAGE_CSS };
use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventData, ICustomEvent,
    Target
};
use debug::testcards;
use debug::pane::console::DebugConsole;

const MODIFIER_BYPASS : bool = true;

pub struct BodyEventListener {
    val: u32,
}

impl BodyEventListener {
    fn new() -> BodyEventListener {
        BodyEventListener {
            val: 0
        }
    }
}

impl EventListener<()> for BodyEventListener {    
    fn receive(&mut self, _el: &Target, ev: &EventData, _p: &()) {
        self.val += 1;
        match ev {
            EventData::CustomEvent(_,_,n,kv) => {
                if n == "bpane-debugger" {
                    console!("testcard {:?}",kv);
                }
            },
            _ => ()
        }
    }
}

fn setup_testcard(cont_el: &Element, g: &Arc<Mutex<Global>>, 
                  ar: &mut AppRunner, name: &str) {
    debug!("global","setup testcard {}",name);
    let g = g.clone();
    let mut g = g.lock().unwrap();
    if name.len() > 0 {
        let arr = ar.state();
        let app = arr.lock().unwrap();
        g.register_app("MAIN",app.get_element(),true);
        testcards::testcard(cont_el,ar,name);
    }
}

fn setup_events(ar: &mut AppRunner, cont_el: &Element) {
    let g = Arc::new(Mutex::new(Global::new()));
    let sel_el = domutil::query_selector2(cont_el,".console .testcard").unwrap();
    let ar = ar.clone();
    sel_el.add_event_listener(enclose! { (cont_el) move |e: ChangeEvent| {
        let mut ar = ar.clone();
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            setup_testcard(&cont_el,&g,&mut ar,&name);
        }
    }});
    let mark_el = domutil::query_selector2(cont_el,".console .mark").unwrap();
    mark_el.add_event_listener(enclose! { (cont_el) move |_e: ClickEvent| {
        debug_panel_entry_mark(&cont_el);
    }});
}

#[allow(dead_code)]
pub fn debug_panel_entry_reset(cont_el: &Element, name: &str) {
    let cel = domutil::query_selector2(cont_el,".console2").unwrap();
    domutil::send_custom_event(&cel,"reset",&json!({ "name": name }));
}

pub fn debug_panel_entry_mark(cont_el: &Element) {
    let cel = domutil::query_selector2(cont_el,".console2").unwrap();
    domutil::send_custom_event(&cel,"mark",&json!({}));
}

pub fn debug_panel_entry_add(name: &str, value: &str) {
    if let Some(cel) = domutil::query_selector_new("#bpane-container .console2") {
        domutil::send_custom_event(&cel,"add",&json!({
            "name": name,
            "value": value
        }));
    }
}

pub fn debug_panel_select(cont_el: &Element, name: &str) {
    let cel = domutil::query_selector2(cont_el,".console2").unwrap();
    domutil::send_custom_event(&cel,"select",&json!({ "name": name }));
}

pub fn setup_testcards() {
    let mut bec = EventControl::new(Box::new(BodyEventListener::new()),());
    bec.add_event(EventType::CustomEvent("bpane-start".to_string()));
    bec.add_event(EventType::CustomEvent("bpane-debugger".to_string()));
    bec.add_event(EventType::KeyPressEvent);
    bec.add_element(&domutil::query_select("body"),());
}
