use std::collections::HashMap;

use composit::{ SourceManager, ActiveSource, AllLandscapes };
use data::{ HttpManager, HttpXferClerk };
use debug::support::{ debug_activesource_type };
use tácode::Tácode;

#[derive(PartialEq,Eq,Hash,Clone,Debug)]
pub enum DebugSourceType {
    GenePcFwd,
    GeneOtherFwd,
    GenePcRev,
    GeneOtherRev,
    Variant,
    Contig,
    GC,
    Framework
}

lazy_static! {
    static ref SOURCE_TYPES : HashMap<String,DebugSourceType> = hashmap_s! {
        "internal:debug:gene-pc-fwd"    => DebugSourceType::GenePcFwd,
        "internal:debug:gene-other-fwd" => DebugSourceType::GeneOtherFwd,
        "internal:debug:gene-pc-rev"    => DebugSourceType::GenePcRev,
        "internal:debug:gene-other-rev" => DebugSourceType::GeneOtherRev,
        "internal:debug:variant"        => DebugSourceType::Variant,
        "internal:debug:contig"         => DebugSourceType::Contig,
        "internal:debug:gc"             => DebugSourceType::GC,
        "internal:debug:zzz-framework"  => DebugSourceType::Framework
    };
    
    static ref SOURCE_DATA : HashMap<String,(i32,&'static str)> = hashmap_s! {
        "internal:debug:gene-pc-fwd"    => (1,"G"),
        "internal:debug:gene-other-fwd" => (2,"G"),
        "internal:debug:gene-pc-rev"    => (4,"G"),
        "internal:debug:gene-other-rev" => (5,"G"),
        "internal:debug:variant"        => (6,"V"),
        "internal:debug:contig"         => (3,"G"),
        "internal:debug:gc"             => (7,"G"),
        "internal:debug:zzz-framework"  => (-1,"")
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
    
    static ref SOURCE_TYPE_DATA : HashMap<DebugSourceType,(i32,&'static str)> = {
        let mut out = HashMap::<DebugSourceType,(i32,&'static str)>::new();
        for (k,v) in SOURCE_DATA.iter() {
            let k : DebugSourceType = SOURCE_TYPES[k].clone();
            out.insert(k,*v);
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
    
    pub fn get_pos(&self) -> i32 {
        SOURCE_TYPE_DATA.get(&self).unwrap().0
    }

    pub fn get_letter(&self) -> String {
        SOURCE_TYPE_DATA.get(self).unwrap().1.to_string()
    }
}

pub struct DebugSourceManager {
    tc: Tácode,
    http_clerk: HttpXferClerk,
    als: AllLandscapes
}

impl DebugSourceManager {
    pub fn new(tc: &Tácode, http_clerk: &HttpXferClerk, als: &AllLandscapes) -> DebugSourceManager {
        DebugSourceManager {
            tc: tc.clone(),
            als: als.clone(),
            http_clerk: http_clerk.clone()
        }
    }
}

impl SourceManager for DebugSourceManager {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource> {
        DebugSourceType::from_name(name).map(|type_|
            debug_activesource_type(&self.tc,&mut self.als,&self.http_clerk,&type_)
        )
    }
}

