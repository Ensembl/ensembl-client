use types::{ LEFT, RIGHT, Dot };
use controller::output::Report;

use super::Position;

pub struct Intended {
    pos: Position
}

impl Intended {
    pub fn new() -> Intended {
        Intended {
            pos: Position::new(),
        }
    }

    pub fn intend_here(&mut self, pos: &Position) {
        self.pos = pos.clone();
    }

    pub fn update_intent_report(&self, report: &Report) {
        let (ileft,iright) = (self.pos.get_edge(&LEFT,false),self.pos.get_edge(&RIGHT,false));
        report.set_status("i-start",&ileft.floor().to_string());
        report.set_status("i-end",&iright.ceil().to_string());
    }
}
