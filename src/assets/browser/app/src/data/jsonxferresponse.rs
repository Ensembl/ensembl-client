use serde_json::Value as SerdeValue;
use tánaiste::Value;

pub struct JSONXferResponse {
    pub codename: String,
    pub key: (String,String,String),
    pub values: Vec<Value>
}

fn marshal(data: &SerdeValue) -> Vec<Value> {
    let mut out = Vec::<Value>::new();
    for val in unwrap!(data.as_array()) {
        let mut row = Vec::<f64>::new();
        if val.is_array() {
            for cell in unwrap!(val.as_array()) {
                if cell.is_f64() {
                    row.push(unwrap!(cell.as_f64()));
                } else if cell.is_i64() {
                    row.push(unwrap!(cell.as_i64()) as f64);
                } else if cell.is_boolean() {
                    row.push(if unwrap!(cell.as_bool()) { 1. } else { 0. } );
                }
            }
            out.push(Value::new_from_float(row));
        } else if val.is_object() {
            if let Some(string) = unwrap!(val.as_object()).get("string") {
                let values : Vec<String> = 
                        unwrap!(string.as_array()).iter()
                        .map(|x| unwrap!(x.as_str()).to_string())
                        .collect();
                out.push(Value::new_from_string(values));
            }
        }
    }
    out
}

pub fn parse_jsonxferresponse(data: &SerdeValue) -> Vec<JSONXferResponse> {
    let mut out = Vec::new();
    for resp in unwrap!(data.as_array()) {
        let key = (unwrap!(resp[0].as_str()).to_string(),
                    unwrap!(resp[1].as_str()).to_string(),
                    unwrap!(resp[2].as_str()).to_string());
        out.push(JSONXferResponse {
            codename: unwrap!(resp[3].as_str()).to_string(),
            key,
            values: marshal(&resp[4])
        });
    }
    out
}

pub fn parse_jsonxferresponse_str(data: &str) -> Vec<JSONXferResponse> {
    parse_jsonxferresponse(&ok!(serde_json::from_str(data)))
}
