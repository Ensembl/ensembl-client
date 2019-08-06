use data::BackendConfig;
use super::PurchaseOrder;

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct CatalogueCode {
    pub wire: String,
    pub short_stick: String,
    pub short_pane: String,
    pub focus: Option<String>
}

impl CatalogueCode {
    pub fn try_new(bc: &BackendConfig, po: &PurchaseOrder) -> Option<CatalogueCode> {
        bc.get_track(&po.get_source_name())
            .and_then(|x| x.get_wire().as_ref())
            .map(|wire| {
                let (short_stick,short_pane) = po.get_leaf().get_short_spec();
                CatalogueCode { 
                    wire: wire.to_string(), 
                    short_pane, short_stick,
                    focus: po.get_focus().clone()
                }
            })
    }

    pub fn new_in(wire: &str, stick: &str, pane: &str, focus: &Option<String>) -> CatalogueCode {
        CatalogueCode {
            wire: wire.to_string(), 
            short_stick: stick.to_string(), 
            short_pane: pane.to_string(),
            focus: focus.clone()
        }
    }
}
