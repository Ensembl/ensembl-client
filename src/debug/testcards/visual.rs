use std::cell::RefCell;
use std::rc::Rc;

use composit::StateValue;
use controller::input::Event;
use controller::global::App;

struct State {
    zoomscale: f32,
    hpos: f32,
    vpos: f32,
    fpos: f32,
    call: i32,
    old_time: f64,
}

fn animate(time : f64, cg: &mut App, s: Rc<RefCell<State>>) {
    let mut state = s.borrow_mut();
    if state.old_time < 1. { state.old_time = time; }
    let delta = ((time - state.old_time) / 5000.0) as f32;
    state.old_time = time;
    state.call += 1;
    state.zoomscale += delta* 5.0;
    state.hpos += delta *3.763;
    state.vpos += delta *5.414;
    state.fpos += delta *7.21;
    /*
    cg.with_stage(|s| {
        s.set_zoom((state.zoomscale.cos()/2.0)-2.5 as f32);
        s.set_pos(&Dot(
            ((state.hpos.cos())*0.15) as f64,
            ((state.vpos.sin())*150.-50.) as f64));
    });
    */
    cg.run_events(&vec!{ Event::ZoomTo((state.zoomscale.cos()/2.0+4.0) as f32) });
    cg.with_state(|s| {
        let odd_state = if state.hpos.cos() > 0. {
            StateValue::OffWarm()
        } else {
            StateValue::On()
        };
        let even_state = if state.vpos.sin() > 0. {
            StateValue::OffCold()
        } else {
            StateValue::On()
        };
        s.set_atom_state("odd",odd_state);
        s.set_atom_state("even",even_state);
    });
}

/*
fn testcard_visual(ar: &mut AppRunner, onoff: bool) {
    let a = ar.state();
    let mut a = a.lock().unwrap();
    //big_science(&mut a,onoff);

    let state = Rc::new(RefCell::new(State {
        hpos: 0.0,
        vpos: 0.0,
        fpos: 0.0,
        zoomscale: 0.0,
        old_time: 0.0,
        call: 0,
    }));

    ar.add_timer(move |cg,t| {
        let st = state.clone();
        animate(t,cg,st);
    });
}
*/
