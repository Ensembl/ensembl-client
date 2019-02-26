use std::collections::HashMap;

use serde_json::Value as SerdeValue;

use composit::{ Leaf, Scale };

#[derive(Debug)]
pub struct BackendEndpoint {
    url: Option<String>,
    code: String
}

impl BackendEndpoint {
    pub fn get_url(&self) -> Option<&str> { self.url.as_ref().map(|x| &x[..]) }
    pub fn get_code(&self) -> &str { &self.code }
}

#[derive(Debug)]
pub struct BackendTrack {
    endpoints: Vec<(i32,i32,String)>
}

#[derive(Debug)]
pub struct BackendConfig {
    endpoints: HashMap<String,BackendEndpoint>,
    tracks: HashMap<String,BackendTrack>,
}

// TODO simplify with serde; error handling
impl BackendConfig {
    pub fn endpoint_for(&self, compo: &str, leaf: &Leaf) -> Result<&BackendEndpoint,String> {
        let scale = leaf.get_scale().get_index();
        let track = self.tracks.get(compo);
        if track.is_none() {
            return Err(format!("No such track {}",compo));
        }
        for (min,max,ep_name) in track.unwrap().endpoints.iter() {
            if scale >= *min && scale <= *max {
                if let Some(ref ep) = self.endpoints.get(ep_name) {
                    return Ok(ep);
                } else {
                    return Err(format!("No such endpoint {}",ep_name));
                }
            }
        }
        return Err(format!("No endpoint for scale {} for {}",scale,compo));
    }

    fn endpoints_from_json(ep: &SerdeValue) -> HashMap<String,BackendEndpoint> {
        let mut out = HashMap::<String,BackendEndpoint>::new();
        for (k,v) in ep.as_object().unwrap().iter() {
            
            let ep = BackendEndpoint {
                url: v.get("endpoint").map(|x| x.as_str().unwrap().to_string()),
                code: v["bytecode"].as_str().unwrap().to_string()
            };
            out.insert(k.to_string(),ep);
        }
        out
    }
        
    fn tracks_from_json(ep: &SerdeValue) -> HashMap<String,BackendTrack> {
        let mut out = HashMap::<String,BackendTrack>::new();
        for (track_name,v) in ep.as_object().unwrap().iter() {
            let mut endpoints = Vec::<(i32,i32,String)>::new();
            for (scales,track) in v.as_object().unwrap().iter() {
                let scales :Vec<char> = scales.chars().collect();
                let min = Scale::new_from_letter(scales[0]).get_index();
                let max = Scale::new_from_letter(scales[1]).get_index();
                endpoints.push((min,max,track["endpoint"].as_str().unwrap().to_string()));
            }
            out.insert(track_name.to_string(),BackendTrack { endpoints });
        }
        out
    }

    // TODO errors
    pub fn from_json_string(in_: &str) -> Result<BackendConfig,String> {
        let data : SerdeValue = serde_json::from_str(in_).ok().unwrap();
        let endpoints = BackendConfig::endpoints_from_json(&data["endpoints"]);
        let tracks = BackendConfig::tracks_from_json(&data["tracks"]);
        let endpoints = BackendConfig::endpoints_from_json(&data["endpoints"]);
        let tracks = BackendConfig::tracks_from_json(&data["tracks"]);
        Ok(BackendConfig { endpoints, tracks })
    }
}
