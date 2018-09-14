use std::sync::{ Mutex, Arc };
use std::clone::Clone;
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{ window, IElement };

use dom::domutil;
use jank::JankBuster;
use campaign::{ StateManager, StateValue };
use debug::testcards::bigscience::big_science;
use global::{ Global };

struct State {
    g: Arc<Mutex<Global>>,
    oom: StateManager,
    zoomscale: f32,
    hpos: f32,
    vpos: f32,
    old_time: f64,
    fpos: f32,
    call: i32,
    phase: u32,
    inst: String,
    jank: JankBuster
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
        if state.old_time > 0.0 {
            let delta = ((time - state.old_time) / 5000.0) as f32;
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
            state.oom.set_atom_state("odd",odd_state);
            state.oom.set_atom_state("even",even_state);
        }
        
        let d = time - state.old_time;
        state.old_time = time;
        state.phase += 1;
        let gear = state.jank.gear();
        if state.phase >= gear {
            state.phase = 0;
        }
        if state.phase == 0 {
            state.jank.detect(d as u32,time as f32/1000.0);
            state.g.lock().unwrap().draw(&state.oom);
        }
    }
    window().request_animation_frame(move |x| animate(x,s.clone()));
}

pub fn testcard_visual(g: Arc<Mutex<Global>>, onoff: bool, inst: &str) {
    let oom = StateManager::new();

    big_science(&mut g.lock().unwrap(),&oom,onoff);

    let state = Rc::new(RefCell::new(State {
        g,
        oom,
        hpos: 0.0,
        vpos: 0.0,
        fpos: 0.0,
        zoomscale: 0.0,
        old_time: -1.0,
        call: 0,
        phase: 0,
        inst: inst.to_string(),
        jank: JankBuster::new()
    }));

    animate(0.,state);
}
