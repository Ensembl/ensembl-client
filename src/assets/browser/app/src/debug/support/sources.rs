use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    StateAtom, ActiveSource, Source, SourceResponse, Leaf
};
use debug::testcards::{
    leafcard_source, text_source, march_source_cs, march_source_ts,
    polar_source, tá_source_cs , tá_source_ts, bs_source_main
};
use debug::support::{
    DebugSourceType, DebugXferClerk
};
use tácode::Tácode;

pub struct DebugSource {
    sources: HashMap<String,Box<Source>>
}

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
    s.add_stick("button",Box::new(bs_source_main()));
    if let Some(src) = tá_source_ts(&tc,xf,type_) {
        s.add_stick("tácode",Box::new(src));
    } else {
        s.add_stick("tácode",Box::new(tá_source_cs(type_)));
    }
    s
}

pub fn debug_activesource_type(tc: &Tácode, xf: &DebugXferClerk, type_: &DebugSourceType) -> ActiveSource {
    let src = debug_source_type(tc,xf,type_);
    let state = Rc::new(StateAtom::new(type_.get_name()));
    ActiveSource::new(type_.get_name(),Rc::new(src),state)
}
