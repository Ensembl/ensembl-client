use hashbrown::HashSet;

use serde_json::Value as SerdeValue;
use crate::{ Format, Model };

pub struct Config {
    enabled: HashSet<String>,
    include_raw: HashSet<(String,String)>
}

impl Config {
    pub fn new() -> Config {
        Config {
            enabled: HashSet::new(),
            include_raw: HashSet::new()
        }
    }

    fn load(&mut self, json: &SerdeValue) -> Result<(),()> {
        let config = json.as_object().ok_or(())?.get("config").ok_or(())?;
        if let Some(enabled) = config.as_object().ok_or(())?.get("enable") {
            for stream in enabled.as_array().ok_or(())?.iter() {
                let stream = stream.as_str().ok_or(())?;
                self.enabled.insert(stream.to_string());
            }
        }
        if let Some(raw) = config.as_object().ok_or(())?.get("raw") {
            for (stream,names) in raw.as_object().ok_or(())?.iter() {
                for name in names.as_array().ok_or(())?.iter() {
                    let name = name.as_str().ok_or(())?;
                    self.include_raw.insert((stream.to_string(),name.to_string()));
                }
            }
        }
        Ok(())
    }

    pub fn new_from_json(json: &SerdeValue) -> Option<Config> {
        let mut out = Config::new();
        match out.load(json) {
            Ok(()) => Some(out),
            Err(()) => None
        }
    }

    pub fn update_model(&self, model: &mut Model) {
        model.disable_all();
        for enable in &self.enabled {
            model.enable(enable);
        }
    }

    pub fn update_format(&self, format: &mut Format) {
        format.reset_raw_data();
        for (stream,name) in &self.include_raw {
            format.include_raw_data(stream,name,true);
        }
    }
}
