use std::sync::{ Mutex, Arc };
use std::clone::Clone;
use std::cell::RefCell;
use std::rc::Rc;

use campaign::StateValue;
use debug::testcards::bigscience::big_science;
use controller::{ Global };
use controller::CanvasGlobal;

struct State {
    zoomscale: f32,
    hpos: f32,
    vpos: f32,
    fpos: f32,
    call: i32,
    old_time: f64,
    inst: String,
}

fn animate(time : f64, cg: &mut CanvasGlobal, s: Rc<RefCell<State>>) {
    let mut state = s.borrow_mut();
    if state.old_time < 1. { state.old_time = time; }
    let delta = ((time - state.old_time) / 5000.0) as f32;
    state.old_time = time;
    state.call += 1;
    state.zoomscale += delta* 5.0;
    state.hpos += delta *3.763;
    state.vpos += delta *5.414;
    state.fpos += delta *7.21;
    cg.with_stage(|s| {
        s.set_zoom((state.zoomscale.cos()/2.0 + 2.5) as f32);
        s.pos.0 = ((state.hpos.cos())*150.) as f32;
        s.pos.1 = ((state.vpos.sin())*300.) as f32;
    });
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

pub fn testcard_visual(g: Arc<Mutex<Global>>, onoff: bool, inst: &str) {
    big_science(&mut g.lock().unwrap(),onoff);

    let state = Rc::new(RefCell::new(State {
        hpos: 0.0,
        vpos: 0.0,
        fpos: 0.0,
        zoomscale: 0.0,
        old_time: 0.0,
        call: 0,
        inst: inst.to_string(),
    }));

    g.lock().unwrap().add_timer(move |cg,t| {
        let st = state.clone();
        animate(t,cg,st);
    });
}
