use serde_json::Value as SerdeValue;
use std::sync::Arc;

use crate::{ Format, Record };

pub struct LogRecord {
    time: f64,
    stack: Arc<Vec<String>>,
    text: String,
    stream_name: String
}

impl LogRecord {
    pub fn new(stream_name: &str, time: f64, stack: Arc<Vec<String>>, text: String) -> LogRecord {
        LogRecord { time, stack, text, stream_name: stream_name.to_string() }
    }

    pub fn get_time(&self) -> f64 { self.time }
    pub fn get_stack(&self) -> &Vec<String> { &self.stack }
    pub fn get_text(&self) -> &str { &self.text }
}

impl Record for LogRecord {
    fn get_as_line(&self, _time: f64, instance: &str, _format: &Format) -> Option<String> {
        let stack = if self.stack.len() > 0 {
            format!(" {}",self.stack.join("/"))
        } else {
            String::new()
        };
        Some(format!("[{}][{}]{} {}",self.time,instance,stack,self.text))
    }

    fn get_as_json(&self, _time: f64, instance: &str, _format: &Format) -> Option<SerdeValue> {
        let stack = self.stack.to_vec();
        Some(json!({
            "time": self.time,
            "stream": self.stream_name,
            "stack": stack,
            "instance": instance,
            "text": self.text
        }))
    }

    fn time_override(&self) -> Option<f64> { Some(self.time) }

    fn get_stream_name(&self) -> &str { &self.stream_name }
}
