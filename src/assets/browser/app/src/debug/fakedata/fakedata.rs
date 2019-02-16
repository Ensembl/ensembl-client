use std::collections::HashMap;

use yaml_rust::yaml::Yaml;
use yaml_rust::YamlLoader;
use tánaiste::Value;

use composit::{ Leaf, Scale };
use data::{ XferRequest, XferResponse };
use super::datagen::RngFlip;

lazy_static! {
    static ref FAKEDATA : &'static str = include_str!("fakewiredata.yaml");
}

const PREFIX: &str = "internal:debug:";

const ZOOMCODES: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

pub trait FakeDataGenerator {
    fn generate(&self, leaf: &Leaf) -> Value;
}

enum FakeValue {
    Immediate(Value),
    Delayed(Box<FakeDataGenerator>)
}

struct FakeResponse {
    code: String,
    data: Vec<FakeValue>
}

pub struct FakeData {
    data: HashMap<String,HashMap<String,FakeResponse>>
}

fn hash_key_float(yaml: &Yaml, key: &str) -> Option<f64> {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        match val {
            Some(Yaml::Integer(ref v)) => {
                return Some(*v as f64)
            },
            Some(Yaml::Real(ref v)) => {
                return Some(val.unwrap().as_f64().unwrap())
            },
            Some(Yaml::String(ref v)) => {
                return Some(val.unwrap().as_f64().unwrap())
            },
            _ => ()
        }
    }
    None
}

fn make_data(out: &mut Vec<FakeValue>, e: &Yaml) {
    match e {
        Yaml::Array(ref v) => {
            let mut val = Vec::<f64>::new();
            for e in v {
                val.push(e.as_f64().unwrap());
            }
            out.push(FakeValue::Immediate(Value::new_from_float(val)));
        },
        Yaml::String(ref v) => {
            out.push(FakeValue::Immediate(Value::new_from_string(v.to_string())));
        },
        Yaml::Hash(ref v) => {
            for (kind,v) in v {
                if let Yaml::String(ref kind) = kind {
                    match &kind[..] {
                        "bytes" => {
                            let mut val = Vec::<u8>::new();
                            if let Yaml::Array(ref v) = v {
                                for e in v {
                                    val.push(e.as_i64().unwrap() as u8);
                                }
                            }
                            out.push(FakeValue::Immediate(Value::new_from_bytes(val)));
                        },
                        "flip" => {
                            let seed = hash_key_float(v,"seed").unwrap() as u8;
                            let spacing = hash_key_float(v,"spacing").unwrap();
                            let (sense,sense_p) = match hash_key_float(v,"sense") {
                                Some(sense) => {
                                    console!("A");
                                    if sense < 0. {
                                        (true,None)
                                    } else {
                                        (true,Some(sense))
                                    }
                                },
                                None => (false,None)
                            };
                            let seed = [seed,0,0,0,0,0,0,0];
                            let rng = RngFlip::new(seed,spacing as i32,sense_p,sense);
                            out.push(FakeValue::Delayed(Box::new(rng)));
                        },
                        _ => ()
                    }
                }
            }
        }
        _ => ()
    }
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
                            let mut data_out = Vec::<FakeValue>::new();
                            if let Yaml::Array(ref v) = data {
                                for e in v {
                                    make_data(&mut data_out,e);
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
        
    fn get_response(&self, leaf: &Leaf, source: &str) -> Option<&FakeResponse> {
        let card = leaf.get_stick().get_name();
        let c = leaf.get_scale().get_index();
        if let Some(ref x) = self.data.get(&card) {
            for (k,v) in x.iter() {
                let parts : Vec<&str> = k.rsplitn(2,"--").collect();
                if parts.len() > 1 {
                    let (a,b) = (parts[0].chars().nth(0),parts[0].chars().nth(1));
                    let (a,b) = (Scale::new_from_letter(a.unwrap()),Scale::new_from_letter(b.unwrap()));
                    let (a,b) = (a.get_index(),b.get_index());
                    if parts[1] == source && c >= a && c <= b {
                        return Some(v);
                    }
                } else {
                    if parts[0] == source {
                        return Some(v);
                    }
                }
            }
        }
        None
    }
    
    pub fn satisfy(&self, request: XferRequest) -> Option<XferResponse> {
        let card = request.get_leaf().get_stick().get_name();
        let source = request.get_source_name().to_string();
        if source.starts_with(PREFIX) {
            let source = &source[PREFIX.len()..];
            if let Some(ref fr) = self.get_response(request.get_leaf(),source) {
                let mut data = Vec::<Value>::new();
                for e in &fr.data {
                    data.push(match e {
                        FakeValue::Immediate(ref e) => {
                            e.clone()
                        },
                        FakeValue::Delayed(ref g) => {
                            g.generate(request.get_leaf())
                        },
                    });
                }
                return Some(XferResponse::new(request,fr.code.clone(),data));
            }
        }
        None
    }
}
