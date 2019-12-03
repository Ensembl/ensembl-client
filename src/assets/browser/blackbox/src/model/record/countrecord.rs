use crate::Record;
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct CountRecord {
    dataset_record: DatasetRecord,
    count: f64
}

impl CountRecord {
    pub fn new(units: &str) -> CountRecord {
        CountRecord {
            dataset_record: DatasetRecord::new(units),
            count: 0.
        }
    }

    pub fn add_count(&mut self, amt: f64) {
        self.count += amt;
    }

    pub fn reset_count(&mut self) {
        self.dataset_record.add_datapoint(self.count);
        self.count = 0.;
    }

    pub fn to_string(&self) -> String {
        self.dataset_record.to_string()
    }
}

impl Record for CountRecord {
    fn get_as_line(&self, now: f64, include_raw: bool) -> String { self.dataset_record.get_as_line(now,include_raw) }
    fn get_as_json(&self, now: f64, include_raw: bool) -> SerdeValue { self.dataset_record.get_as_json(now,include_raw) }
}

