use std::cmp::Ordering;
use std::sync::Arc;
use hashbrown::{ HashMap, HashSet };
use serde_json::Value as SerdeValue;

use crate::{ Format, Integration, Record, Stream };

fn time_sort(data: &mut Vec<Box<dyn Record>>) {
    data.sort_by(|a,b| {
        let at = a.time_override();
        let bt = b.time_override();
        match (a.time_override(),b.time_override()) {
            (None,None) => Ordering::Equal,
            (None,Some(_)) => Ordering::Greater,
            (Some(_),None) => Ordering::Less,
            (Some(a),Some(b)) => a.partial_cmp(&b).unwrap()
        }
    });
}

pub struct Model {
    include_raw: HashSet<(String,String)>,
    enabled: HashSet<String>,
    streams: HashMap<String,Stream>,
    integration: Box<dyn Integration>,
    stack: Arc<Vec<String>>
}

impl Model {
    pub fn new<T>(integration: T) -> Model where T: Integration + 'static {
        Model {
            include_raw: HashSet::new(),
            enabled: HashSet::new(),
            streams: HashMap::new(),
            integration: Box::new(integration),
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

    pub fn get_stream(&mut self, name: &str) -> Option<&mut Stream> {
        if self.enabled.contains(name) {
            let units = self.integration.get_time_units();
            Some(self.streams.entry(name.to_string()).or_insert_with(||
                Stream::new(name,&units)
            ))
        } else {
            None
        }
    }

    pub fn enable(&mut self, stream: &str) {
        self.enabled.insert(stream.to_string());
    }

    pub fn disable(&mut self, stream: &str) {
        self.enabled.remove(stream);
    }

    pub fn disable_all(&mut self) {
        self.enabled.clear()
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
        let instance = self.get_instance_id();
        self.take_records().iter().map(|r| {
            r.get_as_line(now,&instance,format)
        }).filter(|x| x.is_some()).map(|x| x.unwrap()).collect()
    }

    pub fn take_json(&mut self, now: f64, format: &Format) -> SerdeValue {
        let instance = self.get_instance_id();
        self.take_records().iter().map(|r| {
            r.get_as_json(now,&instance,format)
        }).filter(|x| x.is_some()).map(|x| x.unwrap()).collect()
    }
}