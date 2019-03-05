use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Landscape, Leaf, Plot, Source, SourceResponse,
    StateAtom, AllLandscapes, CombinedSource
};

use data::{ BackendConfig, HttpXferClerk };

#[cfg(not(deploy))]
use debug::testcards::{
    leafcard_source, text_source, bs_source_main, bs_source_sub
};
use tácode::{ Tácode, TáSource };

#[cfg(deploy)]
pub const DEBUG_SOURCES : [&str;0] = [];

#[cfg(not(deploy))]
pub const DEBUG_SOURCES : [&str;8] = [
    "internal:debug:gene-pc-fwd",
    "internal:debug:gene-other-fwd",
    "internal:debug:gene-pc-rev",
    "internal:debug:gene-other-rev",
    "internal:debug:variant",
    "internal:debug:contig",
    "internal:debug:gc",
    "internal:debug:zzz-framework"
];

pub const DEMO_SOURCES : [&str;8] = [
    "gene-pc-fwd",
    "gene-other-fwd",
    "gene-pc-rev",
    "gene-other-rev",
    "variant",
    "contig",
    "gc",
    "zzz-framework"
];

#[cfg(deploy)]
pub fn add_debug_sources(s: &mut CombinedSource, name: &str) {}

#[cfg(not(deploy))]
pub fn add_debug_sources(s: &mut CombinedSource, name: &str) {
    let b = match name {
        "internal:debug:gene-pc-fwd" => Some(bs_source_sub(true)),
        "internal:debug:gene-pc-rev" => Some(bs_source_sub(false)),
        "internal:debug:gc" => Some(bs_source_main()),
        _ => None
    };
    if let Some(b) = b { s.add_per_stick("button",Box::new(b)); }
    s.add_per_stick("text",Box::new(text_source()));
    s.add_per_stick("leaf",Box::new(leafcard_source(true)));
    s.add_per_stick("ruler",Box::new(leafcard_source(false)));
}
