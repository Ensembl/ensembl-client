use serde_json::Value as JSONValue;

use composit::Stick;
use controller::global::AppRunner;
use dom::domutil;

#[derive(Clone)]
pub enum OutputAction {
    SendCustomEvent(String,JSONValue),
    Jump(Stick,f64,f64),
    Destroy
}

impl OutputAction {
    pub fn run(&self, ar: &mut AppRunner) {
        match self {
            OutputAction::SendCustomEvent(name,details) => {
                domutil::send_custom_event(&ar.get_browser_el().into(),name,details);
                domutil::send_post_message(name,details);
            },
            OutputAction::Destroy => {
                ar.destroy()
            },
            OutputAction::Jump(stick,pos,zoom) => {
                ar.jump(&stick.get_name(),*pos,*zoom);
            }
        }
    }
}
