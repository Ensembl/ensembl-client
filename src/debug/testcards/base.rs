use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ Component, StateValue, StateFixed, Stick, Source };
use controller::global::Global;
use debug::testcards::text::text_source;
use debug::testcards::leafcard::leafcard_source;
use debug::testcards::sticksource::StickSource;

fn source() -> impl Source {
    let mut s = StickSource::new();
    s.add_source("text",Box::new(text_source()));
    s.add_source("leaf",Box::new(leafcard_source(true)));
    s.add_source("ruler",Box::new(leafcard_source(false)));
    s
}

pub fn testcard_base(g: Arc<Mutex<Global>>, stick_name: &str) {
    let cs = source();
    let c = Component::new(Box::new(cs),Rc::new(StateFixed(StateValue::On())));

    let g = &mut g.lock().unwrap();
    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
            co.set_stick(&Stick::new(0,stick_name,1000000,false));
        });
    });
}
