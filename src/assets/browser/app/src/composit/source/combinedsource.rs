use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Landscape, Leaf, Plot, Source, SourceResponse,
    StateAtom, AllLandscapes
};
use data::{ BackendConfig, HttpXferClerk };
use debug::{ add_debug_sources };
use tácode::{ Tácode, TáSource };

const TOP : i32 = 50;
const PITCH : i32 = 63;

/* A CombinedSource is a single *track* but it may come from multiple
 * sources depending on the stick (eg speices). At the moment we only
 * support a single backend source along with local debug sources but
 * this is where any additional logic would go.
 */
pub struct CombinedSource {
    backend_source: Box<Source>,
    per_stick_sources: HashMap<String,Box<Source>>,
}

impl CombinedSource {
    pub fn new(backend_source: Box<Source>) -> CombinedSource {
        CombinedSource {
            backend_source,
            per_stick_sources: HashMap::<String,Box<Source>>::new()
        }
    }
    
    pub fn add_per_stick(&mut self, name: &str, source: Box<Source>) {
        let name = name.to_string();
        self.per_stick_sources.insert(name.clone(),source);
    }
}

impl Source for CombinedSource {
    fn populate(&self, acs: &ActiveSource, lc: &mut SourceResponse, leaf: &Leaf) {
        let stick_name = leaf.get_stick().get_name();
        if let Some(source) = self.per_stick_sources.get(&stick_name) {
            source.populate(acs,lc,leaf);
        } else {
            self.backend_source.populate(acs,lc,leaf);
        }
    }
}

pub fn build_combined_source(tc: &Tácode, config: &BackendConfig, als: &mut AllLandscapes, xf: &HttpXferClerk, type_name: &str) -> Option<ActiveSource> {
    let lid = als.allocate();
    let y_pos = config.get_track(type_name).map(|t| t.get_position()).unwrap_or(-1);
    let letter = config.get_track(type_name).map(|t| t.get_letter()).unwrap_or("");
    console!("letter{:?}",letter);
    let plot = Plot::new(y_pos*PITCH+TOP,PITCH,letter.to_string());
    als.with(lid, |ls| ls.set_plot(plot) );
    let backend = TáSource::new(tc,Box::new(xf.clone()),type_name,lid);
    let mut combined = CombinedSource::new(Box::new(backend));
    add_debug_sources(&mut combined,type_name);
    let state = Rc::new(StateAtom::new(type_name));
    Some(ActiveSource::new(type_name,Rc::new(combined),state,als,lid))
}
