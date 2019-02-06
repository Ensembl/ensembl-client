use std::collections::HashMap;
use std::sync::{ Arc, Mutex };

use controller::global::{ App, AppRunner };

struct Status {
    value: String,
    last_value: Option<String>,
    last_sent: Option<f64>,
    send_every: Option<f64>
}

impl Status {
    fn is_send_now(&self, key: &str, t: f64) -> bool {
        if let Some(interval) = self.send_every {
            if interval == 0. { return true; }
            if let Some(last_sent) = self.last_sent {
                if t - last_sent > interval { return true; }
            } else {
                return true;
            }
        }
        return false;
    }
    
    fn send_now(&mut self, key: &str, t: f64) -> bool {
        if let Some(ref last_value) = self.last_value {
            if *last_value == self.value { return false; }
        }
        if self.is_send_now(key,t) {
            self.last_sent = Some(t);
            self.last_value = Some(self.value.clone());
            return true;
        }
        return false;
    }
    
    fn set_interval(&mut self, interval: Option<f64>) {
        self.send_every = interval;
    }
}

const REPORT_CONFIG: &[(&str,Option<f64>)] = &[
    ("stick",Some(500.)),
    ("start",Some(500.)),
    ("end",Some(500.)),
];

pub struct ReportImpl {
    statuses: HashMap<String,Status>
}

impl ReportImpl {
    pub fn new() -> ReportImpl {
        let out = ReportImpl {
            statuses: HashMap::<String,Status>::new()
        };
        out
    }
    
    fn get_entry(&mut self, key: &str) -> &mut Status {
        self.statuses.entry(key.to_string()).or_insert_with(||
            Status {
                value: "".to_string(),
                last_value: None,
                last_sent: None,
                send_every: Some(0.)
            }
        )
    }
        
    pub fn set_status(&mut self, key: &str, value: &str) {
        let s = self.get_entry(key);
        if s.value == value { return; }
        s.value = value.to_string();
    }

    pub fn set_interval(&mut self, key: &str, interval: Option<f64>) {
        let s = self.get_entry(key);
        s.set_interval(interval);
    }

    fn new_report(&mut self, t: f64) -> HashMap<String,String> {
        let mut out = HashMap::<String,String>::new();
        for (k,s) in &mut self.statuses {
            if s.send_now(k,t) {
                out.insert(k.to_string(),s.value.clone());
            }
        }
        out
    }
    
    pub fn tick(&mut self, app: &App, t: f64) {
        let out = self.new_report(t);
        if out.len() > 0 {
            debug!("status","{:?}",out);
        }
    }
}

#[derive(Clone)]
pub struct Report(Arc<Mutex<ReportImpl>>);

impl Report {
    pub fn new(ar: &mut AppRunner) -> Report {
        let mut out = Report(Arc::new(Mutex::new(ReportImpl::new())));
        for (k,v) in REPORT_CONFIG {
            out.set_interval(k,*v);
        }
        ar.add_timer(enclose! { (out) move |app,t| {
            out.clone().tick(app,t)
        }},None);
        out
    }
    
    pub fn set_status(&self, key: &str, value: &str) {
        let mut imp = self.0.lock().unwrap();
        imp.set_status(key,value);
    }    
    
    pub fn set_interval(&mut self, key: &str, interval: Option<f64>) {
        let mut imp = self.0.lock().unwrap();
        imp.set_interval(key,interval);
    }
    
    pub fn tick(&mut self, app: &mut App, t: f64) {
        self.0.lock().unwrap().tick(app,t);
    }
}
