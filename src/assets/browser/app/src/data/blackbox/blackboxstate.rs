use std::collections::{ HashMap, HashSet };
use std::sync::{ Arc, Mutex };

use serde_json::Value as SerdeValue;
use serde_json::Map as SerdeMap;
use stdweb::unstable::TryInto;

use dom::domutil::browser_time;
use util::get_instance_id;

struct Report {
    text: String,
    time: f64,
    stack: String
}

impl Report {
    fn new(text: String, stack: String, time: f64) -> Report {
        Report {
            text, time, stack
        }
    }
    
    fn to_json(&self) -> SerdeValue {
        json!({
            "time": self.time,
            "stack": self.stack,
            "text": self.text
        })
    }
}

struct ReportStream {
    name: String,
    reports: Vec<Report>
}

impl ReportStream {
    fn make_report(&self) -> SerdeValue {
        let mut stream = SerdeMap::<String,SerdeValue>::new();
        let mut reports = Vec::<SerdeValue>::new();
        for r in &self.reports {
            reports.push(r.to_json());
        }
        stream.insert("reports".to_string(),SerdeValue::Array(reports));
        SerdeValue::Object(stream)
    }
}

pub struct BlackBoxStateImpl {
    pending: HashMap<String,ReportStream>,
    enabled: Option<HashSet<String>>,
    stack: Vec<String>,
    stack_name: Option<String>,
    ms_offset: Option<f64>
}

impl BlackBoxStateImpl {
    fn new() -> BlackBoxStateImpl {
        BlackBoxStateImpl {
            pending: HashMap::new(),
            enabled: None,
            stack: Vec::new(),
            stack_name: None,
            ms_offset: None
        }
    }
    
    fn get_stream(&mut self, name: &str) -> &mut ReportStream {
        self.pending.entry(name.to_string()).or_insert_with(|| {
            ReportStream {
                name: name.to_string(),
                reports: Vec::new()
            }
        })
    }
    
    fn set_origin(&mut self, t: f64) {
        if self.ms_offset.is_none() {
            let now : f64 = js! { return +new Date(); }.try_into().unwrap();
            self.ms_offset = Some(now-t);
        }
    }
        
    fn report(&mut self, stream: &str, t: f64, reports: &str) {
        self.set_origin(t);
        if self.enabled.is_none() || self.enabled.as_ref().unwrap().contains(stream) || stream == "" {
            let offset = self.ms_offset.unwrap();
            let report = Report::new(
                reports.to_string(),
                self.get_stack_name().to_string(),
                offset+t
            );
            self.get_stream(stream).reports.push(report);
        }
    }
    
    fn make_report(&mut self) -> SerdeValue {
        let mut streams = SerdeMap::<String,SerdeValue>::new();
        if self.enabled.is_some() {
            for (name,reports) in &self.pending {
                if self.enabled.as_ref().unwrap().contains(name) {
                    streams.insert(name.to_string(),reports.make_report());
                }
            }
            self.pending = HashMap::new();
        }
        json!({
            "streams": streams,
            "instance_id": get_instance_id()
        })
    }
    
    pub fn set_enabled(&mut self, streams: Vec<String>) {
        let mut enabled = HashSet::new();
        for s in &streams {
            enabled.insert(s.to_string());
        }
        self.enabled = Some(enabled);
    }

    fn get_stack_name(&mut self) -> &str {
        if self.stack_name.is_none() {
            self.stack_name = Some(self.stack.join("/"));
        }
        self.stack_name.as_ref().unwrap()
    }

    fn push(&mut self, name: &str) {
        self.stack.push(name.to_string());
        self.stack_name = None;
    }

    fn pop(&mut self) {
        self.stack.pop();
        self.stack_name = None;
    }
}

#[derive(Clone)]
pub struct BlackBoxState(Arc<Mutex<BlackBoxStateImpl>>);

impl BlackBoxState {
    pub(in super) fn new() -> BlackBoxState {
        BlackBoxState(Arc::new(Mutex::new(BlackBoxStateImpl::new())))
    }
    
    pub fn make_report(&mut self) -> SerdeValue {
        self.0.lock().unwrap().make_report()
    }
    
    pub fn report(&mut self, stream: &str, t: f64, report: &str) {
        console!("A");
        self.0.lock().unwrap().report(stream,t,report);
    }
    
    pub fn set_enabled(&mut self, streams: Vec<String>) {
        self.0.lock().unwrap().set_enabled(streams);
    }
    
    pub fn push(&mut self, name: &str) {
        self.0.lock().unwrap().push(name);
    }

    pub fn pop(&mut self) {
        self.0.lock().unwrap().pop();
    }    
}
