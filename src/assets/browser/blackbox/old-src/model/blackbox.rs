use std::sync::Mutex;

use super::blackboxstate::BlackBoxState;
use crate::BlackBoxDriver;

use crate::Integration;
use crate::integration::NullIntegration;

lazy_static! {
    static ref BLACKBOX: Mutex<BlackBoxState> = Mutex::new(BlackBoxState::new());
    static ref INTEGRATION: Mutex<Option<Box<dyn Integration>>> = Mutex::new(Some(Box::new(NullIntegration::new())));
}

pub fn blackbox_set_integration<T>(integration: T) where T: Integration+'static {
    INTEGRATION.lock().unwrap().replace(Box::new(integration));
}

pub(super) fn integration_time() -> f64 {
    let itn_opt = INTEGRATION.lock();
    let itn = itn_opt.as_ref().unwrap().as_ref().unwrap();
    itn.current_time()
}

pub(super) fn instance_id() -> String {
    let itn_opt = INTEGRATION.lock();
    let itn = itn_opt.as_ref().unwrap().as_ref().unwrap();
    itn.instance_id()
}

pub fn blackbox_tick(driver: &mut BlackBoxDriver) -> bool {
    let mut bb = BLACKBOX.lock().unwrap();
    let now = integration_time();
    driver.tick(&mut bb,now)
}

pub fn blackbox_count(stream: &str, name: &str, amt: u32, set: bool) {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.count(stream,name,amt,set);
}

pub fn blackbox_reset_count(stream: &str, name: &str) {
    let mut bb = BLACKBOX.lock().unwrap();
    let now = integration_time();
    bb.reset_count(stream,name,now);
}

pub fn blackbox_is_enabled(stream: &str) -> bool {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.is_enabled(stream)
}

pub fn blackbox_report(stream: &str, report: &str) {
    let mut bb = BLACKBOX.lock().unwrap();
    let now = integration_time();
    bb.report(stream,now,report);
}

pub fn blackbox_elapsed(stream: &str, elapsed: f64) {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.elapsed(stream,elapsed);
}

pub fn blackbox_metronome(stream: &str, t: f64) {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.metronome(stream,t);
}

pub fn blackbox_push(name: &str) {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.push(name);
}

pub fn blackbox_pop() {
    let mut bb = BLACKBOX.lock().unwrap();
    bb.pop();
}
