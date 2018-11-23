use std::rc::Rc;
use std::cell::RefCell;

use stdweb::web::Element;

use dom::domutil;
use dom::event::{
    EventListener, EventControl, EventType, EventData, Target
};

pub struct ButtonEventListener {
    buttons: Rc<RefCell<DebugButtonList>>
}

impl ButtonEventListener {
    fn new(dbl: &Rc<RefCell<DebugButtonList>>) -> ButtonEventListener {
        ButtonEventListener {
            buttons: dbl.clone()
        }
    }
}

impl EventListener<usize> for ButtonEventListener {
    fn receive(&mut self, _el: &Target,  _e: &EventData, idx: &usize) {
        let bm = self.buttons.borrow_mut();        
        let b = bm.buttons.get(*idx);
        if let Some(b) = b {
            b.trigger();
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

struct DebugButtonList {
    buttons: Vec<DebugButton>
}

pub struct DebugButtons {
    buttons: Rc<RefCell<DebugButtonList>>,
    buttonev: EventControl<usize>,
}

impl DebugButtons {
    pub fn new() -> DebugButtons {
        let dbl = Rc::new(RefCell::new(DebugButtonList {
            buttons: Vec::<DebugButton>::new()
        }));
        let mut out = DebugButtons {
            buttons: dbl.clone(),
            buttonev: EventControl::new(Box::new(ButtonEventListener::new(&dbl)),0),
        };
        out.buttonev.add_event(EventType::MouseClickEvent);
        out
    }
    
    pub fn clear_buttons(&mut self) {
        self.buttons.borrow_mut().buttons.clear();
    }
    
    pub fn render_buttons(&mut self, cont_el: &Element) {
        self.buttonev.reset();
        let sel_el = domutil::query_selector2(cont_el,".bpane-right .buttons").unwrap();
        domutil::inner_html(&sel_el,"");
        for (i,e) in self.buttons.borrow_mut().buttons.iter_mut().enumerate() {
            let opt_el = domutil::append_element(&sel_el,"button");
            domutil::text_content(&opt_el,&e.name);
            self.buttonev.add_element(&opt_el,i);
        }
    }

    pub fn add_button(&mut self, name: &str, cb: Rc<RefCell<ButtonAction>>) {
        self.buttons.borrow_mut().buttons.push(DebugButton::new(name,cb));
    }
}
