use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Mutex, Arc };
use controller::global::Global;
use dom::domutil;
use debug::DebugPanel;
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;
use debug::debug_panel_button_add;

use stdweb::web::Element;

use serde_json::Value as JSONValue;

fn button<F>(po: &DebugPanel, cont_el: &Element,name: &str, cb: F) where F: FnMut() -> () + 'static {
    let bai = ButtonActionImpl(cb);
    debug_panel_button_add(po,cont_el,name,Rc::new(RefCell::new(bai)));
}

fn custom(po: &DebugPanel, cont_el: &Element,body: &Element, name: &str, json: JSONValue) {
    let body = body.clone();
    let cb = move || {
        let canv = domutil::query_selector(&body,".bpane-canv");
        domutil::send_custom_event(&canv,"bpane",&json);
    };
    button(po,cont_el,name,cb);
}

pub fn testcard_button(po: &DebugPanel, cont_el: &Element, g: Arc<Mutex<Global>>) {
    let body = domutil::query_select("body");
    
    custom(po,cont_el,&body,"shimmy",json!({ "move_left_px": 120, "move_down_screen": 0.25, "zoom_by": 0.1 }));
    custom(po,cont_el,&body,"left",json!({ "move_left_px": 50 }));
    custom(po,cont_el,&body,"right",json!({ "move_right_px": 50 }));
    custom(po,cont_el,&body,"up",json!({ "move_up_px": 50 }));
    custom(po,cont_el,&body,"down",json!({ "move_down_px": 50 }));
    custom(po,cont_el,&body,"in",json!({ "zoom_by": -0.3 }));
    custom(po,cont_el,&body,"out",json!({ "zoom_by": 0.3 }));

    button(po,cont_el,"on",|| { debug!("global","on") });
    button(po,cont_el,"off",|| { debug!("global","off") });
    button(po,cont_el,"zero",|| { debug!("global","zero") });

    big_science(&mut g.lock().unwrap(),false);
}
