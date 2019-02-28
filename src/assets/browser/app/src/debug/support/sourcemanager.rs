use std::collections::HashMap;

use composit::{ SourceManager, ActiveSource, AllLandscapes };
use data::{ HttpManager, HttpXferClerk, BackendConfig };
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
}

lazy_static! {
    static ref SOURCE_TYPE_NAMES : HashMap<DebugSourceType,String> = {
        let mut out = HashMap::<DebugSourceType,String>::new();
        for (k,v) in SOURCE_TYPES.iter() {
            out.insert(v.clone(),k.to_string());
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
}
