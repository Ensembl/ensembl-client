use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Landscape, Leaf, Plot, Source, SourceResponse,
    StateAtom, AllLandscapes
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
    fn populate(&self, acs: &ActiveSource, lc: &mut SourceResponse, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        if let Some(source) = self.sources.get(&stick_name) {
            source.populate(acs,lc,leaf);
        } else {
            lc.done(0);
        }
    }
}

#[cfg(deploy)]
fn extra_source_type(s: &mut DebugSource, type_: &DebugSourceType) {}

#[cfg(not(deploy))]
fn extra_source_type(s: &mut DebugSource, type_: &DebugSourceType) {
    let b = match type_ {
        DebugSourceType::GenePcFwd => Some(bs_source_sub(true)),
        DebugSourceType::GenePcRev => Some(bs_source_sub(false)),
        DebugSourceType::GC => Some(bs_source_main()),
        _ => None
    };
    if let Some(b) = b { s.add_stick("button",Box::new(b)); }
    s.add_stick("text",Box::new(text_source()));
    s.add_stick("leaf",Box::new(leafcard_source(true)));
    s.add_stick("ruler",Box::new(leafcard_source(false)));
    s.add_stick("polar",Box::new(polar_source(type_)));
}

fn debug_source_type(tc: &Tácode, config: &BackendConfig, als: &mut AllLandscapes, xf: &HttpXferClerk, type_: &DebugSourceType, lid: usize) -> impl Source {
    let mut s = DebugSource::new();
    extra_source_type(&mut s,type_);
    let plot = Plot::new(type_.get_pos()*PITCH+TOP,PITCH,type_.get_letter());
    als.with(lid, |ls| ls.set_plot(plot) );
    let src = TáSource::new(tc,Box::new(xf.clone()),type_.get_name(),lid);
    s.add_stick("march",Box::new(src));
    for (name,_) in config.get_sticks().iter() {
        let src = TáSource::new(tc,Box::new(xf.clone()),type_.get_name(),lid);
        s.add_stick(name,Box::new(src));
    }
    s
}

pub fn debug_activesource_type(tc: &Tácode, config: &BackendConfig, als: &mut AllLandscapes, xf: &HttpXferClerk, type_: &DebugSourceType) -> ActiveSource {
    let lid = als.allocate();
    let src = debug_source_type(tc,config,als,xf,type_,lid);
    let state = Rc::new(StateAtom::new(type_.get_name()));
    ActiveSource::new(type_.get_name(),Rc::new(src),state,als,lid)
}
