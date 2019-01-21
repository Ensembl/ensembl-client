use std::collections::HashMap;

use serde_json::Value as JSONValue;
use stdweb::web::html_element::SelectElement;
use stdweb::traits::IEvent;
use stdweb::unstable::TryInto;
use stdweb::web::{ Element, IEventTarget };
use stdweb::web::event::{ ChangeEvent, ClickEvent };

use controller::global::AppRunner;
use debug::testcard_base;
use debug::DebugConsole;
use dom::{ DEBUGSTAGE, PLAINSTAGE, DEBUGSTAGE_CSS, Bling };
use dom::domutil;

use dom::event::{
    EventListener, EventControl, EventType, EventData, Target
};

fn setup_debug_console(el: &Element) {
    let cons_el = domutil::query_selector(el,".console2");
    DebugConsole::new(&cons_el,el);
    domutil::send_custom_event(&cons_el,"select",&json!({
        "name": "hello",
    }));
    domutil::send_custom_event(&cons_el,"add",&json!({
        "name": "hello",
        "value": "world"
    }));
    let mark_el = domutil::query_selector2(el,".console .mark").unwrap();
    mark_el.add_event_listener(enclose! { (cons_el) move |_e: ClickEvent| {
        domutil::send_custom_event(&cons_el,"mark",&json!({}));
    }});

}

fn setup_testcard_selector(ar: &mut AppRunner, el: &Element) {
    let ar = ar.clone();
    let sel_el = domutil::query_selector2(el,".console .testcard").unwrap();
    sel_el.add_event_listener(enclose! { (ar,el) move |e: ChangeEvent| {
        let mut a = ar.state();
        let mut a = a.lock().unwrap();
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            console!("select {}",name);
            testcard_base(&mut a,&name);
        }
    }});
}

fn event_button(dii: &mut Vec<Box<DebugInteractor>>, name: &str, json: JSONValue) {
    let bi = ButtonDebugInteractor::new(name,move |ar| {
        let canv: Element = {
            let mut a = ar.state();
            let mut a = a.lock().unwrap();
            a.get_canvas_element().clone().into()
        };
        domutil::send_custom_event(&canv,"bpane",&json);
    });
    dii.push(bi);
}

pub fn create_interactors() -> Vec<Box<DebugInteractor>> {
    let mut dii = Vec::<Box<DebugInteractor>>::new();
    event_button(&mut dii,"shimmy",json!({ "move_left_px": 120, "move_down_screen": 0.25, "zoom_by": 0.1 }));
    event_button(&mut dii,"left",json!({ "move_left_px": 50 }));
    event_button(&mut dii,"right",json!({ "move_right_px": 50 }));
    event_button(&mut dii,"up",json!({ "move_up_px": 50 }));
    event_button(&mut dii,"down",json!({ "move_down_px": 50 }));
    event_button(&mut dii,"in",json!({ "zoom_by": 0.3 }));
    event_button(&mut dii,"out",json!({ "zoom_by": -0.3 }));
    event_button(&mut dii,"on",json!({}));
    event_button(&mut dii,"off",json!({}));
    event_button(&mut dii,"zero",json!({}));
    dii
}

pub trait DebugInteractor {
    fn name(&self) -> &str;
    fn render(&mut self, ar: &AppRunner, el: &Element);
}

pub struct ButtonEventListener<F> where F: FnMut(&mut AppRunner) {
    cb: F
}
    
impl<F> ButtonEventListener<F>  where F: FnMut(&mut AppRunner) {
    pub fn new(cb: F) -> ButtonEventListener<F> where F: FnMut(&mut AppRunner) {
        ButtonEventListener { cb }
    }
}

impl<F> EventListener<Option<AppRunner>> for ButtonEventListener<F> where F: FnMut(&mut AppRunner) {
    fn receive(&mut self, _el: &Target,  _e: &EventData, ar: &Option<AppRunner>) {
        if let Some(ar) = ar {
            (self.cb)(&mut ar.clone());
        }
    }
}

pub struct ButtonDebugInteractor {
    name: String,
    ec: EventControl<Option<AppRunner>>
}

impl ButtonDebugInteractor {
    pub fn new<F>(name: &str, cb: F) -> Box<ButtonDebugInteractor> where F: FnMut(&mut AppRunner) + 'static {
        let mut out = Box::new(ButtonDebugInteractor {
            ec: EventControl::new(Box::new(ButtonEventListener::new(cb)),None),
            name: name.to_string()
        });
        out.ec.add_event(EventType::MouseClickEvent);
        out
    }
}

impl DebugInteractor for ButtonDebugInteractor {
    fn name(&self) -> &str { &self.name }
    
    fn render(&mut self, ar: &AppRunner, el: &Element) {
        if let Some(button_div) = domutil::query_selector2(&el,".buttons") {
            let button_el = domutil::append_element(&button_div,"button");
            domutil::text_content(&button_el,&self.name);
            self.ec.add_element(&button_el,Some(ar.clone()));
        }
    }
}

pub struct DebugBling {
    dii: Vec<Box<DebugInteractor>>
}

impl DebugBling {
    pub fn new(dii: Vec<Box<DebugInteractor>>) -> DebugBling {
        DebugBling { dii }
    }
}

impl Bling for DebugBling {
    fn apply_bling(&self, el: &Element) -> Element {
        let css = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::inner_html(&css,DEBUGSTAGE_CSS);
        domutil::inner_html(el,DEBUGSTAGE);
        domutil::query_selector(el,".bpane-canv").clone()
    }
    
    fn activate(&mut self, ar: &mut AppRunner, el: &Element) {
        setup_testcard_selector(ar,el);
        setup_debug_console(el);
        for di in &mut self.dii {
            di.render(&ar.clone(),el);
        }
    }    
}
