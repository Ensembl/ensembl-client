use serde_json::Value as SerdeValue;

use crate::Format;

use super::{
    countrecord::CountRecord,
    elapsedrecord::ElapsedRecord,
    metronomerecord::MetronomeRecord
};

pub trait Record {
    fn time_override(&self) -> Option<f64> { None }
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String>;
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue>;
}
