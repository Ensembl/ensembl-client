use crate::{ Format, Record };
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct ValueRecord {
    dataset_record: DatasetRecord
}

impl ValueRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> ValueRecord {
        ValueRecord {
            dataset_record: DatasetRecord::new(stream_name,record_name,units),
        }
    }

    pub fn set(&mut self, time: f64, value: f64) {
        self.dataset_record.add_datapoint(time,value);
    }

    pub fn to_string(&self) -> Option<String> {
        self.dataset_record.to_string()
    }
}

impl Record for ValueRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> { self.dataset_record.get_as_line(now,instance,format) }
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> { self.dataset_record.get_as_json(now,instance,format) }
    fn get_stream_name(&self) -> &str { self.dataset_record.get_stream_name() }
    fn get_dataset_name(&self) -> Option<&str> { self.dataset_record.get_dataset_name() }
}
