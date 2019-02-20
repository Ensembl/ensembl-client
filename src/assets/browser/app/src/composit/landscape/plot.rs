#[derive(Clone)]
pub struct Plot {
    y_base: i32,
    y_height: i32
}

impl Plot {
    pub fn new(y_base: i32, y_height: i32) -> Plot {
        Plot { y_base, y_height }
    }
    
    pub fn get_base(&self) -> i32 { self.y_base }
    pub fn get_height(&self) -> i32 { self.y_height }
}
