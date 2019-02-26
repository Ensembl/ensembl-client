use std::collections::HashMap;
use std::iter::empty;

use yaml_rust::yaml::Yaml;
use yaml_rust::YamlLoader;
use tánaiste::Value;

use composit::{ Leaf, Scale };
use data::{
    XferRequest, XferResponse, XferClerk, XferConsumer, HttpManager, 
    HttpXferClerk
};
use util::{
    hash_key_bool, hash_key_float, hash_key_string, hash_key_yaml,
    to_float, to_string
};
use super::datagen::{ RngContig, RngGene };
use super::FakeDataReceiver;

lazy_static! {
    static ref FAKEDATA : &'static str = include_str!("fakewiredata.yaml");
}

const PREFIX: &str = "internal:debug:";

pub trait FakeDataGenerator {
    fn generate(&self, leaf: &Leaf, fdr: &mut FakeDataReceiver);
}

enum FakeValue {
    Immediate(Value),
    Delayed(Box<FakeDataGenerator>)
}

struct FakeResponse {
    code: String,
    url: bool,
    data: Vec<FakeValue>
}

pub struct FakeData {
    http_clerk: HttpXferClerk,
    data: HashMap<String,HashMap<String,FakeResponse>>,
    code: HashMap<String,String>
}

fn contig(v: &Yaml) -> Box<FakeDataGenerator> {
    let seed = hash_key_float(v,"seed").unwrap() as u8;
    let seed = [seed,0,0,0,0,0,0,0];
    let len = hash_key_float(v,"len").unwrap() as i32;
    let prop = hash_key_float(v,"prop").unwrap();
    let seq = hash_key_bool(v,"seq");
    let pad = hash_key_float(v,"pad").unwrap() as i32;
    let shimmer = hash_key_bool(v,"shimmer");
    Box::new(RngContig::new(seed,pad,len,prop,seq,shimmer))
}

fn gene(v: &Yaml) -> Box<FakeDataGenerator> {
    let seed = hash_key_float(v,"seed").unwrap() as u8;
    let seed = [seed,0,0,0,0,0,0,0];
    let pad = hash_key_float(v,"pad").unwrap() as i32;
    let sep = hash_key_float(v,"sep").unwrap() as i32;
    let size = hash_key_float(v,"size").unwrap() as i32;
    let parts = hash_key_float(v,"parts").unwrap() as i32;
    let seq = hash_key_bool(v,"seq");
    Box::new(RngGene::new(seed,pad,sep,size,parts as u32,seq))
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
                        "contig" => {
                            out.push(FakeValue::Delayed(contig(v)));
                        },
                        "gene" => {
                            out.push(FakeValue::Delayed(gene(v)));
                        },
                        _ => ()
                    }
                }
            }
        }
        _ => ()
    }
}

fn hash_entries(in_: &Yaml) -> HashMap<String,Yaml> {
    let mut out = HashMap::<String,Yaml>::new();
    if let Yaml::Hash(ref v) = in_ {
        for (k,v) in v.iter() {
            if let Yaml::String(ref k) = k {
                out.insert(k.to_string(),v.clone());
            }
        }
    }
    out
}

impl FakeData {
    pub fn new(http_clerk: &HttpXferClerk) -> FakeData {
        let mut code = HashMap::<String,String>::new();
        let mut yaml_data = HashMap::<String,HashMap<String,FakeResponse>>::new();
        let docs = YamlLoader::load_from_str(&FAKEDATA).unwrap();
        console!("C");
        for (key,v) in hash_entries(&docs[0]) {
            match key.as_str() {
                "requests" => {        
                    for (card,v) in hash_entries(&v) {
                        for (source,v) in hash_entries(&v) {
                            let fr = if let Some(data) = hash_key_yaml(&v,"data") {
                                let code = hash_key_string(&v,"code").unwrap();
                                let mut data_out = Vec::<FakeValue>::new();
                                if let Yaml::Array(ref v) = data {
                                    for e in v {
                                        make_data(&mut data_out,e);
                                    }
                                }
                                FakeResponse {
                                    code: code.to_string(),
                                    url: false,
                                    data: data_out
                                }
                            } else {
                                FakeResponse {
                                    code: "".to_string(),
                                    url: hash_key_bool(&v,"url"),
                                    data: vec!{}
                                }
                            };
                            yaml_data.entry(card.clone()).or_insert_with(||
                                HashMap::<String,FakeResponse>::new()
                            ).insert(source,fr);
                        }
                    }
                },
                "code" => {
                    for (k,v) in hash_entries(&v) {
                        code.insert(k,to_string(&v).unwrap());
                    }
                },
                _ => ()
            };
        }
        console!("D");
        FakeData { code, data: yaml_data, http_clerk: http_clerk.clone() }
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
}

impl XferClerk for FakeData {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {        
        let card = request.get_leaf().get_stick().get_name();
        let source = request.get_source_name().to_string();
        if source.starts_with(PREFIX) {
            let source = &source[PREFIX.len()..];
            let mut http_clerk = self.http_clerk.clone();
            if let Some(ref fr) = self.get_response(request.get_leaf(),source) {
                if fr.url {
                    http_clerk.satisfy(request,consumer);
                } else {
                    let code = self.code[&fr.code].clone();
                    let leaf = request.get_leaf().clone();
                    let mut fdr = FakeDataReceiver::new(request,&code,consumer);
                    for e in &fr.data {
                        match e {
                            FakeValue::Immediate(ref e) => {
                                let idx = fdr.allocate();
                                fdr.set(idx,e.clone());
                            },
                            FakeValue::Delayed(ref g) => {
                                g.generate(&leaf,&mut fdr);
                            },
                        }
                    }
                    fdr.ready();
                }
                return;
            }
        }
        consumer.abandon();
    }
}

