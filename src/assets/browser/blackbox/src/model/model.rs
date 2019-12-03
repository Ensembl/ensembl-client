use std::cmp::Ordering;
use std::sync::Arc;
use hashbrown::{ HashMap, HashSet };
use serde_json::Value as SerdeValue;

use crate::{ Record, Stream };

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
    time_units: String
}

impl Model {
    pub fn new(time_units: &str) -> Model {
        Model {
            include_raw: HashSet::new(),
            enabled: HashSet::new(),
            streams: HashMap::new(),
            time_units: time_units.to_string()
        }
    }

    pub(crate) fn get_time(&self) -> f64 {
        0. // XXX
    }

    pub(crate) fn get_stack(&self) -> Arc<Vec<String>> {
        Arc::new(vec![]) // XXX
    }

    pub fn get_stream(&mut self, name: &str) -> Option<&mut Stream> {
        if self.enabled.contains(name) {
            let units = self.time_units.to_string();
            Some(self.streams.entry(name.to_string()).or_insert_with(||
                Stream::new(&units)
            ))
        } else {
            None
        }
    }

    pub fn take_records(&mut self) -> Vec<Box<dyn Record>> {
        let mut out = Vec::new();
        for stream in self.streams.values_mut() {
            out.extend(stream.take_records());
        }
        time_sort(&mut out);
        out
    }

    pub fn include_raw_data(&mut self, stream: &str, name: &str, b: bool) {
        if b {
            self.include_raw.insert((stream.to_string(),name.to_string()));
        } else {
            self.include_raw.remove(&(stream.to_string(),name.to_string()));
        }
    }

    pub fn take_lines(&mut self, now: f64, include_raw: bool) -> Vec<String> {
        self.take_records().iter().map(|r| {
            r.get_as_line(now,include_raw)
        }).collect()
    }

    pub fn take_json(&mut self, now: f64, include_raw: bool) -> SerdeValue {
        self.take_records().iter().map(|r| {
            r.get_as_json(now,include_raw)
        }).collect()
    }
}