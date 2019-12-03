use crate::{ LogRecord, Record };
use serde_json::Value as SerdeValue;
use serde_json::Number as SerdeNumber;

pub struct DatasetRecord {
    elapsed: Vec<f64>,
    include_raw: bool,
    units: String
}

impl DatasetRecord {
    pub fn new(units: &str) -> DatasetRecord {
        DatasetRecord {
            elapsed: Vec::new(),
            include_raw: false,
            units: units.to_string()
        }
    }

    pub fn add_datapoint(&mut self, v: f64) {
        self.elapsed.push(v);
    }

    fn analyse_elapsed(&self) -> (usize,f64,f64,f64,f64) {
        let mut sorted = self.elapsed.clone();
        let num = sorted.len();
        if num > 0 {
            sorted.sort_by(|a,b| a.partial_cmp(b).unwrap());
            let total = sorted.iter().sum();
            let top = sorted.len()-1;
            let high = ((top+1)*19/20).max(1)-1;
            (num,total,total/num as f64,sorted[high],sorted[top])
        } else {
            (0,0.,-1.,-1.,-1.)
        }
    }

    pub fn to_string(&self) -> String {
        let (num,tot,avg,high,top) = self.analyse_elapsed();
        if num > 0 {
            format!("elapsed: num={} total={:.2}{} avg={:.2}{} 95%ile={:.2}{} top={:.2}{}",
                    num,tot,self.units,avg,self.units,high,self.units,top,self.units)
        } else {
            format!("no events")
        }
    }
}

impl Record for DatasetRecord {
    fn get_as_line(&self, now: f64, include_raw: bool) -> String {
        let mut out = format!("[{}] {}",now,self.to_string());
        if include_raw {
            out.push_str(&format!("[{}]",self.elapsed.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",")));
        }
        out
    }

    fn get_as_json(&self, now: f64, include_raw: bool) -> SerdeValue {
        let mut out = json!({
            "time": now,
            "summary": self.to_string()
        });
        if include_raw {
            let dataset_serde = self.elapsed.iter().map(|x| {
                SerdeValue::Number(SerdeNumber::from_f64(*x).unwrap())
            }).collect();
            let dataset_serde = SerdeValue::Array(dataset_serde);
            out.as_object_mut().unwrap().insert("dataset".to_string(),dataset_serde);
        }
        out
    }
}
