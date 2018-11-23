use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ Component, StateValue, StateFixed, Stick, Source };
use controller::global::App;
use debug::testcards::text::text_source;
use debug::testcards::leafcard::leafcard_source;
use debug::testcards::sticksource::StickSource;

pub fn debug_stick_source() -> StickSource {
    let mut s = StickSource::new();
    s.add_stick("text",1000000000,false,Box::new(text_source()));
    s.add_stick("leaf",1000000000,false,Box::new(leafcard_source(true)));
    s.add_stick("ruler",1000000000,false,Box::new(leafcard_source(false)));
    s
}

pub fn testcard_base(a: &mut App, stick_name: &str) {
    let cs = debug_stick_source();
    let c = Component::new(Box::new(cs),Rc::new(StateFixed(StateValue::On())));

    a.with_compo(|co| {
        co.add_component(c);
        co.set_stick(&Stick::new(stick_name,1000000,false));
    });
}
