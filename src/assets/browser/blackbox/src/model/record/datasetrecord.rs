use crate::{ Format, Record };
use serde_json::Value as SerdeValue;
use serde_json::Number as SerdeNumber;

pub struct DatasetRecord {
    stream_name: String,
    record_name: String,
    raw_data: Vec<(f64,f64)>,
    units: String
}

impl DatasetRecord {
    pub fn new(stream_name: &str, record_name: &str, units: &str) -> DatasetRecord {
        DatasetRecord {
            stream_name: stream_name.to_string(),
            record_name: record_name.to_string(),
            raw_data: Vec::new(),
            units: units.to_string()
        }
    }

    pub fn add_datapoint(&mut self, t:f64, v: f64) {
        self.raw_data.push((t,v));
    }

    fn analyse_raw_data(&self) -> (usize,f64,f64,f64,f64) {
        let mut sorted : Vec<f64> = self.raw_data.iter().map(|x| x.1).collect();
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

    pub fn to_string(&self) -> Option<String> {
        let (num,tot,avg,high,top) = self.analyse_raw_data();
        if num > 0 {
            Some(format!("{}: num={} total={:.2}{} avg={:.2}{} 95%ile={:.2}{} top={:.2}{}",
                    self.record_name,num,tot,self.units,avg,self.units,high,self.units,top,self.units))
        } else {
            None
        }
    }

    fn include_raw(&self, format: &Format) -> bool {
        format.test_include_raw(&self.stream_name,&self.record_name)
    }
}

fn to_string<T>(data: T) -> String where T: Iterator<Item=f64> {
    data.map(|x| x.to_string()).collect::<Vec<_>>().join(",")
}

fn to_json<T>(data: T) -> SerdeValue where T: Iterator<Item=f64> {
    let values : Vec<SerdeValue> = data.map(|x| 
        SerdeValue::Number(SerdeNumber::from_f64(x).unwrap())
    ).collect();
    SerdeValue::Array(values)
}

impl Record for DatasetRecord {
    fn get_as_line(&self, now: f64, instance: &str, format: &Format) -> Option<String> {
        let summary = self.to_string();
        if summary.is_none() { return None; }
        let mut out = format!("[{}][{}] {}",now,instance,summary.unwrap());
        if self.include_raw(format) {
            out.push_str(&format!(" [{}] ago [{}]",
                to_string(self.raw_data.iter().map(|x| x.1)),
                to_string(self.raw_data.iter().map(|x| now-x.0))));
        }
        Some(out)
    }

    fn get_as_json(&self, now: f64, instance: &str, format: &Format) -> Option<SerdeValue> {
        let summary = self.to_string();
        if summary.is_none() { return None; }
        let (num,total,avg,high,top) = self.analyse_raw_data();
        let mut out = json!({
            "time": now,
            "stream": self.stream_name,
            "instance": instance,
            "text": self.to_string(),
            "dataset": self.record_name,
            "count": num,
            "total": total,
            "mean": avg,
            "high": high,
            "top": top
        });
        if self.include_raw(format) {
            let ago_serde = to_json(self.raw_data.iter().map(|x| now-x.0));
            out.as_object_mut().unwrap().insert("ago".to_string(),ago_serde);
            let dataset_serde = to_json(self.raw_data.iter().map(|x| x.1));
            out.as_object_mut().unwrap().insert("data".to_string(),dataset_serde);
        }
        Some(out)
    }

    fn get_stream_name(&self) -> &str { &self.stream_name }
    fn get_dataset_name(&self) -> Option<&str> { Some(&self.record_name) }
}
