use types::{ Move, Units, Axis, Dot };
use controller::global::CanvasState;

#[derive(Debug,Clone,Copy)]
pub enum Event {
    Noop,
    Move(Move<f64,f64>),
    Zoom(f32),
    Resize(Dot<i32,i32>)
}

fn exe_move_event(cg: &CanvasState, v: Move<f64,f64>) {
    cg.with_stage(|s| {
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,s),
            Axis::Vert => v.convert(Units::Pixels,s),
        };
        s.inc_pos(&v);
    });
}

fn exe_zoom_by_event(cg: &CanvasState, z: f32) {
    cg.with_stage(|s| { 
        let z = s.get_zoom()+z;
        s.set_zoom(z);
    });
}

fn exe_resize(cg: &CanvasState, sz: Dot<i32,i32>) {
    cg.with_stage(|s| {
        s.set_size(&sz);
    });
    cg.force_size();
}

pub fn events_run(cg: &CanvasState, evs: Vec<Event>) {
    for ev in evs {
        match ev {
            Event::Move(v) => exe_move_event(cg,v),
            Event::Zoom(z) => exe_zoom_by_event(cg,z),
            Event::Resize(sz) => exe_resize(cg,sz),
            Event::Noop => ()
        }
    }
}
