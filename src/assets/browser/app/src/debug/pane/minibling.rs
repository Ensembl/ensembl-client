use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;

use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };
use debug::support::DebugSourceType;
use dom::{ Bling, NoBling };

pub struct MiniBling {
    nobling: NoBling
}

impl MiniBling {
    pub fn new() -> MiniBling { 
        MiniBling{
            nobling: NoBling::new()
        }
    }
}

impl Bling for MiniBling {
    fn apply_bling(&self, el: &HtmlElement) -> HtmlElement {
        self.nobling.apply_bling(el)
    }
    
    fn key(&mut self, app: &Arc<Mutex<App>>, key: &str) {
        let mut action = None;
        for type_ in DebugSourceType::all() {
            let (off,on) = type_.get_key();
            let mut change = None;
            if key == off { change = Some(StateValue::OffCold()); }
            else if key == on { change = Some(StateValue::On()); }
            if let Some(value) = change {
                action = Some(Action::SetState(type_.get_name().to_string(),value));
            }
        }
        if let Some(action) = action {
            actions_run(&mut app.lock().unwrap(),&vec! { action });
        }
    }
}
