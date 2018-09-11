use std::sync::{ Mutex, Arc };
use global::Global;
use dom::domutil;
use campaign::{ StateManager };
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;

use stdweb::web::Element;

use serde_json::Value as JSONValue;

fn custom(body: &Element, name: &str,json: JSONValue) {
    let body = body.clone();
    let cb = move || {
        let canv = domutil::query_selector(&body,"#bpane-canv");
        domutil::send_custom_event(&canv,"bpane",&json);
    };
    button!(name,cb);
}

pub fn testcard_button(g: Arc<Mutex<Global>>) {
    let body = domutil::query_select("body");

    let oom = StateManager::new();
    
    custom(&body,"shimmy",json!({ "move_left_px": 12, "move_down_screen": 0.1 }));
    custom(&body,"left",json!({ "move_left_px": 50 }));
    custom(&body,"right",json!({ "move_right_px": 50 }));
    custom(&body,"up",json!({ "move_up_px": 50 }));
    custom(&body,"down",json!({ "move_down_px": 50 }));

    
    button!("in",|| { debug!("global","in") });
    button!("out",|| { debug!("global","out") });

    button!("on",|| { debug!("global","on") });
    button!("off",|| { debug!("global","off") });
    button!("zero",|| { debug!("global","zero") });

    big_science(&mut g.lock().unwrap(),&oom,false);
    g.lock().unwrap().draw(&oom);
}
