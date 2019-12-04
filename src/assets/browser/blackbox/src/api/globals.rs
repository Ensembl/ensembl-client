use owning_ref::MutexGuardRef;
use std::sync::Mutex;
use serde_json::Value as SerdeValue;

use crate::{ Config, Format, Integration, Model, NullIntegration, Record };

/* TODO

remove DEBUG
init welcome
server
unit test wrappers
app integration
tests
update README

*/

lazy_static! {
    static ref MODEL: Mutex<Option<Model>> = Mutex::new(Some(Model::new(NullIntegration::new())));
    static ref FORMAT: Mutex<Format> = Mutex::new(Format::new());
}

/* Setup and configuration */

pub fn blackbox_model<'a>() -> MutexGuardRef<'a,Option<Model>> {
    MutexGuardRef::new(MODEL.lock().unwrap())
}

pub fn blackbox_format<'a>() -> MutexGuardRef<'a,Format> {
    MutexGuardRef::new(FORMAT.lock().unwrap())
}

pub fn blackbox_integration<T>(integration: T) where T: Integration + 'static {
    MODEL.lock().unwrap().replace(Model::new(integration));
}

pub fn blackbox_enable(stream: &str) {
    MODEL.lock().unwrap().as_mut().unwrap().enable(stream);
}

pub fn blackbox_disable(stream: &str) {
    MODEL.lock().unwrap().as_mut().unwrap().disable(stream);
}

pub fn blackbox_disable_all() {
    MODEL.lock().unwrap().as_mut().unwrap().disable_all();
}

pub fn blackbox_is_enabled(stream: &str) -> bool {
    MODEL.lock().unwrap().as_mut().unwrap().is_enabled(stream)
}

pub fn blackbox_raw_on(stream: &str, name: &str) {
    FORMAT.lock().unwrap().include_raw_data(stream,name,true)
}

pub fn blackbox_raw_off(stream: &str, name: &str) {
    FORMAT.lock().unwrap().include_raw_data(stream,name,false)
}

pub fn blackbox_config(config: &SerdeValue) -> bool {
    if let Some(config) = Config::new_from_json(config) {
        config.update_model(MODEL.lock().unwrap().as_mut().unwrap());
        config.update_format(&mut FORMAT.lock().unwrap());
        true
    } else { false }
}

/* reporting */

pub fn blackbox_take_records() -> Vec<Box<dyn Record>> {
    MODEL.lock().unwrap().as_mut().unwrap().take_records()
}

pub fn blackbox_take_lines() -> Vec<String> {
    let format = FORMAT.lock().unwrap();
    let mut model = MODEL.lock().unwrap();
    let time = model.as_mut().unwrap().get_time();
    model.as_mut().unwrap().take_lines(time,&format)
}

pub fn blackbox_take_json() -> SerdeValue {
    let format = FORMAT.lock().unwrap();
    let mut model = MODEL.lock().unwrap();
    let time = model.as_mut().unwrap().get_time();
    model.as_mut().unwrap().take_json(time,&format)
}

/* stack */

pub fn blackbox_push(name: &str) {
    MODEL.lock().unwrap().as_mut().unwrap().push(name);
}

pub fn blackbox_pop() {
    MODEL.lock().unwrap().as_mut().unwrap().pop();
}

/* diagnostics */

pub fn blackbox_log(stream: &str, text: &str) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    let time = model.get_time();
    let stack = model.get_stack();
    if let Some(stream) = model.get_stream(stream) {
        stream.add_log(time,stack,text);
    }
}

pub fn blackbox_count(stream: &str, name: &str, amt: f64) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).add_count(amt);
    }
}

pub fn blackbox_set_count(stream: &str, name: &str, amt: f64) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).set_count(amt);
    }
}

pub fn blackbox_reset_count(stream: &str, name: &str) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).reset_count();
    }
}

pub fn blackbox_start(stream: &str, name: &str) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_start(time);
    }
}

pub fn blackbox_end(stream: &str, name: &str) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_end(time);
    }
}

pub fn blackbox_metronome(stream: &str, name: &str) {
    let mut model = MODEL.lock().unwrap();
    let model = model.as_mut().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_metronome(name).add_tick(time);
    }
}
