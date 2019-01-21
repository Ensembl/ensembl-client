use std::collections::HashMap;

use stdweb::web::html_element::SelectElement;
use stdweb::traits::IEvent;
use stdweb::unstable::TryInto;
use stdweb::web::{ Element, IEventTarget };
use stdweb::web::event::{ ChangeEvent, ClickEvent };

use controller::global::AppRunner;
use debug::testcard_base;
use debug::DebugConsole;
use dom::{ DEBUGSTAGE, PLAINSTAGE, DEBUGSTAGE_CSS };
use dom::domutil;

use dom::event::{
    EventListener, EventControl, EventType, EventData, Target
};

pub trait Bling {
    fn apply_bling(&self, el: &Element) -> Element;
    fn activate(&mut self, ar: &mut AppRunner, el: &Element);
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
    
    fn activate(&mut self, ar: &mut AppRunner, el: &Element) {}
}
