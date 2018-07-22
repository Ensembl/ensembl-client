#[macro_use]
extern crate stdweb;
#[macro_use]
extern crate serde_derive;
#[macro_use]
extern crate stdweb_derive;

mod arena;
#[macro_use]
mod util;
mod domutil;
mod canvasutil;
mod wglraw;
mod hosc;
mod hofi;
mod webgl_rendering_context;

use stdweb::web::{
        window
};

use std::cell::RefCell;
use std::rc::Rc;

use arena::{
    Arena,
    Stage,
};

use hosc::HoscGeometry;
use hofi::HofiGeometry;

struct State {
	arena: RefCell<Arena>,
    stage: Stage,
    zoomscale: f64,
    hpos: f64,
    old_time: f64
}

fn animate(time : f64, s: Rc<RefCell<State>>) {
    {
        let mut state = s.borrow_mut();
        if state.old_time > 0.0 {
            let delta = (time - state.old_time) / 5000.0;
            state.zoomscale += delta* 5.0;
            state.hpos += delta *3.763;
            state.stage.zoom = ((state.zoomscale.cos() + 1.5)/3.0) as f32;
            state.stage.hpos = ((state.hpos.cos())*1.5) as f32;
        }
        state.old_time = time;
        state.arena.borrow_mut().animate(&state.stage);
    }
    window().request_animation_frame(move |x| animate(x,s.clone()));
}

fn main() {
    stdweb::initialize();

    let mut stage = Stage::new();
    stage.zoom = 0.1;

	let mut arena = Arena::new("#canvas");
    for yidx in -20..20 {
        for idx in -50..50 {
            let v1 = (idx as f32) * 0.1;
            let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
            let dx = ((v2*5.0).cos()+1.0)/4.0;
            let x = v1 * 3.0 + (yidx as f32).cos();
            let y = (yidx as f32) / 20.0;
            let data = [[x,y, x+dx,y+0.01, x,   y+0.01],
                        [x,y, x+dx,y+0.01, x+dx,y]];
            let colour = [
                0.5*v2.cos()+0.5,
                0.5*v2.sin()+0.5,
                0.5*(v2+1.0).sin()+0.5,
            ];
            arena.geom_hosc(&mut |g:&mut HoscGeometry| {
                g.triangle(data[1],colour);
                g.triangle(data[0],colour);
            });
            if idx %5 == 0 {
                arena.geom_hofi(&mut |g:&mut HofiGeometry| {
                    g.triangle([x,y],[0.0,0.0, -0.004,-0.008, 0.004,-0.008],
                               [colour[0],colour[1],1.0-colour[2]])
                });
            }
        }
    }
    arena.populate();

    arena.animate(&stage);


	let state = Rc::new(RefCell::new(State {
		arena: RefCell::new(arena),
        stage,
        hpos: 0.0,
        zoomscale: 0.0,
        old_time: -1.0,
	}));

	animate(0.,state);
    stdweb::event_loop();
}

