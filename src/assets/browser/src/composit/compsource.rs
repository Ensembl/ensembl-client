use composit::ActiveSource;

pub trait ComponentSource {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource>;
}
