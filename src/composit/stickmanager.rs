use composit::Stick;

pub trait StickManager {
    fn get_stick(&mut self, name: &str) -> Stick;
}
