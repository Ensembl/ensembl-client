use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;

use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };
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
        let action = match key {
            "q" => Action::SetState("odd".to_string(),StateValue::On()),
            "Q" => Action::SetState("odd".to_string(),StateValue::OffCold()),
            "w" => Action::SetState("even".to_string(),StateValue::On()),
            "W" => Action::SetState("even".to_string(),StateValue::OffCold()),
            _ => Action::Noop
        };
        actions_run(&mut app.lock().unwrap(),&vec! { action });
    }
}
