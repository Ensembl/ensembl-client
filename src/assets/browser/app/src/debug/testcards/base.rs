use composit::StateValue;
use controller::global::App;
use controller::input::{ Action, actions_run };
use types::Dot;
use super::super::support::{ DEBUG_SOURCES, DEMO_SOURCES };

fn debug_initial_actions(name: &str) -> Vec<Action> {
    let mut out = Vec::<Action>::new();
    if name == "live" || name == "text2" {
        let stick = if name == "live" {
            "2"
        } else {
            "text2"
        };
        for name in &DEMO_SOURCES {
            out.push(Action::AddComponent(name.to_string()));
            out.push(Action::SetState(name.to_string(),StateValue::On()));
        }
        out.extend(vec! {
            Action::SetStick(stick.to_string()),
            Action::Pos(Dot(0_f64,0_f64),None),
            Action::ZoomTo(-5.)
        });

    } else {
        for name in &DEBUG_SOURCES {
            out.push(Action::AddComponent(name.to_string()));
            out.push(Action::SetState(name.to_string(),StateValue::On()));
        }
        out.extend(vec! {
            Action::SetStick(name.to_string()),
            Action::Pos(Dot(0_f64,0_f64),None),
            Action::ZoomTo(-5.)
        });
    }
    out
}

pub fn select_testcard(a: &mut App, stick_name: &str) {
    let acts = debug_initial_actions(stick_name);
    actions_run(a,&acts);
}
