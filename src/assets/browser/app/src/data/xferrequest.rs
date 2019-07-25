use composit::Leaf;

use super::BackendConfig;

// XXX no clone!
#[derive(Clone,Debug)]
pub struct XferRequest {
    source_name: String,
    leaf: Leaf,
    focus: Option<String>,
    prime: bool
}

impl XferRequest {
    pub fn new(source_name: &str, leaf: &Leaf, focus: &Option<String>, prime: bool) -> XferRequest {
        XferRequest {
            source_name: source_name.to_string(),
            leaf: leaf.clone(),
            prime,
            focus: focus.clone()
        }
    }
    
    pub fn get_prime(&self) -> bool { self.prime }

    pub fn make_key(&self, bc: &BackendConfig) -> Option<XferRequestKey> {
        let wire = bc.get_track(&self.source_name)
                        .and_then(|x| x.get_wire().as_ref())
                        .map(|x| x.to_string());
        wire.map(|wire| {
            let (short_stick,short_pane) = self.leaf.get_short_spec();
            XferRequestKey::new(&wire,&short_stick,&short_pane,&self.focus)
        })
    }
}


#[derive(Clone,PartialEq,Eq,Hash,Debug)]
pub struct XferRequestKey {
    pub track: String,
    pub stick: String,
    pub leaf: String,
    pub focus: Option<String> 
}

impl XferRequestKey {
    pub fn new(track: &str, stick: &str, leaf: &str, focus: &Option<String>) -> XferRequestKey {
        XferRequestKey { track: track.to_string(), stick: stick.to_string(), leaf: leaf.to_string(), focus: focus.clone() }
    }
}
