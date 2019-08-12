pub trait Walker {
    fn after(&mut self, start: usize) -> Option<usize>;
}