use types::{ Move, Units, Axis, Dot, cdfraction, LEFT, RIGHT, CPixel };
use controller::global::App;
use composit::StickManager;

use model::stage::{ bp_to_zoomfactor, zoomfactor_to_bp };
use model::train::TrainContext;

use serde_json::Value as JSONValue;

#[derive(Debug,Clone)]
pub enum Action {
    Noop,
    Pos(Dot<f64,f64>,Option<f64>),
    PosRange(f64,f64,f64),
    Move(Move<f64,f64>),
    Zoom(f64),
    ZoomTo(f64),
    Resize(Dot<f64,f64>),
    AddComponent(String),
    SetStick(String),
    SetState(String,bool),
    Settled,
    ZMenuClickCheck(CPixel),
    ShowZMenu(String,String,Dot<i32,i32>,JSONValue),
    SetFocus(String),
    Reset,
}

impl Action {
    fn active(&self) -> bool {
        match self {
            Action::Noop | Action::Settled => false,
            _ => true
        }
    }

    fn order(&self) -> i32 {
        match self {
            Action::Noop => 0,
            Action::AddComponent(_) => 1,
            Action::SetState(_,_) => 2,
            Action::SetStick(_) => 3,
            Action::Resize(_) => 5,
            Action::Pos(_,_) => 10,
            Action::PosRange(_,_,_) => 10,
            Action::ZoomTo(_) => 10,
            Action::Move(_) => 10,
            Action::Zoom(_) => 10,
            Action::ZMenuClickCheck(_) => 25,
            Action::ShowZMenu(_,_,_,_) => 25,
            Action::SetFocus(_) => 20,
            Action::Reset => 25,
            Action::Settled => 30,
        }
    }
}

fn exe_pos_event(app: &mut App, v: Dot<f64,f64>, prop: Option<f64>) {
    let prop = prop.unwrap_or(0.5);
    let v = Dot(app.get_position().pos_prop_bp_to_origin(v.0,prop),v.1);
    let pos = {
        let p = &mut app.get_position_mut();
        p.set_middle(&v); 
        p.get_middle()
    };
    app.update_position();
    app.with_compo(|co| { co.set_position(pos.0); });
}

fn exe_pos_range_event(app: &mut App, x_start: f64, x_end: f64, y: f64) {
    let middle = Dot((x_start+x_end)/2.,y);
    let pos = {
        let p = &mut app.get_position_mut();
        p.set_screen_in_bp(x_end-x_start);
        p.set_middle(&middle);
        p.clone()
    };
    app.update_position();
    app.intend_here(&pos);
    app.with_compo(|co| {
        co.set_bp_per_screen(pos.get_screen_in_bp());
        co.set_position(pos.get_middle().0);
    });
}

fn exe_move_event(app: &mut App, v: Move<f64,f64>) {
    let screen = app.get_screen().clone();
    let position = app.get_position().clone();
    let v = match v.direction().0 {
        Axis::Horiz => v.convert(Units::Bases,screen,&position),
        Axis::Vert => v.convert(Units::Pixels,screen,&position),
        Axis::Zoom => v // TODO invalid pre-unification
    };
    let pos = {
        let p = &mut app.get_position_mut();
        p.set_middle(&(p.get_middle()+v));
        p.get_middle()
    };
    app.update_position();
    app.with_compo(|co| {
        co.set_position(pos.0);
    });
}

fn exe_zoom_event(app: &mut App, za: f64, by: bool) {
    let middle = app.get_position().get_middle().0;
    let z = {
        let p = &mut app.get_position_mut();
        let mut za = za;
        if by {
            za += bp_to_zoomfactor(p.get_screen_in_bp());
        }
        p.set_screen_in_bp(zoomfactor_to_bp(za));
        p.get_screen_in_bp()
    };
    app.update_position();
    app.with_compo(|co| { co.set_bp_per_screen(z); co.set_position(middle); });
}

fn exe_resize(cg: &mut App, sz: Dot<f64,f64>) {
    cg.force_size(sz);
}

fn exe_settled(app: &mut App) {
   app.settle(); 
}

fn exe_component_add(a: &mut App, name: &str) {
    if let Some(c) = a.get_window().get_product_list().get_product(name) {
        a.with_compo(|co| {
            let cs = co.get_component_set();
            cs.add(c)
        });
    }
}

fn exe_set_stick(app: &mut App, name: &str) {
    let stick_manager = app.get_window().get_stick_manager();
    if let Some(stick) = stick_manager.get_stick(name) {
        let changed : bool = app.with_compo(|co| co.set_stick(&stick));
        if changed {
            let pos = {
                let p = app.get_position_mut();
                p.set_limit(&LEFT,0.);
                p.set_limit(&RIGHT,stick.length() as f64);
                p.set_wrapping(&stick.get_wrapping());
                p.clone()
            };
            app.update_position();
            app.intend_here(&pos);
        }
    } else {
        console_force!("NO SUCH STICK {}",name);
    }
}

fn exe_set_state(a: &mut App, name: &str, on: bool) {
    a.with_state(|s| {
        s.set_atom_state(name,on);
    });
}

fn exe_zmenu_click_check(app: &mut App, pos: &CPixel, currency: Option<f64>) {
    console!("click {:?}",pos);
    let screen = app.get_screen().clone();
    let position = app.get_position().clone();
    let acts = app.with_compo(|co|
            co.intersects(screen,&position,*pos)
    ).iter().map(|isect| isect.display_action(pos)).collect();
    app.run_actions(&acts,currency);
}

fn exe_deactivate(a: &mut App) {
    if let Some(zr) = a.get_zmenu_reports() {
        zr.deactivate();
    }
}

fn exe_zmenu_show(a: &mut App, id: &str, track_id: &str, pos: Dot<i32,i32>, payload: JSONValue) {
    if let Some(zr) = a.get_zmenu_reports() {
        zr.add_activate(id,track_id,pos,payload);
    }
}

fn exe_set_focus(a: &mut App, id: &str) {
    console!("set focus object to id {}",id);
    let context = TrainContext::new(&Some(id.to_string()));
    a.get_window().get_train_manager().set_desired_context(&context);
    a.get_report().set_status("focus",&id);
}

fn exe_reset(a: &mut App) {
    let context = a.get_window().get_train_manager().get_desired_context();
    if let Some(id) = context.get_focus() {
        a.with_jumper(|j| j.jump(&id));
    }
}

pub fn actions_run(cg: &mut App, evs: &Vec<Action>, currency: Option<f64>) {
    cg.with_counter(|c| c.lock());
    let mut evs = evs.to_vec();
    evs.sort_by_key(|e| e.order());
    for ev in evs {
        let ev = ev.clone();
        if ev.active() {
            exe_deactivate(cg);
        }
        match ev {
            Action::Pos(v,prop) => exe_pos_event(cg,v,prop),
            Action::PosRange(x_start,x_end,y) => exe_pos_range_event(cg,x_start,x_end,y),
            Action::Move(va) => exe_move_event(cg,va),
            Action::Zoom(za) => exe_zoom_event(cg,za,true),
            Action::ZoomTo(za) => exe_zoom_event(cg,za,false),
            Action::Resize(sz) => exe_resize(cg,sz),
            Action::AddComponent(name) => exe_component_add(cg,&name),
            Action::SetStick(name) => exe_set_stick(cg,&name),
            Action::SetState(name,on) => exe_set_state(cg,&name,on),
            Action::SetFocus(id) => exe_set_focus(cg,&id),
            Action::Settled => exe_settled(cg),
            Action::ZMenuClickCheck(pos) => exe_zmenu_click_check(cg,&pos,currency),
            Action::ShowZMenu(id,track_id,pos,payload) => exe_zmenu_show(cg,&id,&track_id,pos,payload),
            Action::Reset => exe_reset(cg),
            Action::Noop => ()
        }
    }
    cg.with_counter(|c| c.unlock());
}

pub fn startup_actions() -> Vec<Action> {
    vec! {
        Action::Pos(Dot(1000000_f64,0_f64),None),
    }
}
