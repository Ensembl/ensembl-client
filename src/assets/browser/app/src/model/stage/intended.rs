use types::{ LEFT, RIGHT };
use composit::Stick;
use controller::output::Report;
use model::stage::Viewpoint;

use super::Position;

pub struct Intended {
    viewpoint: Option<Viewpoint>
}

impl Intended {
    pub fn new() -> Intended {
        Intended {
            viewpoint: None
        }
    }

    pub fn intend_here(&mut self, viewpoint: &Viewpoint) {
        self.viewpoint = Some(viewpoint.clone());
    }

    pub fn update_intent_report(&self, report: &Report) {
        if let Some(ref viewpoint) = self.viewpoint {
            let middle = viewpoint.get_position().get_x_pos();
            let zoom = viewpoint.get_position().get_screen_in_bp();
            let (ileft,iright) = ((middle-zoom/2.).floor(),(middle+zoom/2.).ceil());
            report.set_status("i-stick",&viewpoint.get_position().get_stick().get_name());
            report.set_status("i-start",&ileft.floor().to_string());
            report.set_status("i-end",&iright.ceil().to_string());
        }
    }
}
