pub struct ProcState {
    halted: bool,
    sleeping: bool
}

impl ProcState {
    pub fn new() -> ProcState {
        ProcState {
            halted: false,
            sleeping: false
        }
    }

    pub fn halt(&mut self) { self.halted = true; }
    pub fn sleep(&mut self) { self.sleeping = true; }
    pub fn wake(&mut self) { self.sleeping = false; }
    pub fn is_sleeping(&self) -> bool { self.sleeping }
    pub fn is_halted(&self) -> bool { self.halted }
}
