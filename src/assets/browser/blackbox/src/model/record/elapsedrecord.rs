use crate::{ Format, Record };
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct ElapsedRecord {
    dataset_record: DatasetRecord,
    start: Option<f64>
}

impl ElapsedRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> ElapsedRecord {
        ElapsedRecord {
            dataset_record: DatasetRecord::new(stream_name,record_name,units),
            start: None
        }
    }

    pub fn add_start(&mut self, time: f64) {
        self.start = Some(time);
    }

    pub fn add_end(&mut self, time: f64) {
        if let Some(start) = self.start.take() {
            self.dataset_record.add_datapoint(time-start);
        }
    }

    pub fn to_string(&self) -> Option<String> {
        self.dataset_record.to_string()
    }
}

impl Record for ElapsedRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> { self.dataset_record.get_as_line(now,instance,format) }
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> { self.dataset_record.get_as_json(now,instance,format) }
}
