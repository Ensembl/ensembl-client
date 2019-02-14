use std::collections::HashMap;

use composit::{ SourceManager, ActiveSource };
use debug::support::{ debug_activesource_type };
use tácode::Tácode;

#[derive(PartialEq,Eq,Hash,Clone)]
pub enum DebugSourceType {
    GenePc,
    GeneOther,
    Variant,
    Contig,
    GC,
    Framework
}

lazy_static! {
    static ref SOURCE_TYPES : HashMap<String,DebugSourceType> = hashmap_s! {
        "internal:debug:gene-pc"    => DebugSourceType::GenePc,
        "internal:debug:gene-other" => DebugSourceType::GeneOther,
        "internal:debug:variant"    => DebugSourceType::Variant,
        "internal:debug:contig"     => DebugSourceType::Contig,
        "internal:debug:gc"         => DebugSourceType::GC,
        "internal:debug:zzz-framework" => DebugSourceType::Framework
    };
}

lazy_static! {
    static ref SOURCE_TYPE_NAMES : HashMap<DebugSourceType,String> = {
        let mut out = HashMap::<DebugSourceType,String>::new();
        for (k,v) in SOURCE_TYPES.iter() {
            out.insert(v.clone(),k.to_string());
        }
        out
    };
    
    static ref SOURCE_TYPE_KEYS : HashMap<DebugSourceType,String> = {
        let mut s = "qwertyuiop".chars().map(|x| x.to_string());
        let mut sorted : Vec<&String> = SOURCE_TYPES.keys().collect();
        sorted.sort_unstable();
        let mut out = HashMap::<DebugSourceType,String>::new();
        for (i,k) in sorted.iter().enumerate() {
            let v : DebugSourceType = SOURCE_TYPES[*k].clone();
            out.insert(v,s.next().unwrap());
        }
        out
    };
}

impl DebugSourceType {
    pub fn all() -> impl Iterator<Item=&'static DebugSourceType> {
        SOURCE_TYPE_NAMES.keys()
    }

    pub fn from_name(name: &str) -> Option<DebugSourceType> {
        SOURCE_TYPES.get(name).cloned()
    }
    
    pub fn get_name(&self) -> &str {
        SOURCE_TYPE_NAMES.get(self).unwrap()
    }
    
    pub fn get_key(&self) -> (String,String) {
        SOURCE_TYPE_KEYS.get(self).map(|k| {
            (k.to_uppercase(),k.clone())
        }).unwrap()
    }
}

pub struct DebugSourceManager {
    tc: Tácode
}

impl DebugSourceManager {
    pub fn new(tc: &Tácode) -> DebugSourceManager {
        DebugSourceManager {
            tc: tc.clone()
        }
    }
}

impl SourceManager for DebugSourceManager {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource> {
        DebugSourceType::from_name(name).map(|type_|
            debug_activesource_type(&self.tc,&type_)
        )
    }
}

