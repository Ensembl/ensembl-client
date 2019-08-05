use std::collections::HashMap;

use serde_json::Value as JSONValue;

use composit::{ Leaf, Stage };
use controller::input::Action;
use types::{ Placement, Dot };

use super::{ ZMenuFeatureTmpl, ZMenuData };

#[derive(Clone)]
struct ZMenuItem {
    placement: Placement,
    track_id: String,
    id: String
}

pub struct ZMenuLeaf {
    items: Vec<ZMenuItem>,
    template: HashMap<String,ZMenuFeatureTmpl>,
    data: HashMap<String,ZMenuData>,
    leaf: Leaf,
    redrawn: bool
}

impl ZMenuLeaf {
    pub fn new(leaf: &Leaf) -> ZMenuLeaf {
        ZMenuLeaf {
            items: Vec::new(),
            template: HashMap::new(),
            data: HashMap::new(),
            leaf: leaf.clone(), 
            redrawn: false
        }
    }
    
    fn get_data(&mut self, id: &str) -> &mut ZMenuData {
        self.data.entry(id.to_string()).or_insert_with(||
            ZMenuData::new()
        )
    }
    
    pub fn redrawn(&mut self) {
        self.redrawn = true;
    }
    
    pub fn merge(&mut self, other: &ZMenuLeaf) {
        self.redrawn |= other.redrawn;
        self.items.extend(other.items.iter().cloned());
        self.data.extend(
            other.data.iter().map(|(k,v)| (k.clone(),v.clone()))
        );
        self.template.extend(
            other.template.iter().map(|(k,v)| (k.clone(),v.clone()))
        )
    }
    
    fn fix_leaf_offset(&self, zbox: &Placement) -> Placement {
        self.leaf.fix_placement(zbox)
    }
    
    pub fn add_box(&mut self, id: &str, track_id: &str, zbox: &Placement) {
        bb_log!("zmenu","add_box({:?},{:?})",id,self.fix_leaf_offset(zbox));
        self.items.push(ZMenuItem { id: id.to_string(), track_id: track_id.to_string(), placement: self.fix_leaf_offset(zbox) });
    }
    
    pub fn add_template(&mut self, sid: &str, spec: &str) {
        self.template.insert(sid.to_string(),ZMenuFeatureTmpl::new(spec));
    }
    
    pub fn set_template(&mut self, id: &str, sid: &str) {
        self.get_data(id).set_template(sid);
    }
    
    pub fn set_value(&mut self, id: &str, key: &str, value: &str) {
        self.get_data(id).set_value(key,value);
    }

    pub fn set_assoc(&mut self, to: &str, from: &str) {
        self.get_data(from).set_assoc(to);
    }
    
    pub(in super) fn get_leaf(&self) -> &Leaf { &self.leaf }
    pub(in super) fn was_redrawn(&self) -> bool { self.redrawn }
    
    fn activate_self(&self, id: &str, track_id: &str) -> Option<(JSONValue,Vec<String>)> {
        if let Some(zd) = self.data.get(id) {
            if let Some(sid) = zd.get_template() {
                if let Some(tmpl) = self.template.get(sid) {
                    let payload = tmpl.apply(id,track_id,zd.get_values());
                    return Some((json!(payload),zd.get_assocs().iter().cloned().collect()));
                }
            }
        }
        None
    }
    
    fn activate(&self, id: &str, track_id: &str) -> Option<JSONValue> {
        if let Some((payload_self,other_ids)) = self.activate_self(id,track_id) {
            let mut out = Vec::new();
            out.push(payload_self);
            for other_id in &other_ids {
                if let Some((payload_other,_)) = self.activate_self(other_id,track_id) {
                    out.push(payload_other);
                }
            }
            Some(JSONValue::Array(out))
        } else {
            None
        }
    }

    pub(in super) fn intersects(&self, stage: &Stage, pos: Dot<i32,i32>) -> Vec<(String,String,JSONValue)> {
        let mut out = Vec::new();
        for item in &self.items {
            bb_log!("zmenu","zml: item pos={:?} placement={:?}",pos,&item.placement);
            if stage.intersects(pos,&item.placement) {
                console!("intersects {:?}",item.id);
                if let Some(payload) = self.activate(&item.id,&item.track_id) {
                    out.push((item.id.clone(),item.track_id.clone(),payload));
                }
            }
        }
        out
    }
}

pub struct ZMenuLeafSet {
    zml: Vec<ZMenuLeaf>
}

impl ZMenuLeafSet {
    pub fn new() -> ZMenuLeafSet {
        ZMenuLeafSet { zml: Vec::new() }
    }
     
    pub fn register_leaf(&mut self, zml: ZMenuLeaf) {
        self.zml.push(zml);
    }

    pub(in super) fn take_leafs(&mut self) -> Vec<ZMenuLeaf> {
        self.zml.drain(..).collect()
    }
}
