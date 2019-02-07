use composit::SourceResponse;
use shape::DrawnShape;

pub struct DrawnResponse {
    shapes: Option<Vec<DrawnShape>>,
    sr: SourceResponse
}

impl DrawnResponse {
    pub fn new(sr: SourceResponse) -> DrawnResponse {
        DrawnResponse { sr, shapes: None }
    }

    fn populate(&mut self) {
        self.shapes = Some(self.sr.get_shapes().iter().map(|spec|
            DrawnShape::new(spec.create())
        ).collect());
    }
    
    #[allow(unused)]
    pub fn size(&self) -> usize { self.shapes.as_ref().unwrap().len() }
    
    pub fn get_response(&self) -> &SourceResponse { &self.sr }
    
    pub fn each_shape<F>(&mut self, mut cb: F) where F: FnMut(&mut DrawnShape) {
        if self.sr.is_done() {
            if self.shapes.is_none() {
                self.populate();
            }
            for mut s in self.shapes.as_mut().unwrap().iter_mut() {
                cb(s);
            }
        }
    }
}
