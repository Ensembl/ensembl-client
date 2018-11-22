use std::iter;
use std::sync::{ Mutex, Arc };
use std::rc::{ Rc, Weak };
use std::cell::RefCell;
use serde_json::Value as JSONValue;

use stdweb::web::{ IEventTarget, Element, HtmlElement, IHtmlElement };
use stdweb::traits::IEvent;
use stdweb::web::event::{ ClickEvent, ChangeEvent };
use stdweb::web::html_element::SelectElement;
use stdweb::unstable::TryInto;
use stdweb::traits::IKeyboardEvent;

use controller::global::Global;
use dom::{ DEBUGSTAGE, DEBUGSTAGE_CSS };
use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventData, ICustomEvent,
    Target
};
use debug::testcards;
use debug::testcards::StickSource;
use debug::testcards::debug_stick_source;
use debug::pane::console::DebugConsole;
use debug::pane::buttons::{ DebugButtons, ButtonAction };
use types::Todo;

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
            EventData::CustomEvent(_,n,_) => {
                if n == "bpane-start" {
                    setup_stage_debug();
                }
            },
            EventData::KeyboardEvent(EventType::KeyPressEvent,k) => {
                if MODIFIER_BYPASS || (k.ctrl_key() && k.alt_key()) {
                    match &k.key()[..] {
                        "d" => { setup_stage_debug(); },
                        _ => ()
                    }
                }
            },
            _ => ()
        }
    }
}

pub struct DebugPanelListener {
    panel: Weak<DebugPanel>,
    cont_el: Element
}

impl EventListener<()> for DebugPanelListener {
    fn receive(&mut self, _el: &Target, ev: &EventData, _p: &()) {
        if let EventData::CustomEvent(_,n,e) = ev {
            if n == "refresh" {
                let mut keys = None;
                let detail = e.details();        
                if let Some(panel) = self.panel.upgrade() {
                    if let Some(JSONValue::Object(m)) = detail {
                        if let Some(JSONValue::Array(ref keys_in)) = m.get("keys") {
                            keys = Some(Vec::<String>::new());
                            for k in keys_in {
                                if let JSONValue::String(k) = k {
                                    keys.as_mut().unwrap().push(k.to_string());
                                }
                            }
                        }
                    }
                    if let Some(keys) = keys {
                        panel.render_dropdown(&self.cont_el,keys);
                    }
                }
            }
        }
    }
}

pub struct DebugPanelImpl {
    base: Element,
    console2: Option<DebugConsole>,
    buttons: DebugButtons,
    evc: Option<EventControl<()>>
}

impl DebugPanelImpl {
    pub fn new(base: &Element) -> Rc<RefCell<DebugPanelImpl>> {
        debug!("global","new debug panel");
        debug!("debug panel","new debug panel");
        let mut bec = EventControl::new(Box::new(BodyEventListener::new()),());
        bec.add_event(EventType::KeyPressEvent);
        bec.add_event(EventType::MouseClickEvent);
        bec.add_event(EventType::CustomEvent("custom".to_string()));
        bec.add_event(EventType::CustomEvent("dropdown".to_string()));
        bec.add_event(EventType::CustomEvent("bpane-start".to_string()));
        bec.add_element(&domutil::query_select("body"),());
        Rc::new(RefCell::new(DebugPanelImpl {
            base: base.clone(),
            evc: None,
            buttons: DebugButtons::new(),
            console2: None,
        }))
    }
    
    pub fn init(&mut self, p: Weak<DebugPanel>) {
        let cons_el = domutil::query_selector(&self.base,".console2");
        self.console2 = Some(DebugConsole::new(&cons_el,&self.base));
        self.console2.as_mut().unwrap().select("hello");
        self.console2.as_mut().unwrap().add("hello","world");
        let cont_el = domutil::query_selector_new("#bpane-container").unwrap();
        self.evc = Some(EventControl::new(Box::new(DebugPanelListener{
            panel: p.clone(),
            cont_el: cont_el.clone()
        }),()));
        self.evc.as_mut().unwrap().add_event(EventType::CustomEvent("refresh".to_string()));
        self.evc.as_mut().unwrap().add_element(&self.base,());
        self.add_event(&cont_el);
    }
     
    fn render_dropdown(&self, cont_el: &Element, keys: &Vec<String>) {
        let mut keys : Vec<String> = keys.iter().map(|s| s.to_string()).collect();
        let sel_el = domutil::query_selector2(cont_el,".console .folder").unwrap();
        domutil::inner_html(&sel_el,"");
        if self.console2.is_some() {
            keys.sort();
            keys.splice(..0,iter::once("- select -".to_string()));
            for e in keys {
                let opt_el = domutil::append_element(&sel_el,"option");
                domutil::text_content(&opt_el,&e);
            }
        }
    }

    fn add_event(&mut self, cont_el: &Element) {
        let sel_el = domutil::query_select("#bpane-container .console .folder");
        sel_el.add_event_listener(enclose! { (cont_el) move |e: ChangeEvent| {
            let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
            if let Some(name) = node.value() {
                debug_panel_select(&cont_el,&name);
            }
        }});
    }
    
    fn clear_buttons(&mut self) {
        self.buttons.clear_buttons();
    }

    fn render_buttons(&mut self, cont_el: &Element) {
        self.buttons.render_buttons(cont_el);
    }
    
    fn add_button(&mut self, name: &str, cb: Rc<RefCell<ButtonAction>>) {
        self.buttons.add_button(name,cb);        
    }
    
    fn trigger_button(&mut self, idx: usize) {
        self.buttons.trigger_button(idx);
    }
}

pub struct DebugPanel(Todo<Rc<RefCell<DebugPanelImpl>>>);

impl DebugPanel {
    fn new(base: &Element) -> Rc<DebugPanel> {
        let out = Rc::new(DebugPanel(Todo::new(DebugPanelImpl::new(base))));
        let q = Rc::downgrade(&out.clone());
        out.0.run(move |p| p.borrow_mut().init(q.clone()));
        out
    }
    
    fn render_dropdown(&self, cont_el: &Element, keys: Vec<String>) {
        self.0.run(enclose! { (cont_el) move |p| { 
            p.borrow_mut().render_dropdown(&cont_el,&keys)
        }});
    }
    
    fn clear_buttons(&self) {
        self.0.run(|p| p.borrow_mut().clear_buttons());
    }
    
    fn render_buttons(&self, cont_el: &Element) {
        self.0.run(enclose! { (cont_el) move |p| { 
            p.borrow_mut().render_buttons(&cont_el);
        }});
    }

    fn add_button(&self, name: &str, cb: Rc<RefCell<ButtonAction>>) {
        let name = name.to_string();
        self.0.run(move |p| { p.borrow_mut().add_button(&name,cb.clone())});
    }
    
    fn trigger_button(&self, idx: usize) {
        self.0.run(move |p| { p.borrow_mut().trigger_button(idx) });
    }
}

thread_local! {
    static DEBUG_PANEL : RefCell<Option<Rc<DebugPanel>>> = RefCell::new(None);
}

fn setup_testcard(cont_el: &Element, g: &Arc<Mutex<Global>>, name: &str) {
    debug!("global","setup testcard {}",name);
    if name.len() > 0 {
        g.lock().unwrap().reset();
        testcards::testcard(cont_el,g.clone(),name);
    }
}

fn setup_events(cont_el: &Element) {
    let pane_el: HtmlElement = domutil::query_selector2(cont_el,".bpane-canv").unwrap().try_into().unwrap();
    let g = Arc::new(Mutex::new(Global::new(&pane_el)));
    let sel_el = domutil::query_selector2(cont_el,".console .testcard").unwrap();
    sel_el.add_event_listener(enclose! { (cont_el) move |e: ChangeEvent| {
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            debug_panel_buttons_clear(&cont_el);
            setup_testcard(&cont_el,&g,&name);
        }
    }});
    let mark_el = domutil::query_selector2(cont_el,".console .mark").unwrap();
    mark_el.add_event_listener(enclose! { (cont_el) move |_e: ClickEvent| {
        debug_panel_entry_mark(&cont_el);
    }});
}

pub fn setup_stage_debug() {
    if let Some(stage) = domutil::query_selector_new("#stage") {
        domutil::inner_html(&stage,DEBUGSTAGE);
        let el = domutil::append_element(&domutil::query_select("head"),"style");
        domutil::inner_html(&el,DEBUGSTAGE_CSS);
        DEBUG_PANEL.with(|p| {
            *p.borrow_mut() = Some(DebugPanel::new(&stage));
        });
        if let Some(cont_el) = domutil::query_selector_new("#bpane-container") {
            
            setup_events(&cont_el);
            let mark_el = domutil::query_selector2(&cont_el,".console .start").unwrap();
            mark_el.add_event_listener(|_e: ClickEvent| {
                let cel = domutil::query_select("body");
                domutil::send_custom_event(&cel,"bpane-start",&json!({}));
            });
        }
    }
}

fn panel_op(cb: &mut FnMut(&DebugPanel) -> ()) {
    DEBUG_PANEL.with(|p| {
        let p : &Option<Rc<DebugPanel>> = &p.borrow();
        if let Some(ref po) = &p {
            cb(&po);
        }
    })
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

pub fn debug_panel_buttons_clear(cont_el: &Element) {
    panel_op(&mut |p| {
        p.clear_buttons();
        p.render_buttons(cont_el);
    });
}

pub fn debug_panel_button_add(cont_el: &Element, name: &str, cb: Rc<RefCell<ButtonAction>>) {
    DEBUG_PANEL.with(|p| {
        let p : &Option<Rc<DebugPanel>> = &p.borrow();
        if let Some(ref po) = &p {
            po.add_button(name,cb);
            po.render_buttons(cont_el);
        }
    });
}

pub fn debug_panel_trigger_button(idx: usize) {
    DEBUG_PANEL.with(|p| {
        let p : &Option<Rc<DebugPanel>> = &p.borrow();
        if let Some(ref po) = &p {
            po.trigger_button(idx);
        }
    });
}

pub fn setup_testcards() {
    let mut bec = EventControl::new(Box::new(BodyEventListener::new()),());
    bec.add_event(EventType::CustomEvent("bpane-start".to_string()));
    bec.add_event(EventType::KeyPressEvent);
    bec.add_element(&domutil::query_select("body"),());
}
