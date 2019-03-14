use composit::SourceResponse;
use composit::Source;
use drawing::Drawing;
use drawing::DrawingSession;
use print::PrintEdition;
use print::Programs;
use shape::{ ShapeSpec, Shape };

pub struct DrawnResponse {
    shapes: Option<Vec<ShapeSpec>>,
    drawings: Vec<Option<Drawing>>,
    sr: SourceResponse,
    part: Option<String>
}

impl DrawnResponse {
    pub fn new(sr: SourceResponse, part: &Option<String>) -> DrawnResponse {
        DrawnResponse { 
            sr, 
            shapes: None, 
            drawings: Vec::<Option<Drawing>>::new(),
            part: part.clone()
        }
    }

    fn populate(&mut self) {
        let specs = self.sr.get_shapes(&self.part);
        self.shapes = Some(specs);
    }
    
    #[allow(unused)]
    pub fn size(&self) -> usize { self.shapes.as_ref().unwrap().len() }
    
    pub fn is_done(&self) -> bool { self.sr.is_done() }
    
    pub fn redraw(&mut self, ds: &mut DrawingSession) {
        if self.sr.is_done() {
            if self.shapes.is_none() {
                self.populate();
            }
            self.drawings.clear();
            for mut s in self.shapes.as_mut().unwrap().iter_mut() {
                if let Some(a) = s.get_artist() {
                    let ocm = a.select_canvas(ds);
                    self.drawings.push(Some(ocm.add_request(a)));
                } else {
                    self.drawings.push(None);
                }
            }
        }
    }

    pub fn into_objects(&mut self, progs: &mut Programs,
                  ds: &mut DrawingSession, e: &mut PrintEdition) {
        if self.sr.is_done() {
            if self.shapes.is_none() {
                self.populate();
            }
            let mut di = self.drawings.iter();
            for mut s in self.shapes.as_mut().unwrap().iter_mut() {
                let d = di.next();
                let geom_name = s.get_geometry();
                if let Some(geom) = progs.map.get_mut(&geom_name) {
                    let artwork = d.unwrap().as_ref().map(|r| r.artwork(ds));
                    s.into_objects(&mut geom.data,artwork,e);
                }
            }
        }
    }
}
