use std::sync::{ Mutex, Arc };
use controller::global::Global;
use dom::domutil;
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;

use stdweb::web::Element;

use serde_json::Value as JSONValue;

fn custom(body: &Element, name: &str, json: JSONValue) {
    let body = body.clone();
    let cb = move || {
        let canv = domutil::query_selector(&body,"#bpane-canv");
        domutil::send_custom_event(&canv,"bpane",&json);
    };
    button!(name,cb);
}

pub fn testcard_button(g: Arc<Mutex<Global>>) {
    let body = domutil::query_select("body");
    
    custom(&body,"shimmy",json!({ "move_left_px": 120, "move_down_screen": 0.25, "zoom_by": 0.1 }));
    custom(&body,"left",json!({ "move_left_px": 50 }));
    custom(&body,"right",json!({ "move_right_px": 50 }));
    custom(&body,"up",json!({ "move_up_px": 50 }));
    custom(&body,"down",json!({ "move_down_px": 50 }));
    custom(&body,"in",json!({ "zoom_by": -0.3 }));
    custom(&body,"out",json!({ "zoom_by": 0.3 }));

    button!("on",|| { debug!("global","on") });
    button!("off",|| { debug!("global","off") });
    button!("zero",|| { debug!("global","zero") });

    big_science(&mut g.lock().unwrap(),false);
    g.lock().unwrap().draw();
}
