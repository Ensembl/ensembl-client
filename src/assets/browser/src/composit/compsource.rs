use composit::Component;

pub trait ComponentSource {
    fn get_component(&mut self, name: &str) -> Option<Component>;
}
