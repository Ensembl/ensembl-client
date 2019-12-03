use crate::Record;
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct MetronomeRecord {
    dataset_record: DatasetRecord,
    prev: Option<f64>
}

impl MetronomeRecord {
    pub fn new(units: &str) -> MetronomeRecord {
        MetronomeRecord {
            dataset_record: DatasetRecord::new(units),
            prev: None
        }
    }

    pub fn add_tick(&mut self, time: f64) {
        if let Some(start) = self.prev {
            self.dataset_record.add_datapoint(time-start);
        }
        self.prev = Some(time);
    }

    pub fn to_string(&self) -> String {
        self.dataset_record.to_string()
    }
}

impl Record for MetronomeRecord {
    fn get_as_line(&self, now: f64, include_raw: bool) -> String { self.dataset_record.get_as_line(now,include_raw) }
    fn get_as_json(&self, now: f64, include_raw: bool) -> SerdeValue { self.dataset_record.get_as_json(now,include_raw) }
}

