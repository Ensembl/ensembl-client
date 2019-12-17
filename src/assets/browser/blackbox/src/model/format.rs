use hashbrown::HashSet;

pub struct Format {
    configured: bool,
    include_raw: HashSet<(String,String)>
}

impl Format {
    pub fn new() -> Format {
        Format {
            configured: false,
            include_raw: HashSet::new()
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
        self.configured = true;
        self.include_raw.clear();
    }

    pub fn test_include_raw(&self, stream: &str, name: &str) -> bool {
        !self.configured || self.include_raw.contains(&(stream.to_string(),name.to_string()))
    }
}
