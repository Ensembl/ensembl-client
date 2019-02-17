use std::collections::HashMap;

use yaml_rust::yaml::Yaml;
use yaml_rust::YamlLoader;
use tánaiste::Value;

use composit::{ Leaf, Scale };
use data::{ XferRequest, XferResponse };
use super::datagen::{ RngFlip, RngFlipBool, RngFlipShimmer };

lazy_static! {
    static ref FAKEDATA : &'static str = include_str!("fakewiredata.yaml");
}

const PREFIX: &str = "internal:debug:";

pub trait FakeDataGenerator {
    fn generate(&self, leaf: &Leaf) -> Vec<Value>;
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

fn to_float(val: &Yaml) -> Option<f64> {
    match val {
        Yaml::Integer(ref v) => {
            return Some(*v as f64)
        },
        Yaml::Real(ref v) => {
            return val.as_f64()
        },
        Yaml::String(ref v) => {
            return val.as_f64()
        },
        _ => ()
    }
    None
}


fn hash_key_float(yaml: &Yaml, key: &str) -> Option<f64> {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        val.and_then(|v| to_float(v))
    } else {
        None
    }
}

fn to_bool(val: &Yaml) -> bool {
    match val {
        Yaml::Integer(v) => *v != 0,
        Yaml::Real(_) => val.as_f64().unwrap() != 0.,
        Yaml::String(v) => v != "",
        Yaml::Boolean(v) => *v,
        _ => false
    }
}

fn hash_key_bool(yaml: &Yaml, key: &str) -> bool {
    if let Yaml::Hash(ref d) = yaml {
        let val = d.get(&Yaml::String(key.to_string()));
        val.map(|v| to_bool(v)).unwrap_or(false)
    } else {
        false
    }
}

fn flipper(v: &Yaml) -> Box<FakeDataGenerator> {
    let seed = hash_key_float(v,"seed").unwrap() as u8;
    let spacing = hash_key_float(v,"spacing").unwrap();
    let seed = [seed,0,0,0,0,0,0,0];
    if let Some(sense) = hash_key_float(v,"sense") {
        if hash_key_bool(v,"shimmer") {
            Box::new(RngFlipShimmer::new(seed,spacing as i32,sense))
        } else {
            Box::new(RngFlipBool::new(seed,spacing as i32,sense))
        }
    } else {
        Box::new(RngFlip::new(seed,spacing as i32))
    }
}

fn make_data(out: &mut Vec<FakeValue>, e: &Yaml) {
    match e {
        Yaml::Array(ref v) => {
            let mut val = Vec::<f64>::new();
            for e in v {
                if let Some(v) = to_float(e) { val.push(v); }
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
                            out.push(FakeValue::Delayed(flipper(v)));
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
                    match e {
                        FakeValue::Immediate(ref e) => {
                            data.push(e.clone());
                        },
                        FakeValue::Delayed(ref g) => {
                            for v in g.generate(request.get_leaf()) {                           
                                data.push(v);
                            }
                        },
                    }
                }
                return Some(XferResponse::new(request,fr.code.clone(),data));
            }
        }
        None
    }
}
