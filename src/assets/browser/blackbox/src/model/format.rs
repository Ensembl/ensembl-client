use hashbrown::HashSet;
use crate::Integration;

pub struct Format {
    include_raw: HashSet<(String,String)>
}

impl Format {
    pub fn new() -> Format {
        Format {
            include_raw: HashSet::new(),
        }
    }

    pub fn include_raw_data(&mut self, stream: &str, name: &str, b: bool) {
        if b {
            self.include_raw.insert((stream.to_string(),name.to_string()));
        } else {
            self.include_raw.remove(&(stream.to_string(),name.to_string()));
        }
    }

    pub fn reset_raw_data(&mut self) {
        self.include_raw.clear();
    }

    pub(crate) fn test_include_raw(&self, stream: &str, name: &str) -> bool {
        self.include_raw.contains(&(stream.to_string(),name.to_string()))
    }
}
