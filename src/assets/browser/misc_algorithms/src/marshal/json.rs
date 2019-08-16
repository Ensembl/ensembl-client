use serde_json::Value as SerdeValue;

pub fn json_str(v: &SerdeValue) -> Result<String,()> {
    v.as_str()
        .map(|v| v.to_string())
        .or_else(|| v.as_f64().map(|v| v.to_string()))
        .or_else(|| v.as_i64().map(|v| v.to_string()))
        .or_else(|| v.as_bool().map(|v| v.to_string()))
        .ok_or(())
}

pub fn json_array(v: &SerdeValue) -> Result<&Vec<SerdeValue>,()> {
    v.as_array().ok_or(())
}

pub fn json_obj_get<'a>(v: &'a SerdeValue, k: &str) -> Result<&'a SerdeValue,()> {
    v.as_object().and_then(|obj| obj.get(k)).ok_or(())
}

pub fn json_f64(v: &SerdeValue) -> Result<f64,()> {
    json_str(v)?.parse().map_err(|_|())
}

pub fn json_bool(v: &SerdeValue) -> Result<bool,()> {
    json_str(v)?.parse().map_err(|_|())
}