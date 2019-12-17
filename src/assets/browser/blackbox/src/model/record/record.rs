use serde_json::Value as SerdeValue;

use crate::Format;

pub trait Record {
    fn time_override(&self) -> Option<f64> { None }
    fn get_stream_name(&self) -> &str;
    fn get_dataset_name(&self) -> Option<&str> { None }
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String>;
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue>;
}
