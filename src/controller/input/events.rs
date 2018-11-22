use types::{ Move, Units, Axis, Dot };
use composit::Stick;
use controller::global::CanvasState;

#[derive(Debug,Clone)]
pub enum Event {
    Noop,
    Pos(Dot<f64,f64>,Option<f64>),
    Move(Move<f64,f64>),
    Zoom(f32),
    ZoomTo(f32),
    Resize(Dot<i32,i32>)
}

fn exe_pos_event(cg: &CanvasState, v: Dot<f64,f64>, prop: Option<f64>) {
    let prop = prop.unwrap_or(0.5);
    let v = cg.with_stage(|s|
        Dot(s.pos_prop_bp_to_origin(v.0,prop),v.1)
    );
    cg.with_stage(|s| { s.set_pos(&v); });
    cg.with_compo(|co| { co.set_position(v.0); });
}

fn exe_move_event(cg: &CanvasState, v: Move<f64,f64>) {
    let pos = cg.with_stage(|s| {
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,s),
            Axis::Vert => v.convert(Units::Pixels,s),
        };
        s.inc_pos(&v);
        s.get_pos()
    });
    cg.with_compo(|co| {
        co.set_position(pos.0);
    });
}

fn exe_zoom_event(cg: &CanvasState, mut z: f32, by: bool) {
    let z = cg.with_stage(|s| {
        if by { z += s.get_zoom(); }
        s.set_zoom(z);
        s.get_linear_zoom()
    });
    cg.with_compo(|co| {
        co.set_zoom(z);
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
            Event::Pos(v,prop) => exe_pos_event(cg,v,prop),
            Event::Move(v) => exe_move_event(cg,v),
            Event::Zoom(z) => exe_zoom_event(cg,z,true),
            Event::ZoomTo(z) => exe_zoom_event(cg,z,false),
            Event::Resize(sz) => exe_resize(cg,sz),
            Event::Noop => ()
        }
    }
}

pub fn startup_events() -> Vec<Event> {
    vec! {
        Event::Pos(Dot(0_f64,0_f64),None),
        //Event::Zoom(-3.)
    }
}
