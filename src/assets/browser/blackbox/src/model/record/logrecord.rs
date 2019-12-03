use serde_json::Value as SerdeValue;
use std::sync::Arc;

use crate::Record;

pub struct LogRecord {
    time: f64,
    stack: Arc<Vec<String>>,
    text: String
}

impl LogRecord {
    pub fn new(time: f64, stack: Arc<Vec<String>>, text: String) -> LogRecord {
        LogRecord { time, stack, text }
    }

    fn get_time(&self) -> f64 { self.time }
    fn get_stack(&self) -> &Vec<String> { &self.stack }
    pub fn get_text(&self) -> &str { &self.text }
}

impl Record for LogRecord {
    fn get_as_line(&self, _time: f64, _include_raw: bool) -> String {
        format!("[{}] {} {}",self.time,self.stack.join("/"),self.text)
    }

    fn get_as_json(&self, _time: f64, _include_raw: bool) -> SerdeValue {
        let stack = self.stack.to_vec();
        json!({
            "time": self.time,
            "stack": stack,
            "text": self.text
        })
    }

    fn time_override(&self) -> Option<f64> { Some(self.time) }
}
