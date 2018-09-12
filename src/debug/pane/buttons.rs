use std::rc::Rc;
use std::cell::RefCell;

use stdweb::web::Element;

use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventListenerHandle,
    EventKiller, EventData
};
use debug::pane::console::DebugConsole;
use debug::pane::debugstage::DebugPanel;

pub struct ButtonEventListener {
    panel: Rc<RefCell<DebugPanel>>
}

impl ButtonEventListener {
    pub fn new(panel: Rc<RefCell<DebugPanel>>) -> ButtonEventListener {
        ButtonEventListener { panel }
    }
}

impl EventListener<usize> for ButtonEventListener {
    fn receive(&mut self, _el: &Element,  _e: &EventData, idx: &usize) {
        let t;
        {
            let p =  &mut self.panel.borrow_mut();
            t = p.buttons.trigger_button(*idx);
        }
        if let Some(t) = t {
            t.borrow_mut().press();
        }
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
    
    pub fn trigger(&self) -> Rc<RefCell<ButtonAction>> {
        debug!("debug panel","Button event '{}'",&self.name);
        self.cb.clone()
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
    pub fn new(panel : Option<&mut Rc<RefCell<DebugPanel>>>) -> DebugButtons {
        let mut out = DebugButtons {
            buttons: Vec::<DebugButton>::new(),
            buttonev: EventControl::new(),
            buttonek: EventKiller::new()
        };
        if let Some(panel) = panel {
            let mut bel = EventListenerHandle::new(Box::new(ButtonEventListener::new(panel.clone())));
            out.buttonev.add_event(EventType::ClickEvent,&bel);
        }
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

    fn trigger_button(&mut self, idx: usize) -> Option<Rc<RefCell<ButtonAction>>> {
        let b = self.buttons.get(idx);
        if let Some(b) = b {
            Some(b.trigger())
        } else {
            None
        }
    }
}
