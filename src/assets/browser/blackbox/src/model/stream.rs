use hashbrown::HashMap;
use std::sync::Arc;

use crate::{ CountRecord, ElapsedRecord, LogRecord, MetronomeRecord, Record, ValueRecord };

pub struct Stream {
    name: String,
    log_records: Vec<LogRecord>,
    count_records: HashMap<String,CountRecord>,
    elapsed_records: HashMap<String,ElapsedRecord>,
    metronome_records: HashMap<String,MetronomeRecord>,
    value_records: HashMap<String,ValueRecord>,
    time_units: String
}

impl Stream {
    pub(crate) fn new(name: &str,time_units: &str) -> Stream {
        Stream {
            name: name.to_string(),
            log_records: Vec::new(),
            count_records: HashMap::new(),
            elapsed_records: HashMap::new(),
            metronome_records: HashMap::new(),
            value_records: HashMap::new(),
            time_units: time_units.to_string(),
        }
    }

    pub fn get_name(&self) -> &str { &self.name }

    pub fn add_log(&mut self, time: f64, stack: Arc<Vec<String>>, text: &str) {
        let record = LogRecord::new(&self.name,time,stack,text.to_string());
        self.log_records.push(record);
    }

    pub fn get_value(&mut self, name: &str) -> &mut ValueRecord {
        let stream_name = self.name.to_string();
        self.value_records.entry(name.to_string()).or_insert_with(|| {
            ValueRecord::new(&stream_name,name,"")
        })
    }

    pub fn get_count(&mut self, name: &str) -> &mut CountRecord {
        let stream_name = self.name.to_string();
        let units = self.time_units.to_string();
        self.count_records.entry(name.to_string()).or_insert_with(|| {
            CountRecord::new(&stream_name,name,&units)
        })
    }

    pub fn get_elapsed(&mut self, name: &str) -> &mut ElapsedRecord {
        let stream_name = self.name.to_string();
        let units = self.time_units.to_string();
        self.elapsed_records.entry(name.to_string()).or_insert_with(|| {
            ElapsedRecord::new(&stream_name,name,&units)
        })
    }

    pub fn get_metronome(&mut self, name: &str) -> &mut MetronomeRecord {
        let stream_name = self.name.to_string();
        let units = self.time_units.to_string();
        self.metronome_records.entry(name.to_string()).or_insert_with(|| {
            MetronomeRecord::new(&stream_name,name,&units)
        })
    }

    pub(crate) fn take_records(&mut self) -> Vec<Box<dyn Record>> {
        let mut out = Vec::new();
        out.extend(self.log_records.drain(..).map(|r| Box::new(r) as Box<dyn Record>));
        out.extend(self.value_records.drain().map(|r| Box::new(r.1) as Box<dyn Record>));
        out.extend(self.count_records.drain().map(|r| Box::new(r.1) as Box<dyn Record>));
        out.extend(self.elapsed_records.drain().map(|r| Box::new(r.1) as Box<dyn Record>));
        out.extend(self.metronome_records.drain().map(|r| Box::new(r.1) as Box<dyn Record>));
        out
    }
}
