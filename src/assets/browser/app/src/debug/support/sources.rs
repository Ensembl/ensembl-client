use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    StateValue, StateFixed, StateAtom, ActiveSource,
    Source, SourceResponse, Leaf
};
use debug::testcards::{ leafcard_source, text_source };
use debug::testcards::{ bs_source_main, bs_source_sub, polar_source, tá_source };
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

fn debug_source_main(tc: &Tácode) -> impl Source {
    let mut s = DebugSource::new();
    s.add_stick("polar",Box::new(polar_source(None)));
    s.add_stick("text",Box::new(text_source()));
    s.add_stick("leaf",Box::new(leafcard_source(true)));
    s.add_stick("ruler",Box::new(leafcard_source(false)));
    s.add_stick("button",Box::new(bs_source_main()));
    s.add_stick("tácode",Box::new(tá_source(tc)));
    s
}

fn debug_source_sub(even: bool) -> impl Source {
    let mut s = DebugSource::new();
    s.add_stick("button",Box::new(bs_source_sub(even)));
    s.add_stick("polar",Box::new(polar_source(Some(even))));
    s
}

pub fn component_debug_main(tc: &Tácode, name: &str) -> ActiveSource {
    let cs = debug_source_main(tc);
    ActiveSource::new(name,Rc::new(cs),Rc::new(StateFixed(StateValue::On())))    
}

pub fn component_debug_sub(name: &str, even: bool) -> ActiveSource {
    let cs = debug_source_sub(even);
    let state_name = if even { "even" } else { "odd" };
    let state = Rc::new(StateAtom::new(state_name));
    ActiveSource::new(name,Rc::new(cs),state)
}
