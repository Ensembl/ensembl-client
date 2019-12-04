use owning_ref::MutexGuardRefMut;
use std::sync::Mutex;
use serde_json::Value as SerdeValue;

use crate::{ Config, Format, Integration, Model, NullIntegration, Record };

/* TODO

thread local
remove DEBUG
init welcome
server
unit test wrappers
app integration
tests
update README

*/

thread_local! {
    static TL_MODEL: Mutex<Model> = Mutex::new(Model::new(NullIntegration::new()));
    static TL_FORMAT: Mutex<Format> = Mutex::new(Format::new());
}

lazy_static! {
    static ref USE_TL: Mutex<bool> = Mutex::new(false);
    static ref MODEL: Mutex<Model> = Mutex::new(Model::new(NullIntegration::new()));
    static ref FORMAT: Mutex<Format> = Mutex::new(Format::new());
}

/* Getting the correct Model! */

/* Setup and configuration */

pub fn blackbox_model<'a>() -> MutexGuardRefMut<'a,Model> {
    if *USE_TL.lock().unwrap() {
        MutexGuardRefMut::new(TL_MODEL.with(|model| model.lock().unwrap()))
    } else {
        MutexGuardRefMut::new(MODEL.lock().unwrap())
    }
}

pub fn blackbox_format<'a>() -> MutexGuardRefMut<'a,Format> {
    MutexGuardRefMut::new(FORMAT.lock().unwrap())
}

pub fn blackbox_integration<T>(integration: T, use_tl: bool) where T: Integration + 'static {
    *USE_TL.lock().unwrap() = use_tl;
    if use_tl {
        TL_MODEL.with(|model| *model.lock().unwrap() =  Model::new(integration));
    } else {
        *MODEL.lock().unwrap() = Model::new(integration);
    }
}

pub fn blackbox_enable(stream: &str) {
    blackbox_model().enable(stream);
}

pub fn blackbox_disable(stream: &str) {
    blackbox_model().disable(stream);
}

pub fn blackbox_disable_all() {
    blackbox_model().disable_all();
}

pub fn blackbox_is_enabled(stream: &str) -> bool {
    blackbox_model().is_enabled(stream)
}

pub fn blackbox_raw_on(stream: &str, name: &str) {
    blackbox_format().include_raw_data(stream,name,true)
}

pub fn blackbox_raw_off(stream: &str, name: &str) {
    blackbox_format().include_raw_data(stream,name,false)
}

pub fn blackbox_config(config: &SerdeValue) -> bool {
    if let Some(config) = Config::new_from_json(config) {
        config.update_model(&mut blackbox_model());
        config.update_format(&mut blackbox_format());
        true
    } else { false }
}

/* reporting */

pub fn blackbox_take_records() -> Vec<Box<dyn Record>> {
    MODEL.lock().unwrap().take_records()
}

pub fn blackbox_take_lines() -> Vec<String> {
    let format = blackbox_format();
    let mut model = blackbox_model();
    let time = model.get_time();
    model.take_lines(time,&format)
}

pub fn blackbox_take_json() -> SerdeValue {
    let format = blackbox_format();
    let mut model = blackbox_model();
    let time = model.get_time();
    model.take_json(time,&format)
}

/* stack */

pub fn blackbox_push(name: &str) {
    blackbox_model().push(name);
}

pub fn blackbox_pop() {
    blackbox_model().pop();
}

/* diagnostics */

pub fn blackbox_log(stream: &str, text: &str) {
    let mut model = blackbox_model();
    let time = model.get_time();
    let stack = model.get_stack();
    if let Some(stream) = model.get_stream(stream) {
        stream.add_log(time,stack,text);
    }
}

pub fn blackbox_count(stream: &str, name: &str, amt: f64) {
    let mut model = blackbox_model();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).add_count(amt);
    }
}

pub fn blackbox_set_count(stream: &str, name: &str, amt: f64) {
    let mut model = blackbox_model();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).set_count(amt);
    }
}

pub fn blackbox_reset_count(stream: &str, name: &str) {
    let mut model = blackbox_model();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).reset_count();
    }
}

pub fn blackbox_start(stream: &str, name: &str) {
    let mut model = blackbox_model();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_start(time);
    }
}

pub fn blackbox_end(stream: &str, name: &str) {
    let mut model = blackbox_model();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_end(time);
    }
}

pub fn blackbox_metronome(stream: &str, name: &str) {
    let mut model = blackbox_model();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_metronome(name).add_tick(time);
    }
}
