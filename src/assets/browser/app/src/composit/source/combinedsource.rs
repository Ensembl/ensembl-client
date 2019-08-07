use std::collections::HashMap;
use std::rc::Rc;

use composit::{ 
    ActiveSource, Leaf, Plot, OrderReceiver,
    StateAtom, AllLandscapes
};
use composit::source::PurchaseOrder;
use data::{ BackendConfig, HttpXferClerk };
use debug::{ add_debug_sources };
use composit::source::PendingOrder;
use tácode::{ Tácode, TáSource };
use model::focus::FocusObject;
use model::zmenu::ZMenuRegistry;

const TOP : i32 = 50;
const PITCH : i32 = 63;

pub struct CombinedSource {
    backend_source: Box<OrderReceiver>,
    per_stick_sources: HashMap<String,Box<OrderReceiver>>,
}

impl CombinedSource {
    pub fn new(backend_source: Box<OrderReceiver>) -> CombinedSource {
        CombinedSource {
            backend_source,
            per_stick_sources: HashMap::<String,Box<OrderReceiver>>::new()
        }
    }
    
    pub fn add_per_stick(&mut self, name: &str, source: Box<OrderReceiver>) {
        let name = name.to_string();
        self.per_stick_sources.insert(name.clone(),source);
    }
}

impl OrderReceiver for CombinedSource {
    fn receive_order(&self, acs: &ActiveSource, lc: PendingOrder) {
        let stick_name = lc.get_purchase_order().get_leaf().get_stick().get_name();
        if let Some(source) = self.per_stick_sources.get(&stick_name) {
            source.receive_order(acs,lc);
        } else {
            self.backend_source.receive_order(acs,lc);
        }
    }
}

pub fn build_combined_source(tc: &Tácode, config: &BackendConfig, zmr: &ZMenuRegistry, als: &mut AllLandscapes, xf: &HttpXferClerk, type_name: &str, focus: &FocusObject) -> Option<ActiveSource> {
    let lid = als.allocate(type_name);
    let cfg_track = config.get_track(type_name);
    let y_pos = cfg_track.map(|t| t.get_position()).unwrap_or(-1);
    let letter = cfg_track.map(|t| t.get_letter()).unwrap_or("");
    let plot = Plot::new(y_pos*PITCH+TOP,PITCH,letter.to_string(),y_pos!=-1);
    als.with(lid, |ls| ls.set_plot(plot) );
    let backend = TáSource::new(tc,Box::new(xf.clone()),lid,config,focus);
    let mut combined = CombinedSource::new(Box::new(backend));
    add_debug_sources(&mut combined,type_name);
    let mut act = ActiveSource::new(type_name,Rc::new(combined),zmr,als,lid);
    act.new_part(None,Rc::new(StateAtom::new(&type_name)));
    let none = vec!{};
    let parts = cfg_track.map(|t| t.get_parts()).unwrap_or(&none);
    for part in parts {
        let state_name = format!("{}:{}",type_name,part);
        act.new_part(Some(part),Rc::new(StateAtom::new(&state_name)));
    }
    Some(act)
}
