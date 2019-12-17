use crate::{ Format, Record };
use super::datasetrecord::DatasetRecord;
use serde_json::Value as SerdeValue;

pub struct MetronomeRecord {
    dataset_record: DatasetRecord,
    prev: Option<f64>
}

impl MetronomeRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> MetronomeRecord {
        MetronomeRecord {
            dataset_record: DatasetRecord::new(stream_name,record_name,units),
            prev: None
        }
    }

    pub fn add_tick(&mut self, time: f64) {
        if let Some(start) = self.prev {
            self.dataset_record.add_datapoint(time,time-start);
        }
        self.prev = Some(time);
    }

    pub fn to_string(&self) -> Option<String> {
        self.dataset_record.to_string()
    }
}

impl Record for MetronomeRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> { self.dataset_record.get_as_line(now,instance,format) }
    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> { self.dataset_record.get_as_json(now,instance,format) }
    fn get_stream_name(&self) -> &str { self.dataset_record.get_stream_name() }
    fn get_dataset_name(&self) -> Option<&str> { self.dataset_record.get_dataset_name() }
}

