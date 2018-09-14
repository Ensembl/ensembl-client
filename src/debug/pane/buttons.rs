use std::rc::Rc;
use std::cell::RefCell;

use stdweb::web::Element;

use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventKiller, EventData
};

use debug::pane::debugstage::debug_panel_trigger_button;

pub struct ButtonEventListener {
}

impl ButtonEventListener {
    pub fn new() -> ButtonEventListener {
        ButtonEventListener {}
    }
}

impl EventListener<usize> for ButtonEventListener {
    fn receive(&mut self, _el: &Element,  _e: &EventData, idx: &usize) {
        debug_panel_trigger_button(*idx);
    }
}

pub struct DebugButton {
    name: String,
    cb: Rc<RefCell<ButtonAction>>
}

impl DebugButton {
    pub fn new(name: &str, cb: Rc<RefCell<ButtonAction>>) -> DebugButton {
        DebugButton {
            name: name.to_string(),
            cb
        }
    }
    
    pub fn trigger(&self) {
        debug!("debug panel","Button event '{}'",&self.name);
        self.cb.borrow_mut().press();
    }
}

pub trait ButtonAction {
    fn press(&mut self);
}

pub struct ButtonActionImpl<F>(pub F) where F: FnMut() -> ();

impl<F> ButtonAction for ButtonActionImpl<F> where F: FnMut() -> () {
    fn press(&mut self) { self.0() }
}

pub struct DebugButtons {
    buttons: Vec<DebugButton>,
    buttonev: EventControl<usize>,
    buttonek: EventKiller<usize>
}

impl DebugButtons {
    pub fn new() -> DebugButtons {
        let mut out = DebugButtons {
            buttons: Vec::<DebugButton>::new(),
            buttonev: EventControl::new(Box::new(ButtonEventListener::new())),
            buttonek: EventKiller::new()
        };
        out.buttonev.add_event(EventType::ClickEvent);
        out
    }
    
    pub fn clear_buttons(&mut self) {
        self.buttons.clear();
    }
    
    pub fn render_buttons(&mut self) {
        self.buttonek.kill();
        let sel_el = domutil::query_select("#bpane-right .buttons");
        domutil::inner_html(&sel_el,"");
        for (i,e) in self.buttons.iter_mut().enumerate() {
            let opt_el = domutil::append_element(&sel_el,"button");
            domutil::text_content(&opt_el,&e.name);
            self.buttonev.add_element(&mut self.buttonek,&opt_el,i);
        }
    }

    pub fn add_button(&mut self, name: &str, cb: Rc<RefCell<ButtonAction>>) {
        self.buttons.push(DebugButton::new(name,cb));
    }

    pub fn trigger_button(&mut self, idx: usize) {
        let b = self.buttons.get(idx);
        console!("X {:?}",idx);
        if let Some(b) = b {
            b.trigger();
        }
    }
}
