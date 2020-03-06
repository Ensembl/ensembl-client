use hashbrown::HashMap;
use std::cell::RefCell;
use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::ThreadId;
use serde_json::Value as SerdeValue;

use crate::{ Config, Format, Integration, Model, TrivialIntegration, Record };

struct ThreadLocalTidier(bool);

impl ThreadLocalTidier {
    pub(crate) fn autotidy(&mut self, on: bool) {
        self.0 = on;
    }
}

impl Drop for ThreadLocalTidier {
    fn drop(&mut self) {
        if self.0 {
            blackbox_clear_real(true);
        }
    }
}

thread_local! {
    static TL_TIDY: RefCell<ThreadLocalTidier> = RefCell::new(ThreadLocalTidier(true));
}

lazy_static! {
    static ref USE_TL: Mutex<bool> = Mutex::new(false);

    static ref TL_MODEL: Mutex<HashMap<ThreadId,Arc<Mutex<Model>>>> = Mutex::new(HashMap::new());
    static ref TL_FORMAT: Mutex<HashMap<ThreadId,Arc<Mutex<Format>>>> = Mutex::new(HashMap::new());

    static ref MODEL: Arc<Mutex<Model>> = Arc::new(Mutex::new(Model::new(None as Option<TrivialIntegration>)));
    static ref FORMAT: Arc<Mutex<Format>> = Arc::new(Mutex::new(Format::new()));
}

/* Setup and configuration */

fn blackbox_clear_real(in_drop: bool) {
    if *USE_TL.lock().unwrap() {
        TL_MODEL.lock().unwrap().remove(&thread::current().id());
        TL_FORMAT.lock().unwrap().remove(&thread::current().id());
        if !in_drop {
            TL_TIDY.with(|v| v.borrow_mut().autotidy(false));
        }
    } else {
        *MODEL.lock().unwrap() = Model::new(None as Option<TrivialIntegration>);
        *FORMAT.lock().unwrap() = Format::new();
    }
}

pub fn blackbox_clear() {
    blackbox_clear_real(false);
}

/* Made public in crate for testing */
pub(crate) fn blackbox_model_id<'a>(id: ThreadId) -> Arc<Mutex<Model>> {
    if *USE_TL.lock().unwrap() {
        TL_MODEL.lock().unwrap().entry(id).or_insert_with(|| {
            Arc::new(Mutex::new(Model::new(None as Option<TrivialIntegration>)))
        }).clone()
    } else {
        MODEL.clone()
    }
}


pub fn blackbox_model<'a>() -> Arc<Mutex<Model>> {
    blackbox_model_id(thread::current().id())
}

pub fn blackbox_format<'a>() -> Arc<Mutex<Format>> {
    if *USE_TL.lock().unwrap() {
        TL_FORMAT.lock().unwrap().entry(thread::current().id()).or_insert_with(|| {
            Arc::new(Mutex::new(Format::new()))
        }).clone()
    } else {
        FORMAT.clone()
    }
}

pub fn blackbox_use_threadlocals(use_tl: bool) {
    *USE_TL.lock().unwrap() = use_tl;
}

pub fn blackbox_integration<T>(integration: T) where T: Integration + 'static {
    if *USE_TL.lock().unwrap() {
        TL_MODEL.lock().unwrap().entry(thread::current().id()).or_insert_with(|| {
            Arc::new(Mutex::new(Model::new(Some(integration))))
        });
        TL_TIDY.with(|_| {}); /* force into this thread */
    } else {
        *MODEL.lock().unwrap() = Model::new(Some(integration));
    }
}

pub fn blackbox_enable(stream: &str) {
    blackbox_model().lock().unwrap().enable(stream);
}

pub fn blackbox_disable(stream: &str) {
    blackbox_model().lock().unwrap().disable(stream);
}

pub fn blackbox_disable_all() {
    blackbox_model().lock().unwrap().disable_all();
}

pub fn blackbox_is_enabled(stream: &str) -> bool {
    blackbox_model().lock().unwrap().is_enabled(stream)
}

pub fn blackbox_raw_on(stream: &str, name: &str) {
    blackbox_format().lock().unwrap().include_raw_data(stream,name,true)
}

pub fn blackbox_raw_off(stream: &str, name: &str) {
    blackbox_format().lock().unwrap().include_raw_data(stream,name,false)
}

pub fn blackbox_config(config: &SerdeValue) -> bool {
    if let Some(config) = Config::new_from_json(config) {
        config.update_model(&mut blackbox_model().lock().unwrap());
        config.update_format(&mut blackbox_format().lock().unwrap());
        true
    } else { false }
}

/* reporting */

pub fn blackbox_take_records() -> Vec<Box<dyn Record>> {
    blackbox_model().lock().unwrap().take_records()
}

pub fn blackbox_take_lines() -> Vec<String> {
    let format = blackbox_format();
    let format = format.lock().unwrap();
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    model.take_lines(time,&format)
}

pub fn blackbox_take_json() -> SerdeValue {
    let format = blackbox_format();
    let format = format.lock().unwrap();
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    model.take_json(time,&format)
}

/* stack */

pub fn blackbox_push(name: &str) {
    blackbox_model().lock().unwrap().push(name);
}

pub fn blackbox_pop() {
    blackbox_model().lock().unwrap().pop();
}

/* diagnostics */

pub fn blackbox_log(stream_name: &str, text: &str) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    let stack = model.get_stack();
    if let Some(stream) = model.get_stream(stream_name) {
        stream.add_log(time,stack,text);
    }
}

pub fn blackbox_value(stream: &str, name: &str, value: f64) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_value(name).set(time,value);
    }
}

pub fn blackbox_count(stream: &str, name: &str, amt: f64) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).add_count(amt);
    }
}

pub fn blackbox_set_count(stream: &str, name: &str, amt: f64) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).set_count(amt);
    }
}

pub fn blackbox_reset_count(stream: &str, name: &str) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_count(name).reset_count(time);
    }
}

pub fn blackbox_start(stream: &str, name: &str, point: Option<&str>) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_start(point,time);
    }
}

pub fn blackbox_end(stream: &str, name: &str, point: Option<&str>) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_elapsed(name).add_end(point,time);
    }
}

pub fn blackbox_metronome(stream: &str, name: &str) {
    let model = blackbox_model();
    let mut model = model.lock().unwrap();
    let time = model.get_time();
    if let Some(stream) = model.get_stream(stream) {
        stream.get_metronome(name).add_tick(time);
    }
}
