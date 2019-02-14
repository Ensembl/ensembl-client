use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };

pub fn select_testcard(a: &mut App, stick_name: &str) {
    actions_run(a,&vec! {
        Action::AddComponent("internal:debug:gene-pc".to_string()),
        Action::AddComponent("internal:debug:gene-other".to_string()),
        Action::AddComponent("internal:debug:variant".to_string()),
        Action::AddComponent("internal:debug:contig".to_string()),
        Action::AddComponent("internal:debug:gc".to_string()),
        Action::SetStick(stick_name.to_string()),
        Action::SetState("internal:debug:gene-pc".to_string(),StateValue::On()),
        Action::SetState("internal:debug:gene-other".to_string(),StateValue::On()),
        Action::SetState("internal:debug:variant".to_string(),StateValue::On()),
        Action::SetState("internal:debug:contig".to_string(),StateValue::On()),
        Action::SetState("internal:debug:gc".to_string(),StateValue::On()),
        Action::ZoomTo(-5.)
    });
}

