#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;
extern crate rand;

#[macro_use]
mod util;

mod arena;
mod geometry;
mod domutil;
mod canvasutil;
mod wglraw;
mod labl;
mod text;
mod alloc;
mod webgl_rendering_context;

use rand::rngs::SmallRng;
use rand::SeedableRng;

use stdweb::web::{
    window
};

use rand::seq;
use std::cell::RefCell;
use std::rc::Rc;

use arena::{
    Arena,
    ArenaSpec,
    Stage,
};

use labl::LablGeometry;
use text::TextGeometry;

struct State {
    arena: RefCell<Arena>,
    stage: Stage,
    zoomscale: f64,
    hpos: f64,
    old_time: f64,
    fpos: f64,
    call: i32,
}

fn animate(time : f64, s: Rc<RefCell<State>>) {
    {
        let mut state = s.borrow_mut();
        if state.old_time > 0.0 {
            let delta = (time - state.old_time) / 5000.0;
            state.call += 1;
            state.zoomscale += delta* 5.0;
            state.hpos += delta *3.763;
            state.fpos += delta *7.21;
            state.stage.zoom = ((state.zoomscale.cos() + 1.5)/3.0) as f32;
            state.stage.hpos = ((state.hpos.cos())*1.5) as f32;
            state.stage.cursor[0] = (state.fpos.cos()*0.3) as f32;
        }
        state.old_time = time;
        state.arena.borrow_mut().animate(&state.stage);
    }
    window().request_animation_frame(move |x| animate(x,s.clone()));
}

fn daft(seed: i32) -> String {
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);
    
    let onset = vec! { "bl", "br", "ch", "cl", "cr", "dr", "fl",
                       "fr", "gh", "gl", "gr", "ph", "pl", "pr",
                       "qu", "sc", "sh", "sk", "sl", "sm", "sn", "sp",
                       "st", "sw", "th", "tr", "tw", "wh", "wr",
                       "sch", "scr", "shr", "spl", "spr", "squ",
                       "str", "thr", "b", "c", "d", "f", "g", "h", "j",
                       "k", "l", "m", "n", "p", "r", "s", "t", "u", "v",
                       "w", "x", "y", "z" };
    let nuc = vec!{ "ai", "au", "aw", "ay", "ea", "ee", "ei", "eu",
                    "ew", "ey", "ie", "oi", "oo", "ou", "ow", "oy",
                    "a", "e", "i", "o", "u" };
    let coda = vec! {  "ch", "ck", "gh", "ng", "ph", "sh", "sm", "sp",
                       "st", "th",  "nth", 
                       "b", "c", "d", "f", "g", "h", "j",
                       "k", "l", "m", "n", "p", "r", "s", "t", "u", "v",
                       "w", "x", "y", "z" };
    let out = String::new();
    out + seq::sample_iter(&mut rng,onset,1).unwrap()[0] +
          seq::sample_iter(&mut rng,nuc,1).unwrap()[0] +
          seq::sample_iter(&mut rng,coda,1).unwrap()[0]
}

fn main() {
    stdweb::initialize();

    let fc_font = canvasutil::FCFont::new(12,"serif");
    let mut stage = Stage::new();
    stage.zoom = 0.1;

    let a_spec = ArenaSpec::new();
    //a_spec.debug = true;
    let mut arena = Arena::new("#glcanvas","#managedcanvasholder",a_spec);
    for yidx in -20..20 {
        let y = (yidx as f32) / 20.0;
        for idx in -50..50 {
            let v1 = (idx as f32) * 0.1;
            let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
            let dx = ((v2*5.0).cos()+1.0)/4.0;
            let x = v1 * 3.0 + (yidx as f32).cos();
            let colour = [
                0.5*v2.cos()+0.5,
                0.5*v2.sin()+0.5,
                0.5*(v2+1.0).sin()+0.5,
            ];
            let h = if idx % 13 == 0 { 0.001 } else { 0.005 };
            arena.rectangle_stretch(&[x,y-h,x+dx,y+h],&colour);
            if idx %5 == 0 {
                arena.triangle_pin(&[x,y],
                                   &[0.0,0.0, -0.004,-0.008, 0.004,-0.008],
                                   &[colour[0],colour[1],1.0-colour[2]]);
            }
            if v2 - v2.round() < 0.2 {
                let val = daft((v2*2000000.0) as i32);
                arena.text_pin(&[x,y+0.01],&val,&fc_font);
            }
        }
    }
    // XXX pixels
    let dx = 0.001;
    arena.rectangle_fix(&[-dx,-1.0,0.0, dx,1.0,0.0], &[0.0,0.0,0.0]);
    arena.populate();

    arena.settle(&mut stage);
    arena.animate(&stage);


    let state = Rc::new(RefCell::new(State {
        arena: RefCell::new(arena),
        stage,
        hpos: 0.0,
        fpos: 0.0,
        zoomscale: 0.0,
        old_time: -1.0,
        call: 0,
    }));

    animate(0.,state);
    stdweb::event_loop();
}

