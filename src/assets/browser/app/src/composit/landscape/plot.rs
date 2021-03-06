#[derive(Clone)]
pub struct Plot {
    y_base: i32,
    y_height: i32,
    letter: String,
    cog: bool
}

impl Plot {
    pub fn new(y_base: i32, y_height: i32, letter: String, cog: bool) -> Plot {
        Plot { y_base, y_height, letter, cog }
    }
    
    pub fn get_base(&self) -> i32 { self.y_base }
    pub fn get_height(&self) -> i32 { self.y_height }
    pub fn get_letter(&self) -> &str { &self.letter }
    pub fn has_cog(&self) -> bool { self.cog }
    
    pub fn get_low_watermark(&self) -> i32 {
        self.y_base + self.y_height
    }
}
