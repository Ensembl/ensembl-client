use std::cmp::Ordering;
use std::sync::Arc;
use hashbrown::{ HashMap, HashSet };
use serde_json::Value as SerdeValue;

use crate::{ Format, Integration, Record, Stream, TrivialIntegration, records_to_lines, records_to_json };

pub fn time_sort(data: &mut Vec<Box<dyn Record>>) {
    data.sort_by(|a,b| {
        match (a.time_override(),b.time_override()) {
            (None,None) => Ordering::Equal,
            (None,Some(_)) => Ordering::Greater,
            (Some(_),None) => Ordering::Less,
            (Some(a),Some(b)) => a.partial_cmp(&b).unwrap()
        }
    });
}

pub struct Model {
    configured: bool,
    enabled: HashSet<String>,
    streams: HashMap<String,Stream>,
    integration: Box<dyn Integration>,
    mute: bool,
    stack: Arc<Vec<String>>
}

impl Model {
    pub fn new<T>(integration: Option<T>) -> Model where T: Integration + 'static {
        let mute = integration.is_none();
        Model {
            configured: false,
            enabled: HashSet::new(),
            streams: HashMap::new(),
            integration: integration.map(|x| Box::new(x) as Box<dyn Integration>)
                            .unwrap_or_else(|| Box::new(TrivialIntegration::new()) as Box<dyn Integration>),
            mute,
            stack: Arc::new(vec![])
        }
    }

    pub(crate) fn get_time(&self) -> f64 { self.integration.get_time() }
    pub(crate) fn get_instance_id(&self) -> String { self.integration.get_instance_id() }
    pub(crate) fn get_stack(&self) -> Arc<Vec<String>> { self.stack.clone() }

    pub fn push(&mut self, level: &str) {
        let mut new = self.stack.to_vec();
        new.push(level.to_string());
        self.stack = Arc::new(new);
    }

    pub fn pop(&mut self) {
        let mut new = self.stack.to_vec();
        new.pop();
        self.stack = Arc::new(new);
    }

    pub fn get_all_streams(&self) -> impl Iterator<Item=&Stream> {
        self.streams.values()
    }

    pub fn get_all_streams_mut(&mut self) -> impl Iterator<Item=&mut Stream> {
        self.streams.values_mut()
    }

    pub fn get_stream(&mut self, name: &str) -> Option<&mut Stream> {
        let enabled = self.is_enabled(name);
        let units = self.integration.get_time_units();
        let stream = self.streams.entry(name.to_string()).or_insert_with(||
            Stream::new(name,&units)
        );
        if !self.mute && enabled { Some(stream) } else { None }
    }

    pub fn enable(&mut self, stream: &str) {
        self.enabled.insert(stream.to_string());
    }

    pub fn disable(&mut self, stream: &str) {
        self.enabled.remove(stream);
    }

    pub fn disable_all(&mut self) {
        self.configured = true;
        self.enabled.clear()
    }

    pub fn is_enabled(&self, stream: &str) -> bool {
        if !self.configured { return true; }
        self.enabled.contains(stream)
    }

    pub fn take_records(&mut self) -> Vec<Box<dyn Record>> {
        let mut out = Vec::new();
        for stream in self.streams.values_mut() {
            out.extend(stream.take_records());
        }
        time_sort(&mut out);
        out
    }

    pub fn take_lines(&mut self, now: f64, format: &Format) -> Vec<String> {
        records_to_lines(&mut self.take_records().iter(),now,&self.get_instance_id(),format)
    }

    pub fn take_json(&mut self, now: f64, format: &Format) -> SerdeValue {
        let iid = self.get_instance_id().clone();
        records_to_json(self.get_all_streams_mut(),now,&iid,format)
    }
}