use std::collections::{ HashMap, HashSet };
use std::sync::{ Arc, Mutex };

use serde_json::Value as SerdeValue;
use serde_json::Map as SerdeMap;
use stdweb::unstable::TryInto;

pub trait BlackBoxDriver {
    fn tick(&mut self, state: &mut BlackBoxState, t: f64) {}    
}

struct ReportStream {
    name: String,
    reports: Vec<(f64,String)>
}

impl ReportStream {
    fn make_report(&self) -> SerdeValue {
        let mut out = SerdeMap::<String,SerdeValue>::new();
        let mut reports = Vec::<SerdeValue>::new();
        for (time,text) in &self.reports {
            reports.push(json!({
                "time": time,
                "text": text
            }));
        }
        out.insert("reports".to_string(),SerdeValue::Array(reports));
        SerdeValue::Object(out)
    }
}

pub struct BlackBoxStateImpl {
    pending: HashMap<String,ReportStream>,
    enabled: HashSet<String>,
    ms_offset: Option<f64>
}

impl BlackBoxStateImpl {
    fn new() -> BlackBoxStateImpl {
        BlackBoxStateImpl {
            pending: HashMap::new(),
            enabled: HashSet::new(),
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
        
    fn report(&mut self, stream: &str, t: f64, report: &str) {
        self.set_origin(t);
        if self.enabled.contains(stream) || stream == "" {
            let offset = self.ms_offset.unwrap();
            self.get_stream(stream).reports.push((offset+t,report.to_string()));
        }
    }
    
    pub fn make_report(&mut self) -> SerdeValue {
        let mut out = SerdeMap::<String,SerdeValue>::new();
        for (name,reports) in &self.pending {
            out.insert(name.to_string(),reports.make_report());
        }
        self.pending = HashMap::new();
        SerdeValue::Object(out)
    }
    
    pub fn set_enabled(&mut self, streams: Vec<String>) {
        self.enabled.clear();
        for s in &streams {
            self.enabled.insert(s.to_string());
        }
    }
}

#[derive(Clone)]
pub struct BlackBoxState(Arc<Mutex<BlackBoxStateImpl>>);

impl BlackBoxState {
    fn new() -> BlackBoxState {
        BlackBoxState(Arc::new(Mutex::new(BlackBoxStateImpl::new())))
    }
    
    pub fn make_report(&mut self) -> SerdeValue {
        self.0.lock().unwrap().make_report()
    }
    
    pub fn report(&mut self, stream: &str, t: f64, report: &str) {
        self.0.lock().unwrap().report(stream,t,report);
    }
    
    pub fn set_enabled(&mut self, streams: Vec<String>) {
        self.0.lock().unwrap().set_enabled(streams);
    }
}

pub struct BlackBoxImpl {
    driver: Box<BlackBoxDriver>,
    state: BlackBoxState
}

impl BlackBoxImpl {
    fn new(driver: Box<BlackBoxDriver>) -> BlackBoxImpl {
        BlackBoxImpl {
            state: BlackBoxState::new(),
            driver
        }
    }
        
    fn tick(&mut self, t: f64) {
        self.driver.tick(&mut self.state,t);
    }
    
    fn report(&mut self, stream: &str, t: f64, report: &str) {
        self.state.report(stream,t,report);
    }
}

#[derive(Clone)]
pub struct BlackBox(Arc<Mutex<BlackBoxImpl>>);

impl BlackBox {
    pub fn new(driver: Box<BlackBoxDriver>) -> BlackBox {
        BlackBox(Arc::new(Mutex::new(BlackBoxImpl::new(driver))))
    }
    
    pub fn tick(&mut self, t: f64) {
        self.0.lock().unwrap().tick(t);
    }
    
    pub fn report(&mut self, stream: &str, t: f64, report: &str) {
        self.0.lock().unwrap().report(stream,t,report);
    }
}
