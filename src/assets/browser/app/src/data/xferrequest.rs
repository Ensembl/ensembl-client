use composit::Leaf;
use composit::source::PurchaseOrder;

use super::BackendConfig;

// XXX no clone!
#[derive(Clone,Debug)]
pub struct XferRequest {
    po: PurchaseOrder,
    prime: bool
}

impl XferRequest {
    pub fn new(po: &PurchaseOrder, prime: bool) -> XferRequest {
        XferRequest {
            po: po.clone(),
            prime
        }
    }
    
    pub fn get_prime(&self) -> bool { self.prime }

    pub fn make_key(&self, bc: &BackendConfig) -> Option<XferRequestKey> {
        let wire = bc.get_track(&self.po.get_source_name())
                        .and_then(|x| x.get_wire().as_ref())
                        .map(|x| x.to_string());
        wire.map(|wire| {
            let (short_stick,short_pane) = self.po.get_leaf().get_short_spec();
            XferRequestKey::new(&wire,&self.po)
        })
    }
}

#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct XferRequestKey {
    pub track: String,
    pub short_stick: String,
    pub short_pane: String,
    pub focus: Option<String>
}

impl XferRequestKey {
    pub fn new(track: &str, po: &PurchaseOrder) -> XferRequestKey {
        let (short_stick,short_pane) = po.get_leaf().get_short_spec();
        XferRequestKey { 
            track: track.to_string(), 
            short_pane, short_stick,
            focus: po.get_focus().clone()
        }
    }

    pub fn new_in(track: &str, stick: &str, pane: &str, focus: &Option<String>) -> XferRequestKey {
        XferRequestKey {
            track: track.to_string(), 
            short_stick: stick.to_string(), 
            short_pane: pane.to_string(),
            focus: focus.clone()
        }
    }
}
