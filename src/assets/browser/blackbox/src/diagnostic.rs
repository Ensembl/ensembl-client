use crate::{ Model, Record };

/* These functions are mainly in one-to-one correspondence to the given macros/statics.
 * They don't really belong on Model itself as they encapsulate multiple, distinct
 * operations, but to put too much complexity in a macros/statics is evil. These functions
 * /are/ public, as they may be of some use externally, but are mainly here for the
 * benefit of the macro definitions and the static "globals".
 */

// TODO quick log
pub fn blackbox_log(model: &mut Model, stream: &str, text: &str) {
    let time = model.get_time();
    let stack = model.get_stack();
    if let Some(stream) = model.get_stream(stream) {
        stream.add_log(time,stack,text);
    }
}

pub fn blackbox_count(model: &mut Model, stream: &str, name: &str, amt: f64) {
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).add_count(amt);
    }
}

pub fn blackbox_reset_count(model: &mut Model, stream: &str, name: &str) {
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).reset_count();
    }
}

pub fn blackbox_start(model: &mut Model, stream: &str, name: &str) {
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_start(time);
    }
}

pub fn blackbox_end(model: &mut Model, stream: &str, name: &str) {
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_end(time);
    }
}

pub fn blackbox_metronome(model: &mut Model, stream: &str, name: &str) {
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_metronome(name).add_tick(time);
    }
}

pub fn blackbox_include_raw(model: &mut Model, stream: &str, name: &str, b: bool) {
    model.include_raw_data(stream,name,b);
}

pub fn blackbox_take_records(model: &mut Model) -> Vec<Box<dyn Record>> {
    model.take_records()
}
