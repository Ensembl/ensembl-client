use dom::event::CustomData;
use serde_json::Value as JSONValue;
use serde_json::Map as JSONMap;
use dom::event::ICustomEvent;

pub struct AppEventData {
    detail: Option<JSONValue>
}

impl AppEventData {
    pub fn new(cd : &CustomData) -> AppEventData {
        AppEventData {
            detail: cd.details()
        }
    }
    
    pub fn get_simple_str(&self, key: &str, default: Option<&str>) -> Option<String> {
        let default = default.map(|v| v.to_string());
        let mut value : Option<String> = None;
        let empty = JSONValue::Object(JSONMap::new());
        let obj = self.detail.as_ref().unwrap_or(&empty);
        let json_value = obj.get(key);
        if let Some(JSONValue::String(v)) = json_value {
            return Some(v.to_string());
        }
        if value == None {
            if let Some(default) = default {
                return Some(default.to_string());
            }
        }
        None
    }
}
