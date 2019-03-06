use std::sync::{ Arc, Mutex };

use serde_json::Map as JSONMap;
use serde_json::Value as JSONValue;
use serde_json::Number as JSONNumber;


use controller::global::{ App, AppRunner };
use util::ChangeDetect;

enum ViewportReportItem {
    DeltaY(i32)
}

impl ViewportReportItem {
    pub fn to_json(&self, map: &mut JSONMap<String,JSONValue>) {
        match self {
            ViewportReportItem::DeltaY(dy) => {
                let v = JSONValue::Number(JSONNumber::from_f64(*dy as f64).unwrap());
                map.insert("delta_y".to_string(),v);
            }
        }
    }
}

pub struct ViewportReportImpl {
    delta_y: ChangeDetect<i32>
}

impl ViewportReportImpl {
    pub fn new() -> ViewportReportImpl {
        ViewportReportImpl {
            delta_y: ChangeDetect::<i32>::new()
        }
    }
    
    fn set_delta_y(&mut self, y: i32) {
        self.delta_y.set(y);
    }
    
    fn get_items(&mut self) -> Vec<ViewportReportItem> {
        let mut out = Vec::<ViewportReportItem>::new();
        if let Some(dy) = self.delta_y.report() {
            out.push(ViewportReportItem::DeltaY(dy));
        }
        out
    }
    
    fn build_value(&self, items: Vec<ViewportReportItem>) -> JSONValue {
        let mut out = JSONMap::<String,JSONValue>::new();
        for item in items {
            item.to_json(&mut out);
        }
        let mut ty = Vec::<JSONValue>::new();
        for i in 0..10 {
            ty.push(JSONValue::Number(JSONNumber::from_f64((i*50) as f64).unwrap()));
        }
        out.insert("track_y".to_string(),JSONValue::Array(ty));
        JSONValue::Object(out)
    }
    
    fn tick(&mut self, app: &mut App) {
        let items = self.get_items();
        if items.len() > 0 {
            let val = self.build_value(items);
            app.send_viewport_report(&val);
        }
    }
}

#[derive(Clone)]
pub struct ViewportReport(Arc<Mutex<ViewportReportImpl>>);

impl ViewportReport {
    pub fn new(ar: &mut AppRunner) -> ViewportReport {
        let out = ViewportReport(Arc::new(Mutex::new(ViewportReportImpl::new())));
        ar.add_timer(enclose! { (out) move |app,t| {
            out.clone().tick(app)
        }},None);
        out
    }
    
    pub fn set_delta_y(&self, y: i32) {
        self.0.lock().unwrap().set_delta_y(y);
    }
    
    pub fn tick(&self, app: &mut App) {
        self.0.lock().unwrap().tick(app);
    }
}
