use crate::{ Format, Record };
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct CountRecord {
    dataset_record: DatasetRecord,
    count: f64
}

impl CountRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> CountRecord {
        CountRecord {
            dataset_record: DatasetRecord::new(stream_name,record_name,units),
            count: 0.
        }
    }

    pub fn set_count(&mut self, amt: f64) {
        self.count = amt;
    }

    pub fn add_count(&mut self, amt: f64) {
        self.count += amt;
    }

    pub fn reset_count(&mut self, now: f64) {
        self.dataset_record.add_datapoint(now,self.count);
        self.count = 0.;
    }

    pub fn to_string(&self) -> Option<String> {
        self.dataset_record.to_string()
    }
}

impl Record for CountRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> { self.dataset_record.get_as_line(now,instance,format) }
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> { self.dataset_record.get_as_json(now,instance,format) }
    fn get_stream_name(&self) -> &str { self.dataset_record.get_stream_name() }
    fn get_dataset_name(&self) -> Option<&str> { self.dataset_record.get_dataset_name() }
}

