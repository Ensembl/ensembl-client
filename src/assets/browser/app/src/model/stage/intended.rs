use types::{ LEFT, RIGHT, Dot };
use composit::Stick;
use controller::output::Report;

use super::Position;

pub struct Intended {
    stick: Option<Stick>,
    pos: Position
}

impl Intended {
    pub fn new() -> Intended {
        Intended {
            stick: None,
            pos: Position::new(),
        }
    }

    pub fn intend_here(&mut self, stick: &Stick, pos: &Position) {
        self.stick = Some(stick.clone());
        self.pos = pos.clone();
    }

    pub fn get_stick(&self) -> &Option<Stick> { &self.stick }
    pub fn get_position(&self) -> &Position { &self.pos }

    pub fn update_intent_report(&self, report: &Report) {
        let (ileft,iright) = (self.pos.get_edge(&LEFT,false),self.pos.get_edge(&RIGHT,false));
        report.set_status("i-start",&ileft.floor().to_string());
        report.set_status("i-end",&iright.ceil().to_string());
    }
}
