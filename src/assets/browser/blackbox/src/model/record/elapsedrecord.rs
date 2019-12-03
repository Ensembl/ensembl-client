use crate::Record;
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct ElapsedRecord {
    dataset_record: DatasetRecord,
    start: Option<f64>
}

impl ElapsedRecord {
    pub fn new(units: &str) -> ElapsedRecord {
        ElapsedRecord {
            dataset_record: DatasetRecord::new(units),
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

    pub fn to_string(&self) -> String {
        self.dataset_record.to_string()
    }
}

impl Record for ElapsedRecord {
    fn get_as_line(&self, now: f64, include_raw: bool) -> String { self.dataset_record.get_as_line(now,include_raw) }
    fn get_as_json(&self, now: f64, include_raw: bool) -> SerdeValue { self.dataset_record.get_as_json(now,include_raw) }
}
