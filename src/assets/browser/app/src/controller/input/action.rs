use types::{ Move, Units, Axis, Dot, CPixel };
use controller::global::App;
use composit::StickManager;

use model::stage::{ bp_to_zoomfactor, zoomfactor_to_bp };
use model::train::TrainContext;

use serde_json::Value as JSONValue;

#[derive(Debug,Clone)]
pub enum Action {
    Noop,
    Pos(Dot<f64,f64>,Option<f64>),
    PosAnim(Dot<f64,f64>,Option<f64>),
    PosRange(f64,f64,f64),
    Move(Move<f64,f64>),
    Zoom(f64),
    ZoomTo(f64),
    ZoomToAnim(f64),
    Resize(Dot<f64,f64>),
    AddComponent(String),
    SetStick(String),
    ResetState,
    SetState(String,bool),
    SetDefaultState(String,bool),
    Settled,
    ActivityOutsideZMenu,
    ZMenuClickCheck(CPixel),
    ShowZMenu(String,String,Dot<i32,i32>,JSONValue),
    SetFocus(String),
    JumpFocus(String),
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
            Action::ResetState => 2,
            Action::SetState(_,_) => 3,
            Action::SetDefaultState(_,_) => 3,
            Action::SetStick(_) => 4,
            Action::Resize(_) => 5,
            Action::Pos(_,_) => 10,
            Action::PosAnim(_,_) => 10,
            Action::PosRange(_,_,_) => 10,
            Action::ZoomTo(_) => 10,
            Action::ZoomToAnim(_) => 10,
            Action::Move(_) => 10,
            Action::Zoom(_) => 10,
            Action::ActivityOutsideZMenu => 20,
            Action::ZMenuClickCheck(_) => 25,
            Action::ShowZMenu(_,_,_,_) => 25,
            Action::SetFocus(_) => 20,
            Action::JumpFocus(_) => 20,
            Action::Reset => 25,
            Action::Settled => 30,
        }
    }
}

fn cancel_animations(app: &mut App) {
    app.get_window().get_animator().abandon_all();
}

fn exe_pos_event(app: &mut App, v: Dot<f64,f64>, prop: Option<f64>, anim: bool) {
    if !anim {
        cancel_animations(app);
    }    
    let train_manager = app.get_window().get_train_manager();
    let v = if let (Some(prop),Some(desired)) = (prop,train_manager.get_desired_position()) {
        Dot(desired.pos_prop_bp_to_origin(v.0,prop),v.1)
    } else {
        v
    };
    app.update_position();
    app.with_compo(|co| { co.set_position(v); });
}

fn exe_pos_range_event(app: &mut App, x_start: f64, x_end: f64, y: f64) {
    cancel_animations(app);
    let middle = Dot((x_start+x_end)/2.,y);
    app.update_position();
    app.intend_here();
    app.with_compo(|co| {
        co.set_bp_per_screen(x_end-x_start);
        co.set_position(middle);
    });
}

fn exe_move_event(app: &mut App, v: Move<f64,f64>) {
    cancel_animations(app);
    if let Some(desired) = app.get_window().get_train_manager().get_desired_position() {
        let screen = app.get_screen().clone();
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,&screen,&desired),
            Axis::Vert => v.convert(Units::Pixels,&screen,&desired),
            Axis::Zoom => v // TODO invalid pre-unification
        };
        let pos = desired.get_middle()+v;
        app.update_position();
        app.with_compo(|co| {
            co.set_position(pos);
        });
    }
}

fn exe_zoom_event(app: &mut App, za: f64, by: bool, anim: bool) {
    if !anim {
        cancel_animations(app);
    }
    let train_manager = app.get_window().get_train_manager();
    let middle = train_manager.get_desired_position().map(|p| p.get_middle());
    let mut delta = 0.;
    if let Some(desired) = train_manager.get_desired_position() {
        if by {
            delta = bp_to_zoomfactor(desired.get_screen_in_bp());
        }
    }
    app.update_position();
    app.with_compo(|co| {
        co.set_bp_per_screen(zoomfactor_to_bp(za+delta)); 
        if let Some(middle) = middle {
            co.set_position(middle);
        }
    });
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
            app.update_position();
            app.intend_here();
        }
    } else {
        console_force!("NO SUCH STICK {}",name);
    }
}

fn exe_reset_state(a: &mut App) {
    a.with_state(|s| {
        s.reset_atom_state();
    });
}

fn exe_set_state(a: &mut App, name: &str, on: bool, default: bool) {
    a.with_state(|s| {
        s.set_atom_state(name,on,default);
    });
}

fn exe_zmenu_click_check(app: &mut App, pos: &CPixel, currency: Option<f64>) {
    let screen = app.get_screen().clone();
    let acts = app.with_compo(|co|
            co.intersects(&screen,*pos)
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
    let tm = a.get_window().get_train_manager();
    tm.jump_to_focus_object();
}

fn exe_jump_focus(a: &mut App, id: &str) {
    let mut tm = a.get_window().get_train_manager().clone();
    exe_set_focus(a,id);
    tm.jump_to_focus_object();
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
        //console!("action {:?}",ev);
        match ev {
            Action::Pos(v,prop) => exe_pos_event(cg,v,prop,false),
            Action::PosAnim(v,prop) => exe_pos_event(cg,v,prop,true),
            Action::PosRange(x_start,x_end,y) => exe_pos_range_event(cg,x_start,x_end,y),
            Action::Move(va) => exe_move_event(cg,va),
            Action::Zoom(za) => exe_zoom_event(cg,za,true,false),
            Action::ZoomTo(za) => exe_zoom_event(cg,za,false,false),
            Action::ZoomToAnim(za) => exe_zoom_event(cg,za,false,true),
            Action::Resize(sz) => exe_resize(cg,sz),
            Action::AddComponent(name) => exe_component_add(cg,&name),
            Action::SetStick(name) => exe_set_stick(cg,&name),
            Action::ResetState => exe_reset_state(cg),
            Action::SetDefaultState(name,on) => exe_set_state(cg,&name,on,true),
            Action::SetState(name,on) => exe_set_state(cg,&name,on,false),
            Action::SetFocus(id) => exe_set_focus(cg,&id),
            Action::JumpFocus(id) => exe_jump_focus(cg,&id),
            Action::Settled => exe_settled(cg),
            Action::ZMenuClickCheck(pos) => exe_zmenu_click_check(cg,&pos,currency),
            Action::ShowZMenu(id,track_id,pos,payload) => exe_zmenu_show(cg,&id,&track_id,pos,payload),
            Action::Reset => exe_reset(cg),
            Action::ActivityOutsideZMenu => exe_deactivate(cg),
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
