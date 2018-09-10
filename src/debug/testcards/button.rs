use std::sync::{ Mutex, Arc };
use std::rc::Rc;
use std::cell::RefCell;
use global::Global;
use debug;
use dom::domutil;
use campaign::{ StateManager };
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;

pub fn testcard_button(g: Arc<Mutex<Global>>) {
    let body = domutil::query_select("body");

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

    big_science(&mut g.lock().unwrap(),&oom,false);
    g.lock().unwrap().draw(&oom);
}
