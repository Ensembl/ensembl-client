use std::rc::Rc;
use std::cmp::Ord;
use std::cell::RefCell;

use stdweb::web::Element;

use dom::domutil;
use dom::event::{ EventListener, EventControl, EventType, MouseEvent, EventListenerHandle, EventKiller };
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

fn burst<'a>(p: &'a mut DebugPanel) -> (&'a mut DebugConsole, &'a mut DebugButtons) {
    (&mut p.console, &mut p.buttons)
}

impl EventListener<usize> for ButtonEventListener {
    fn receive_mouse(&mut self, _el: &Element, _typ: &EventType, _e: &MouseEvent, idx: &usize) {
        let p =  &mut self.panel.borrow_mut();
        let (console, buttons) = burst(p);
        buttons.trigger_button(console,*idx);
    }
}

pub struct DebugButton {
    name: String,
}

impl DebugButton {
    pub fn new(name: &str) -> DebugButton {
        DebugButton {
            name: name.to_string(),
        }
    }
    
    pub fn trigger(&self, c: &mut DebugConsole) {
        debugp!(c,"debug panel","Button event '{}'",&self.name);
    }
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
        self.buttons.sort_by(|a,b| a.name.cmp(&b.name));
        for (i,e) in self.buttons.iter_mut().enumerate() {
            let opt_el = domutil::append_element(&sel_el,"button");
            domutil::text_content(&opt_el,&e.name);
            self.buttonev.add_element(&mut self.buttonek,&opt_el,i);
        }
    }

    pub fn add_button(&mut self, name: &str) {
        self.buttons.push(DebugButton::new(name));
    }

    fn trigger_button(&mut self, console: &mut DebugConsole, idx: usize) {
        let b = self.buttons.get(idx);
        if let Some(b) = b {
            b.trigger(console);
        }
    }
}
