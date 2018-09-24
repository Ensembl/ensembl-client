use types::{ Move, Units, Axis };
use controller::global::CanvasState;

#[derive(Debug,Clone,Copy)]
pub enum Event {
    Noop,
    Move(Move<f32,f32>),
    Zoom(f32)
}

fn exe_move_event(cg: &CanvasState, v: Move<f32,f32>) {
    cg.with_stage(|s| {
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,s),
            Axis::Vert => v.convert(Units::Pixels,s),
        };
        s.pos = s.pos + v;
    });
}

fn exe_zoom_by_event(cg: &CanvasState, z: f32) {
    cg.with_stage(|s| { 
        let z = s.get_zoom()+z;
        s.set_zoom(z);
    });
}

pub fn events_run(cg: &CanvasState, evs: Vec<Event>) {
    for ev in evs {
        match ev {
            Event::Move(v) => exe_move_event(cg,v),
            Event::Zoom(z) => exe_zoom_by_event(cg,z),
            Event::Noop => ()
        }
    }
}
