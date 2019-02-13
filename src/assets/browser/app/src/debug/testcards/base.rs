use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };

pub fn select_testcard(a: &mut App, stick_name: &str) {
    actions_run(a,&vec! {
        Action::AddComponent("internal:debug-main".to_string()),
        Action::AddComponent("internal:debug-even".to_string()),
        Action::AddComponent("internal:debug-odd".to_string()),
        Action::SetStick(stick_name.to_string()),
        Action::SetState("even".to_string(),StateValue::On()),
        Action::SetState("odd".to_string(),StateValue::On()),
        Action::ZoomTo(-5.)
    });
}

