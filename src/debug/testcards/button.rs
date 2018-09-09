use std::rc::Rc;
use std::cell::RefCell;
use debug;
use dom::domutil;
use campaign::{ StateManager };
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;
use arena::Stage;

pub fn testcard_button() {
    let body = domutil::query_select("body");

    let mut stage = Stage::new();
    let oom = StateManager::new();

    let x = Rc::new(RefCell::new(0));

    let a = x.clone();
    let b = x.clone();
    let details = json!({
        "hello": "world"
    });
    button!("test", move || {
        domutil::send_custom_event(&body,"custom",&details);
    });
    button!("left", move || { let mut y = a.borrow_mut(); *y-=1; debug!("global","left {}",y) });
    button!("right",move || { let mut y = b.borrow_mut(); *y+=1; debug!("global","right {}",y) });
    button!("in",|| { debug!("global","in") });
    button!("out",|| { debug!("global","out") });

    let mut a = big_science(&oom,&mut stage,false);
    a.draw(&oom,&stage);
}
