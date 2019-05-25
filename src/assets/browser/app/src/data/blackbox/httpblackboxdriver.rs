use serde_json::Value as SerdeValue;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use url::Url;

use super::{ BlackBoxDriverImpl, BlackBoxState };
use data::{ HttpManager, HttpResponseConsumer };

const REPORT_INTERVAL : f64 = 5000.; // ms

pub struct BlackBoxResponseConsumer {
    state: BlackBoxState
}

impl BlackBoxResponseConsumer {
    pub fn new(state: &BlackBoxState) -> BlackBoxResponseConsumer {
        BlackBoxResponseConsumer {
            state: state.clone()
        }
    }
}

fn serde_to_vec_string(in_: &SerdeValue, key:&str) -> Option<Vec<String>> {
    let mut out = None;
    if let SerdeValue::Object(map) = in_ {
        if let Some(SerdeValue::Array(enabled)) = map.get(key) {
            let mut v : Vec<String> = vec![];
            for stream in enabled {
                if let SerdeValue::String(string) = stream {
                    v.push(string.clone());
                }
            }
            out = Some(v);
        }
    }
    out
}

impl HttpResponseConsumer for BlackBoxResponseConsumer {
    fn consume(&mut self, req: XmlHttpRequest) {
        let value : ArrayBuffer = ok!(req.raw_response().try_into());
        let value : TypedArray<u8> = value.into();
        let data = ok!(String::from_utf8(value.to_vec()));
        let data : SerdeValue = ok!(serde_json::from_str(&data));
        if let Some(enabled) = serde_to_vec_string(&data,"enabled") {
            self.state.set_enabled(enabled);
        }
        if let Some(dataset) = serde_to_vec_string(&data,"dataset") {
            self.state.set_dataset(dataset);
        } else {
            self.state.set_dataset(vec![]);
        }
    }
}

pub struct HttpBlackBoxDriverImpl {
    manager: HttpManager,
    url: Url,
    last_report: Option<f64>
}

impl HttpBlackBoxDriverImpl {
    pub fn new(http_manager: &HttpManager, base: &Url) -> HttpBlackBoxDriverImpl {
        HttpBlackBoxDriverImpl {
            manager: http_manager.clone(),
            url: base.clone(),
            last_report: None
        }
    }
}

impl BlackBoxDriverImpl for HttpBlackBoxDriverImpl {
    fn tick(&mut self, state: &mut BlackBoxState, t: f64) {
        if self.last_report == None || t-self.last_report.unwrap() > REPORT_INTERVAL {
            let report = state.make_report().to_string();
            let xhr = XmlHttpRequest::new();
            xhr.open("POST",&self.url.as_str());
            xhr.set_request_header("Content-Type", "application/json");
            xhr.set_response_type(XhrResponseType::ArrayBuffer);
            let data = report.as_bytes();
            self.manager.add_request(xhr,Some(data),Box::new(BlackBoxResponseConsumer::new(state)));
            self.last_report = Some(t);
        }
    }
}
