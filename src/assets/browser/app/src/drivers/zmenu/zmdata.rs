use std::collections::HashMap;

pub struct ZMenuData {
    tmpl: HashMap<String,String>
}
    
impl ZMenuData {
    pub fn new() -> ZMenuData {
        ZMenuData {
            tmpl: HashMap::new()
        }
    }
    
    pub fn set_templates(&mut self, id_tmpl: HashMap<String,String>) {
        bb_log!("zmenu","set_templates: {:?}",id_tmpl);
        self.tmpl.clear();
        self.tmpl.extend(id_tmpl.iter().map(|(x,y)| (x.clone(),y.clone())));
    }    
}
