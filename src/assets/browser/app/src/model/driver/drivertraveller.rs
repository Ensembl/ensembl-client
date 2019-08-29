use model::item::UnpackedSubassembly;

pub trait DriverTraveller {
    fn set_state(&self, state: bool);
    fn destroy(&mut self);
    fn set_contents(&mut self, result: &UnpackedSubassembly);
}
