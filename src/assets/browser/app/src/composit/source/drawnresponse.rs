use composit::SourceResponseBuilder;
use composit::Source;
use drawing::Drawing;
use drawing::DrawingSession;
use drivers::webgl::PrintEdition;
use drivers::webgl::Programs;
use shape::{ ShapeSpec, Shape };

pub struct DrawnResponse {
    drawings: Vec<Option<Drawing>>,
    sr: SourceResponseBuilder,
}

impl DrawnResponse {
    pub fn new(sr: SourceResponseBuilder) -> DrawnResponse {
        DrawnResponse { 
            sr, 
            drawings: Vec::<Option<Drawing>>::new(),
        }
    }
    
    #[allow(unused)]
    pub fn size(&self) -> usize { self.sr.get_shapes().len() }
    
    pub fn redraw(&mut self, ds: &mut DrawingSession) {
        self.drawings.clear();
        for mut s in self.sr.get_shapes() {
            if let Some(a) = s.get_artist() {
                let ocm = a.select_canvas(ds);
                self.drawings.push(Some(ocm.add_request(a)));
            } else {
                self.drawings.push(None);
            }
        }
    }

    pub fn into_objects(&mut self, progs: &mut Programs,
                  ds: &mut DrawingSession, e: &mut PrintEdition) {
        let mut di = self.drawings.iter();
        for mut s in self.sr.get_shapes().iter() {
            let d = di.next();
            let geom_name = s.get_geometry();
            if let Some(geom) = progs.map.get_mut(&geom_name) {
                let artwork = d.unwrap().as_ref().map(|r| r.artwork(ds));
                s.into_objects(&mut geom.data,artwork,e);
            }
        }
    }
}
