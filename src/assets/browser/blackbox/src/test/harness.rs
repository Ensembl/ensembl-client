use crate::blackbox_clear;

use std::sync::RwLock;

pub(crate) fn lines_contains(lines: &Vec<String>,segment: &str) -> bool {
    for line in lines {
        if line.contains(segment) { return true; }
    }
    false
}

lazy_static! {
    static ref LOCK: RwLock<bool> = RwLock::new(false);
}

pub(crate) fn read_lock<F>(func: F) where F: FnOnce() {
    let _lock = match LOCK.read() {
        Ok(guard) => guard,
        Err(poisoned) => poisoned.into_inner(),
    };
    func();
    blackbox_clear();
}

pub(crate) fn write_lock<F>(func: F) where F: FnOnce() {
    let mut _lock = match LOCK.write() {
        Ok(guard) => guard,
        Err(poisoned) => poisoned.into_inner(),
    };
    func();
    blackbox_clear();
}
