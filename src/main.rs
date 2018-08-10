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
mod alloc;
mod texture;
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

use geometry::{
    GCoord,
    PCoord,
    Colour,
};

struct State {
    arena: RefCell<Arena>,
    stage: Stage,
    zoomscale: f32,
    hpos: f32,
    old_time: f64,
    fpos: f32,
    call: i32,
    phase: u32,
    gear: u32,
    
    grace_next: (u32,u32),
    grace_at: f32,
    last_down: bool,
}

const MAX_GEAR : u32 = 6;
const MAX_GRACE: u32 = 300;

fn fib_inc(val: (u32,u32)) -> (u32,u32) {
    (val.1,val.0+val.1)
}

fn fib_dec(val: (u32,u32)) -> (u32,u32) {
    if val.1 > val.0 {
        (val.1-val.0,val.0)
    } else {
        (1,1)
    }
}

fn detect_jank(state : &mut State, delta: u32, time: f32) {
    if delta > state.gear as u32 * 20 {
        if state.gear < MAX_GEAR {
            /* Go up a gear */
            if state.last_down {
                /* Hunting */
                if time > state.grace_at {
                    /* Successful, long hunt. Shorten */
                    state.grace_next = fib_dec(state.grace_next);
                } else {
                    /* Failure, short hunt. Lengthen */
                    if state.grace_next.1 < MAX_GRACE {
                        state.grace_next = fib_inc(state.grace_next);
                    }
                }
            } else {
                /* Moving */
                state.grace_next = (1,1);
            }
            state.grace_at = time + state.grace_next.1 as f32;
            state.last_down = false;
            state.gear += 1;
            js! { console.log(">gear",@{state.gear},@{state.grace_next.1}); };
        }
    }
    if state.grace_at <= time && state.gear > 1 {
        /* Go down a gear */
        if state.last_down {
            /* Moving */
            state.grace_next = (1,1);
        }
        state.grace_at = time + state.grace_next.1 as f32;
        state.last_down = true;
        state.gear -= 1;
        js! { console.log("<gear",@{state.gear},@{state.grace_next.1}); };
    }
}

fn animate(time : f64, s: Rc<RefCell<State>>) {
    {
        let mut state = s.borrow_mut();
        let dims = state.arena.borrow().dims();
        let (sw,sh) = (dims.width_px as f32,dims.height_px as f32);
        if state.old_time > 0.0 {
            let delta = ((time - state.old_time) / 5000.0) as f32;
            let d = (time - state.old_time) as u32;            
            state.call += 1;
            state.zoomscale += delta* 5.0;
            state.hpos += delta *3.763;
            state.fpos += delta *7.21;
            state.stage.zoom = ((state.zoomscale.cos() + 1.5)/3.0) as f32;
            state.stage.pos.0 = ((state.hpos.cos())*1.5) as f32;
            state.stage.cursor[0] = (sw/2.)+(state.fpos.cos()*sw/4.) as f32;
        }
        
        let d = time - state.old_time;
        state.old_time = time;
        let mut stage = state.stage;
        state.arena.borrow_mut().settle(&mut stage);
        state.stage = stage;
        state.phase += 1;
        if state.phase >= state.gear {
            state.phase = 0;
        }
        if state.phase == 0 {
            detect_jank(&mut state,d as u32,time as f32/1000.0);
            state.arena.borrow_mut().animate(&state.stage);
        }
    }
    window().request_animation_frame(move |x| animate(x,s.clone()));
}

fn bio_daft(seed: i32) -> String {
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);

    let vals = vec! { "5'","3'","snp","C","G","A","T" };
    String::new() + seq::sample_iter(&mut rng,vals,1).unwrap()[0]
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

    let mut a_spec = ArenaSpec::new();
    a_spec.debug = false;
    let mut arena = Arena::new("#glcanvas","#managedcanvasholder",a_spec);
    let middle = (arena.dims().height_px / 120);
    for yidx in 0..20 {
        let y = (yidx as f32) * 60.0;
        if yidx == middle {
            arena.bitmap_stretch(&[GCoord(-10.,y-5.),GCoord(10.,y+5.)],
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },4,1);
            arena.bitmap_pin(&GCoord(0.,y+5.),&PCoord(10.,10.),
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },2,2);

        } else {
            for idx in -100..100 {
                let v1 = (idx as f32) * 0.1;
                let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
                let dx = ((v2*5.0).cos()+1.0)/10.0;
                let x = v1 * 1.0 + (yidx as f32).cos();
                let colour = Colour(
                    0.5*v2.cos()+0.5,
                    0.5*v2.sin()+0.5,
                    0.5*(v2+1.0).sin()+0.5,
                );
                let h = if idx % 13 == 0 { 1. } else { 5. };
                arena.rectangle_stretch(&[GCoord(x,y-h),
                                          GCoord(x+dx,y+h)],&colour);
                if idx %5 == 0 {
                    let colour = Colour(colour.2,colour.0,colour.1);
                    arena.triangle_pin(&GCoord(x,y),
                                       &[PCoord(0.,0.),
                                         PCoord(-5.,-10.),
                                         PCoord(5.,-10.)],
                                       &colour);
                }
                if (v1+dx) - (v1+dx).round() < 0.03 {
                    let val = bio_daft((v2*2000000.0) as i32);
                    arena.text_pin(&GCoord(x,y+12.),&val,&fc_font);
                }
            }
        }
    }
    
    // XXX in pixels
    let dims = arena.dims();
    let (sw,sh) = (dims.width_px as f32,dims.height_px as f32);
    let dx = 0.001;
    arena.rectangle_fix(&[PCoord(0.,0.),PCoord(1.,sh)], &[0.0,0.0,0.0]);
    arena.bitmap_fix(&[PCoord(99.,0.),PCoord(100.,sh)],
                        vec! { 0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255 },1,4);
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
        phase: 0,
        gear: 1,

        grace_next: (1,1),
        grace_at: 0.,
        last_down: true,
    }));

    animate(0.,state);
    stdweb::event_loop();
}

