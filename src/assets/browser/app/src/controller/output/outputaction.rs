use serde_json::Value as JSONValue;

use crate::composit::Stick;
use crate::controller::global::AppRunner;
use crate::controller::input::Action;
use crate::dom::domutil;

#[derive(Clone)]
pub enum OutputAction {
    SendCustomEvent(String,JSONValue),
    Destroy,
    Loop(Vec<Action>)
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
            OutputAction::Loop(actions) => {
                let app = ar.state();
                app.lock().unwrap().run_actions(&actions,None);
            }
        }
    }
}
