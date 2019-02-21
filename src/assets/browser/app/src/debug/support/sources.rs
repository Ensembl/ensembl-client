use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Landscape, Leaf, Plot, Source, SourceResponse,
    StateAtom
};
use debug::testcards::{
    leafcard_source, text_source, march_source_cs, march_source_ts,
    polar_source, tá_source_cs , bs_source_main, bs_source_sub
};
use debug::support::{
    DebugSourceType, DebugXferClerk
};
use tácode::{ Tácode, TáSource };

pub struct DebugSource {
    sources: HashMap<String,Box<Source>>,
}

const TOP : i32 = 50;
const PITCH : i32 = 63;

impl DebugSource {
    fn new() -> DebugSource {
        DebugSource {
            sources: HashMap::<String,Box<Source>>::new()
        }
    }
    
    fn add_stick(&mut self, name: &str, source: Box<Source>) {
        let name = name.to_string();
        self.sources.insert(name.clone(),source);
    }
}

impl Source for DebugSource {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        if let Some(source) = self.sources.get(&stick_name) {
            source.populate(lc,leaf);
        } else {
            lc.done(0);
        }
    }
}

fn debug_source_type(tc: &Tácode, xf: &DebugXferClerk, type_: &DebugSourceType) -> impl Source {
    let mut s = DebugSource::new();
    s.add_stick("polar",Box::new(polar_source(type_)));
    if let Some(src) = march_source_ts(&tc,type_) {
        s.add_stick("march",Box::new(src));
    } else {
        s.add_stick("march",Box::new(march_source_cs(type_)));
    }
    s.add_stick("text",Box::new(text_source()));
    s.add_stick("leaf",Box::new(leafcard_source(true)));
    s.add_stick("ruler",Box::new(leafcard_source(false)));
    let b = match type_ {
        DebugSourceType::GenePcFwd => Some(bs_source_sub(true)),
        DebugSourceType::GenePcRev => Some(bs_source_sub(false)),
        DebugSourceType::GC => Some(bs_source_main()),
        _ => None
    };
    if let Some(b) = b { s.add_stick("button",Box::new(b)); }
    let ls = Landscape::new(Plot::new(type_.get_pos()*PITCH+TOP,PITCH));
    let src = TáSource::new(tc,Box::new(xf.clone()),type_.get_name(),ls);
    s.add_stick("tácode",Box::new(src));
    s
}

pub fn debug_activesource_type(tc: &Tácode, xf: &DebugXferClerk, type_: &DebugSourceType) -> ActiveSource {
    let src = debug_source_type(tc,xf,type_);
    let state = Rc::new(StateAtom::new(type_.get_name()));
    ActiveSource::new(type_.get_name(),Rc::new(src),state)
}
