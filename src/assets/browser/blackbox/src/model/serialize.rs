use crate::{ Format, Record };
use serde_json::Value as SerdeValue;

pub fn records_to_lines<'a,R>(records: R, now: f64, instance: &str, format: &Format) -> Vec<String> where R: Iterator<Item=&'a Box<dyn Record>> {
    records.map(|r| {
        r.get_as_line(now,&instance,format)
    }).filter(|x| x.is_some()).map(|x| x.unwrap()).collect()
}

pub fn records_to_json<'a,R>(records: R, now: f64, instance: &str, format: &Format) -> SerdeValue where R: Iterator<Item=&'a Box<dyn Record>> {
    records.map(|r| {
        r.get_as_json(now,&instance,format)
    }).filter(|x| x.is_some()).map(|x| x.unwrap()).collect()
}
