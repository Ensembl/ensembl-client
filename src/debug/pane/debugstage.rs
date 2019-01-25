use stdweb::web::Element;

use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventData, Target
};

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

#[allow(dead_code)]
pub fn debug_panel_entry_reset(cont_el: &Element, name: &str) {
    let cel = domutil::query_selector2(cont_el,".console2").unwrap();
    domutil::send_custom_event(&cel,"reset",&json!({ "name": name }));
}

pub fn debug_panel_entry_add(name: &str, value: &str) {
    if let Some(cel) = domutil::query_selector_new("#bpane-container .console2") {
        domutil::send_custom_event(&cel,"add",&json!({
            "name": name,
            "value": value
        }));
    }
}

pub fn setup_testcards() {
    let mut bec = EventControl::new(Box::new(BodyEventListener::new()),());
    bec.add_event(EventType::CustomEvent("bpane-start".to_string()));
    bec.add_event(EventType::CustomEvent("bpane-debugger".to_string()));
    bec.add_event(EventType::KeyPressEvent);
    bec.add_element(&domutil::query_select("body"),());
}
