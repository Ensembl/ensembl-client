use std::sync::{ Mutex, Arc };
use std::clone::Clone;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{ window, IElement };

use dom::domutil;
use campaign::StateValue;
use debug::testcards::bigscience::big_science;
use controller::{ Global };

struct State {
    g: Arc<Mutex<Global>>,
    zoomscale: f32,
    hpos: f32,
    vpos: f32,
    fpos: f32,
    call: i32,
    old_time: f64,
    inst: String,
}

fn animate(time : f64, s: Rc<RefCell<State>>) {
    let canv_el = domutil::query_select("#bpane-canv");
    {
        let mut state = s.borrow_mut();
        if let Some(inst) = canv_el.get_attribute("data-inst") {
            if inst != state.inst {
                debug!("global","quitting out of date testcard");
                return;
            }
        }
        if state.old_time < 1. { state.old_time = time; }
        let delta = ((time - state.old_time) / 5000.0) as f32;
        state.old_time = time;
        state.call += 1;
        state.zoomscale += delta* 5.0;
        state.hpos += delta *3.763;
        state.vpos += delta *5.414;
        state.fpos += delta *7.21;
        state.g.lock().unwrap().with_stage(|s| {
            s.set_zoom((state.zoomscale.cos()/2.0 + 2.5) as f32);
            s.pos.0 = ((state.hpos.cos())*150.) as f32;
            s.pos.1 = ((state.vpos.sin())*300.) as f32;
        });
        state.g.lock().unwrap().with_state(|s| {
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
    window().request_animation_frame(move |x| animate(x,s.clone()));
}

pub fn testcard_visual(g: Arc<Mutex<Global>>, onoff: bool, inst: &str) {
    big_science(&mut g.lock().unwrap(),onoff);

    let state = Rc::new(RefCell::new(State {
        g: g.clone(),
        hpos: 0.0,
        vpos: 0.0,
        fpos: 0.0,
        zoomscale: 0.0,
        old_time: 0.0,
        call: 0,
        inst: inst.to_string(),
    }));

    /*
    g.lock().unwrap().add_timer(move |cg,t| {
        let st = state.clone();
        animate(t,st);
    });
    */

    animate(0.,state);
}
