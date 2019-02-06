use std::rc::Rc;
use std::sync::{ Arc, Mutex };
use serde_json::Value as JSONValue;
use stdweb::web::html_element::SelectElement;
use stdweb::traits::IEvent;
use stdweb::unstable::TryInto;
use stdweb::web::{ Element, IEventTarget, HtmlElement, INode };
use stdweb::web::event::{ ChangeEvent, ClickEvent };

use controller::input::EggDetector;
use controller::global::App;
use debug::testcard_base;
use debug::DebugConsole;
use dom::{ DEBUGSTAGE, DEBUGSTAGE_CSS, Bling };
use dom::domutil;

use dom::event::{
    EventListener, EventControl, EventType, EventData, Target
};

fn setup_debug_console(el: &HtmlElement) {
    let cons_el = domutil::query_selector(&el.clone().into(),".console2");
    DebugConsole::new(&cons_el,&el.clone().into());
    domutil::send_custom_event(&cons_el,"select",&json!({
        "name": "hello",
    }));
    domutil::send_custom_event(&cons_el,"add",&json!({
        "name": "hello",
        "value": "world"
    }));
    let mark_el = domutil::query_selector2(&el.clone().into(),".console .mark").unwrap();
    mark_el.add_event_listener(enclose! { (cons_el) move |_e: ClickEvent| {
        domutil::send_custom_event(&cons_el,"mark",&json!({}));
    }});

}

fn setup_testcard_selector(a: &Arc<Mutex<App>>, el: &HtmlElement) {
    let a = a.clone();
    let sel_el = domutil::query_selector2(&el.clone().into(),".console .testcard").unwrap();
    sel_el.add_event_listener(enclose! { (a,el) move |e: ChangeEvent| {
        let mut a = a.lock().unwrap();
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            testcard_base(&mut a,&name);
        }
    }});
}

fn event_button(dii: &mut Vec<Box<DebugInteractor>>, name: &str, egg: Option<&str>, json: JSONValue) {
    let bi = ButtonDebugInteractor::new(name,egg,move |a| {
        let canv: Element = {
            a.lock().unwrap().get_canvas_element().clone().into()
        };
        domutil::send_custom_event(&canv.clone(),"bpane",&json.clone());
    });
    dii.push(bi);
}

pub fn create_interactors() -> Vec<Box<DebugInteractor>> {
    let mut dii = Vec::<Box<DebugInteractor>>::new();
    event_button(&mut dii,"shimmy",None,json!({ "move_left_px": 120, "move_down_screen": 0.25, "zoom_by": 0.1 }));
    event_button(&mut dii,"left",Some("h"),json!({ "move_left_px": 50 }));
    event_button(&mut dii,"right",Some("l"),json!({ "move_right_px": 50 }));
    event_button(&mut dii,"up",None,json!({ "move_up_px": 50 }));
    event_button(&mut dii,"down",None,json!({ "move_down_px": 50 }));
    event_button(&mut dii,"in",None,json!({ "zoom_by": 0.3 }));
    event_button(&mut dii,"out",None,json!({ "zoom_by": -0.3 }));
    event_button(&mut dii,"odd on",None,json!({ "on": "odd" }));
    event_button(&mut dii,"odd off",None,json!({ "off": "odd" }));
    event_button(&mut dii,"even on",None,json!({ "on": "even" }));
    event_button(&mut dii,"even off",None,json!({ "off": "even" }));
    event_button(&mut dii,"zero",None,json!({}));
    dii
}

pub trait DebugInteractor {
    fn name(&self) -> &str;
    fn render(&mut self, ar: &Arc<Mutex<App>>, el: &Element);
    fn key(&mut self, app: &Arc<Mutex<App>>, key: &str) {}
}

pub struct ButtonEventListener<F> where F: Fn(&Arc<Mutex<App>>) {
    cb: Rc<F>
}
    
impl<F> ButtonEventListener<F>  where F: Fn(&Arc<Mutex<App>>) {
    pub fn new(cb: Rc<F>) -> ButtonEventListener<F> where F: Fn(&Arc<Mutex<App>>) {
        ButtonEventListener { cb: cb }
    }
}

impl<F> EventListener<Option<Arc<Mutex<App>>>> for ButtonEventListener<F> where F: Fn(&Arc<Mutex<App>>) {
    fn receive(&mut self, _el: &Target,  _e: &EventData, ar: &Option<Arc<Mutex<App>>>) {
        if let Some(ar) = ar {
            (self.cb)(ar);
        }
    }
}

pub struct ButtonDebugInteractor {
    name: String,
    ec: EventControl<Option<Arc<Mutex<App>>>>,
    egg: EggDetector,
    cb: Rc<Fn(&Arc<Mutex<App>>)>
}

impl ButtonDebugInteractor {
    pub fn new<F>(name: &str, egg: Option<&str>, cb: F) -> Box<ButtonDebugInteractor> where F: Fn(&Arc<Mutex<App>>) + 'static {
        let cb = Rc::new(cb);
        let mut out = Box::new(ButtonDebugInteractor {
            ec: EventControl::new(Box::new(ButtonEventListener::new(cb.clone())),None),
            name: name.to_string(),
            egg: EggDetector::new(egg),
            cb
        });
        out.ec.add_event(EventType::MouseClickEvent);
        out
    }
}

impl DebugInteractor for ButtonDebugInteractor {
    fn name(&self) -> &str { &self.name }
    
    fn render(&mut self, ar: &Arc<Mutex<App>>, el: &Element) {
        if let Some(button_div) = domutil::query_selector2(&el,".buttons") {
            let button_el = domutil::append_element(&button_div,"button");
            domutil::text_content(&button_el,&self.name);
            self.ec.add_element(&button_el,Some(ar.clone()));
        }
    }
    
    fn key(&mut self, app: &Arc<Mutex<App>>, key: &str) {
        self.egg.new_char(key);
        if self.egg.is_active() {
            self.egg.reset();
            (self.cb)(app);
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
    fn apply_bling(&self, el: &HtmlElement) -> HtmlElement {
        let el : Element = el.clone().into();
        if let Some(old) = domutil::query_selector_new("#bpane-css") {
            console!("OLD");
            domutil::remove(&old);
        }
        let css = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::inner_html(&css,DEBUGSTAGE_CSS);
        domutil::add_attr(&css,"id","bpane-css");
        domutil::inner_html(&el.clone().into(),DEBUGSTAGE);
        domutil::query_selector(&el.clone().into(),".bpane-canv").clone().try_into().unwrap()
    }
    
    fn activate(&mut self, ar: &Arc<Mutex<App>>, el: &HtmlElement) {
        setup_testcard_selector(ar,el);
        setup_debug_console(el);
        for di in &mut self.dii {
            di.render(&ar.clone(),&el.clone().into());
        }
    }   
    
    fn key(&mut self, app: &Arc<Mutex<App>>, key: &str) {
        for di in &mut self.dii {
            di.key(app,key);
        }
    }
}

/* for debug! macro */
pub fn debug_panel_entry_add(name: &str, value: &str) {
    if let Some(cel) = domutil::query_selector_new(".bpane-container .console2") {
        domutil::send_custom_event(&cel,"add",&json!({
            "name": name,
            "value": value
        }));
    }
}
