use composit::SourceResponse;
use composit::Source;
use drawing::Drawing;
use drawing::DrawingSession;
use print::PrintEdition;
use print::Programs;
use shape::{ ShapeSpec, Shape };

pub struct DrawnResponse {
    drawings: Vec<Option<Drawing>>,
    sr: SourceResponse,
    part: Option<String>
}

impl DrawnResponse {
    pub fn new(sr: SourceResponse, part: &Option<String>) -> DrawnResponse {
        DrawnResponse { 
            sr, 
            drawings: Vec::<Option<Drawing>>::new(),
            part: part.clone()
        }
    }

    fn shapes(&self) -> Vec<ShapeSpec> {
        self.sr.get_shapes(&self.part)
    }
    
    #[allow(unused)]
    pub fn size(&self) -> usize { self.shapes().len() }
    
    pub fn is_done(&self) -> bool { self.sr.is_done() }
    
    pub fn redraw(&mut self, ds: &mut DrawingSession) {
        if self.sr.is_done() {
            self.drawings.clear();
            for mut s in self.shapes() {
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
            let mut di = self.drawings.iter();
            for mut s in self.shapes().iter() {
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
