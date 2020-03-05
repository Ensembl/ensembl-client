use hashbrown::HashMap;
use crate::{ Format, Record };
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct ElapsedRecord {
    dataset_record: DatasetRecord,
    start: HashMap<Option<String>,f64>
}

impl ElapsedRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> ElapsedRecord {
        ElapsedRecord {
            dataset_record: DatasetRecord::new(stream_name,record_name,units),
            start: HashMap::new()
        }
    }

    pub fn add_start(&mut self, name: Option<&str>, time: f64) {
        self.start.insert(name.map(|x| x.to_string()),time);
    }

    pub fn add_end(&mut self, name: Option<&str>, time: f64) {
        if let Some(start) = self.start.remove(&name.map(|x| x.to_string())) {
            self.dataset_record.add_datapoint(time,time-start);
        }
    }

    pub fn to_string(&self) -> Option<String> {
        self.dataset_record.to_string()
    }
}

impl Record for ElapsedRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> { self.dataset_record.get_as_line(now,instance,format) }
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> { self.dataset_record.get_as_json(now,instance,format) }
    fn get_stream_name(&self) -> &str { self.dataset_record.get_stream_name() }
    fn get_dataset_name(&self) -> Option<&str> { self.dataset_record.get_dataset_name() }
}
