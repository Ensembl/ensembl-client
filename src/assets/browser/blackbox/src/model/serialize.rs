use crate::{ Format, Record, Stream, time_sort };
use serde_json::Value as SerdeValue;
use serde_json::Map as SerdeMap;

pub fn records_to_lines<'a,R>(records: R, now: f64, instance: &str, format: &Format) -> Vec<String> where R: Iterator<Item=&'a Box<dyn Record>> {
    records.map(|r| {
        r.get_as_line(now,&instance,format)
    }).filter(|x| x.is_some()).map(|x| x.unwrap()).collect()
}

pub fn records_to_json<'a,S>(streams: S, now: f64, instance: &str, format: &Format) -> SerdeValue where S: Iterator<Item=&'a mut Stream> {
    let mut streams_json = SerdeMap::new();
    let mut all_records = Vec::new();
    for stream in streams {
        let records = stream.take_records();
        let mut datasets = Vec::new();
        for record in records {
            if let Some(dataset_name) = record.get_dataset_name() {
                datasets.push(dataset_name.to_string());
            }
            all_records.push(record);
        }
        datasets.sort();
        let datasets_json = datasets.iter().map(|x| SerdeValue::String(x.to_string())).collect();
        streams_json.insert(stream.get_name().to_string(),SerdeValue::Array(datasets_json));
    }
    time_sort(&mut all_records);
    let mut records_json = Vec::new();
    for record in all_records.iter() {
        if let Some(value) = record.get_as_json(now,&instance,format) {
            records_json.push(value);
        }
    }
    json!({
        "records": records_json,
        "streams": streams_json
    })
}
