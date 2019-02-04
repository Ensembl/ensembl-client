use types::{ Move, Units, Axis, Dot, cdfraction, LEFT, RIGHT };
use composit::StateValue;
use controller::global::App;

#[derive(Debug,Clone)]
pub enum Event {
    Noop,
    Pos(Dot<f64,f64>,Option<f64>),
    Move(Move<f64,f64>),
    Zoom(f64),
    ZoomTo(f64),
    Resize(Dot<i32,i32>),
    AddComponent(String),
    SetStick(String),
    SetState(String,StateValue)
}

fn exe_pos_event(app: &App, v: Dot<f64,f64>, prop: Option<f64>) {
    let prop = prop.unwrap_or(0.5);
    let v = app.with_stage(|s|
        Dot(s.pos_prop_bp_to_origin(v.0,prop),v.1)
    );
    app.with_stage(|s| { s.set_pos_middle(&v); });
    app.with_compo(|co| { co.set_position(v.0); });
}

fn exe_move_event(app: &App, v: Move<f64,f64>) {
    let pos = app.with_stage(|s| {
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,s),
            Axis::Vert => v.convert(Units::Pixels,s),
        };
        s.inc_pos(&v);
        s.get_pos_middle()
    });
    app.with_compo(|co| {
        co.set_position(pos.0);
    });
}

fn exe_zoom_event(app: &App, mut z: f64, by: bool) {
    debug!("bug","zoom z={} by={}",z,by);
    let z = app.with_stage(|s| {
        if by {
            s.inc_zoom(z);
        } else {
            s.set_zoom(z);
        }
        s.get_linear_zoom()
    });
    app.with_compo(|co| { co.set_zoom(z); });
}

fn exe_resize(cg: &App, sz: Dot<i32,i32>) {
    cg.with_stage(|s| {
        s.set_size(&sz);
    });
    cg.force_size();
}

fn exe_component_add(a: &mut App, name: &str) {
    if let Some(Some(c)) = a.with_global(|g| g.get_component(name)) {
        a.with_compo(|co| co.add_component(c));
    }
}

fn exe_set_stick(a: &mut App, name: &str) {
    if let Some(Some(st)) = a.with_global(|g| g.get_stick(name)) {
        a.with_compo(|co| co.set_stick(&st));
        a.with_stage(|s| {
            s.set_limit(&LEFT,0.);
            s.set_limit(&RIGHT,st.length() as f64);
        });
        exe_pos_event(a,cdfraction(0.,0.),None);
    }
}

fn exe_set_state(a: &mut App, name: &str, on: StateValue) {
    a.with_state(|s| {
        s.set_atom_state(name,on);
    });
}

pub fn events_run(cg: &mut App, evs: &Vec<Event>) {
    for ev in evs {
        let ev = ev.clone();
        match ev {
            Event::Pos(v,prop) => exe_pos_event(cg,v,prop),
            Event::Move(v) => exe_move_event(cg,v),
            Event::Zoom(z) => exe_zoom_event(cg,z,true),
            Event::ZoomTo(z) => exe_zoom_event(cg,z,false),
            Event::Resize(sz) => exe_resize(cg,sz),
            Event::AddComponent(name) => exe_component_add(cg,&name),
            Event::SetStick(name) => exe_set_stick(cg,&name),
            Event::SetState(name,on) => exe_set_state(cg,&name,on),
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
