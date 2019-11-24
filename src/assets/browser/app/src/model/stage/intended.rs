use types::{ LEFT, RIGHT };
use composit::Stick;
use controller::output::Report;

use super::{ Position, Screen };

pub struct Intended {
    stick: Option<Stick>,
    pos: Option<Position>
}

impl Intended {
    pub fn new() -> Intended {
        Intended {
            stick: None,
            pos: None
        }
    }

    pub fn intend_here(&mut self, stick: &Stick, pos: &Position) {
        self.stick = Some(stick.clone());
        self.pos = Some(pos.clone());
    }

    pub fn update_intent_report(&self, report: &Report, screen: &Screen) {
        if let Some(ref pos) = self.pos {
            let (ileft,iright) = (pos.get_edge(screen,&LEFT),pos.get_edge(screen,&RIGHT));
            report.set_status("i-start",&ileft.floor().to_string());
            report.set_status("i-end",&iright.ceil().to_string());
        }
    }
}
