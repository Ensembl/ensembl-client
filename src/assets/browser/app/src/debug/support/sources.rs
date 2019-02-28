use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Landscape, Leaf, Plot, Source, SourceResponse,
    StateAtom, AllLandscapes, CombinedSource
};

use data::{ BackendConfig, HttpXferClerk };

#[cfg(not(deploy))]
use debug::testcards::{
    leafcard_source, text_source,
    polar_source, bs_source_main, bs_source_sub
};
use debug::support::{
    DebugSourceType
};
use tácode::{ Tácode, TáSource };

#[cfg(deploy)]
pub fn add_debug_sources(s: &mut CombinedSource, type_: &DebugSourceType) {}

#[cfg(not(deploy))]
pub fn add_debug_sources(s: &mut CombinedSource, type_: &DebugSourceType) {
    let b = match type_ {
        DebugSourceType::GenePcFwd => Some(bs_source_sub(true)),
        DebugSourceType::GenePcRev => Some(bs_source_sub(false)),
        DebugSourceType::GC => Some(bs_source_main()),
        _ => None
    };
    if let Some(b) = b { s.add_per_stick("button",Box::new(b)); }
    s.add_per_stick("text",Box::new(text_source()));
    s.add_per_stick("leaf",Box::new(leafcard_source(true)));
    s.add_per_stick("ruler",Box::new(leafcard_source(false)));
    s.add_per_stick("polar",Box::new(polar_source(type_)));
}
