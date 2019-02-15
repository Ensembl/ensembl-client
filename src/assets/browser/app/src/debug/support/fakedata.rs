use std::collections::HashMap;

use yaml_rust::yaml::Yaml;
use yaml_rust::YamlLoader;
use tánaiste::Value;

use composit::Leaf;
use data::{ XferRequest, XferResponse };

lazy_static! {
    static ref FAKEDATA : &'static str = include_str!("../testcards/fakewiredata.yaml");
}

const PREFIX: &str = "internal:debug:";

#[derive(Debug)]
struct FakeResponse {
    code: String,
    data: Vec<Value>
}

pub struct FakeData {
    data: HashMap<String,HashMap<String,FakeResponse>>
}

impl FakeData {
    pub fn new() -> FakeData {
        let mut yaml_data = HashMap::<String,HashMap<String,FakeResponse>>::new();
        let docs = YamlLoader::load_from_str(&FAKEDATA).unwrap();
        if let Yaml::Hash(ref h) = docs[0] {
            for (card,v) in h {
                if let Yaml::Hash(ref v) = v {
                    for (source,v) in v {
                        if let Yaml::Hash(ref v) = v {
                            let code = &v[&Yaml::String("code".to_string())].as_str().unwrap();
                            let data = &v[&Yaml::String("data".to_string())];
                            let mut data_out = Vec::<Value>::new();
                            if let Yaml::Array(ref v) = data {
                                for e in v {
                                    match e {
                                        Yaml::Array(ref v) => {
                                            let mut val = Vec::<f64>::new();
                                            for e in v {
                                                val.push(e.as_f64().unwrap());
                                            }
                                            data_out.push(Value::new_from_float(val));
                                        },
                                        Yaml::String(ref v) => {
                                            data_out.push(Value::new_from_string(v.to_string()));
                                        },
                                        Yaml::Hash(ref v) => {
                                            if let Yaml::Array(ref v) = v[&Yaml::String("bytes".to_string())] {
                                                let mut val = Vec::<u8>::new();
                                                for e in v {
                                                    val.push(e.as_i64().unwrap() as u8);
                                                }
                                                data_out.push(Value::new_from_bytes(val));
                                            }
                                        }
                                        _ => ()
                                    }
                                }
                            }
                            let fr = FakeResponse {
                                code: code.to_string(),
                                data: data_out
                            };
                            yaml_data.entry(card.as_str().unwrap().to_string()).or_insert_with(||
                                HashMap::<String,FakeResponse>::new()
                            ).insert(source.as_str().unwrap().to_string(),fr);
                        }
                    }
                }
            }
        }
        FakeData { data: yaml_data }
    }
    
    pub fn satisfy(&self, request: XferRequest) -> Option<XferResponse> {
        let card = request.get_leaf().get_stick().get_name();
        let source = request.get_source_name().to_string();
        if source.starts_with(PREFIX) {
            let source = &source[PREFIX.len()..];
            if let Some(ref fr) = self.data.get(&card).and_then(|x| x.get(source)) {
                console!("called/6 request={:?}",request);
                return Some(XferResponse::new(request,fr.code.clone(),fr.data.clone()));
            }
        }
        None
    }
}
