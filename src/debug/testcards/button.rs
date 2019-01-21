use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Mutex, Arc };
use controller::global::App;
use dom::domutil;
use debug::testcards::bigscience::big_science;

use stdweb::web::{ Element, HtmlElement };

use serde_json::Value as JSONValue;

pub fn testcard_button(cont_el: &Element, a: &mut App) {
    big_science(a,false);
}
