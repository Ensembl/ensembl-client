use composit::ActiveSource;

pub trait SourceManager {
    fn get_component(&mut self, name: &str) -> Option<ActiveSource>;
}
