pub trait Walker {
    fn after(&mut self, start: usize) -> Option<usize>;
}

pub struct NullWalker();

impl NullWalker {
    pub fn new() -> NullWalker { NullWalker() }
}

impl Walker for NullWalker {
    fn after(&mut self, _start: usize) -> Option<usize> {
        return None;
    }
}