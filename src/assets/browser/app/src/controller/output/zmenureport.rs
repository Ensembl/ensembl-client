use std::sync::{ Arc, Mutex };

use serde_json::Value as JSONValue;

use controller::global::AppRunner;
use controller::output::OutputAction;
use types::Dot;

struct ZMenuReportsImpl {
    pending: Vec<JSONValue>
}

impl ZMenuReportsImpl {
    pub fn new() -> ZMenuReportsImpl {
        ZMenuReportsImpl {
            pending: Vec::new()
        }
    }
    
    fn add_report(&mut self, payload: JSONValue) {
        self.pending.push(payload);
    }
    
    fn get_reports(&mut self) -> Vec<JSONValue> {
        self.pending.drain(..).collect()
    }
}

#[derive(Clone)]
pub struct ZMenuReports(Arc<Mutex<ZMenuReportsImpl>>);

impl ZMenuReports {
    pub fn get_reports(&self) -> Vec<JSONValue> {
        self.0.lock().unwrap().get_reports()
    }
    
    pub fn add_activate(&self, id: &str, pos: Dot<i32,i32>, payload: JSONValue) {
        console!("add {}",payload.to_string());
        self.0.lock().unwrap().add_report(json!({
            "action": "create_zmenu",
            "id": id,
            "content": [payload],
            "anchor_coordinates": { "x": pos.0, "y": pos.1 }
        }));
    }
    
    pub fn new(ar: &mut AppRunner) -> ZMenuReports {
        let mut out = ZMenuReports(Arc::new(Mutex::new(ZMenuReportsImpl::new())));
        let twin = out.clone();
        ar.add_timer("zmenu-report", move |_app,t,sr| {
            let mut reports = twin.get_reports();
            if reports.len() != 0 {
                reports.drain(..).map(|report| {
                    OutputAction::SendCustomEvent("bpane-zmenu".to_string(),report)
                }).collect()
            } else {
                sr.unproductive();
                vec![]
            }
        },4);
        out
    }
}
