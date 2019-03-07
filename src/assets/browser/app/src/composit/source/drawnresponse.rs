use composit::SourceResponse;
use composit::Source;
use shape::DrawnShape;

pub struct DrawnResponse {
    shapes: Option<Vec<DrawnShape>>,
    sr: SourceResponse,
    part: Option<String>
}

impl DrawnResponse {
    pub fn new(sr: SourceResponse, part: &Option<String>) -> DrawnResponse {
        DrawnResponse { sr, shapes: None, part: part.clone() }
    }

    fn populate(&mut self) {
        let mut shapes = Vec::<DrawnShape>::new();
        let specs = self.sr.get_shapes(&self.part);
        for spec in specs {
            shapes.push(DrawnShape::new(spec.create()));
        }
        self.shapes = Some(shapes);
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
