pub struct EggDetector {
    egg_str: String,
    offset: usize,
    active: bool
}

impl EggDetector {
    pub fn new(egg_str: &str) -> EggDetector {
        EggDetector {
            egg_str: egg_str.to_string(),
            offset: 0,
            active: false
        }
    }
    
    pub fn new_char(&mut self, c: &str) {
        if self.active { return; }
        if self.egg_str[self.offset..].starts_with(c) {
            debug!("eggs","egg good char '{}'",c);
            self.offset += c.len();
            if self.offset >= self.egg_str.len() {
                self.offset = 0;
                self.active = true;
                debug!("eggs","egg '{}' activated",self.egg_str);
            }
        } else {
            debug!("eggs","egg bad char '{}'",c);
            self.offset = 0;
        }
    }
    
    pub fn is_active(&self) -> bool { self.active }
    pub fn reset(&mut self) { self.active = false; }
}
