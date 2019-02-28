use serde_json;
use serde_json::Value as SerdeValue;
use stdweb::Value as StdwebValue;
use stdweb::web::ArrayBuffer;
use tánaiste::Value;

pub fn xfer_marshal(data: Vec<u8>) -> Vec<Value> {
    let data = String::from_utf8(data).ok().unwrap();
    let data : SerdeValue = serde_json::from_str(&data).ok().unwrap();
    let mut out = Vec::<Value>::new();
    for val in data["data"].as_array().unwrap() {
        let mut row = Vec::<f64>::new();
        if val.is_array() {
            for cell in val.as_array().unwrap() {
                if cell.is_f64() {
                    row.push(cell.as_f64().unwrap());
                } else if cell.is_i64() {
                    row.push(cell.as_i64().unwrap() as f64);
                } else if cell.is_boolean() {
                    row.push(if cell.as_bool().unwrap() { 1. } else { 0. } );
                }
            }
            out.push(Value::new_from_float(row));
        } else if val.is_string() {
            out.push(Value::new_from_string(val.as_str().unwrap().to_string()));
        }
    }
    out
}
