use model::item::UnpackedSubassembly;

pub trait DriverTraveller {
    fn set_state(&self, state: bool);
    fn refresh(&mut self);
    fn destroy(&mut self);
    fn set_contents(&mut self, result: &UnpackedSubassembly);
}
