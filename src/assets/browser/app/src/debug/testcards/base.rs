use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };
use debug::support::DebugSourceType;
use types::Dot;

pub fn debug_initial_actions(name: &str) -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    for type_ in DebugSourceType::all() {
        out.push(Action::AddComponent(type_.get_name().to_string()));
        out.push(Action::SetState(type_.get_name().to_string(),StateValue::On()));
    }
    out.extend(vec! {
        Action::SetStick(name.to_string()),
        Action::Pos(Dot(0_f64,0_f64),None),
        Action::ZoomTo(-5.)
    });
    out
}

pub fn select_testcard(a: &mut App, stick_name: &str) {
    let acts = debug_initial_actions(stick_name);
    actions_run(a,&acts);
}

