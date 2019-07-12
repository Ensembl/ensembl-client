pub struct Counter {
    message_counter: f64,
    locks: u32,
    delayed: bool
}

impl Counter {
    pub(in super) fn new() -> Counter {
        Counter {
            message_counter: 0.,
            locks: 0,
            delayed: false
        }
    }

    pub fn lock(&mut self) {
        self.locks += 1;
    }

    pub fn unlock(&mut self) {
        self.locks -= 1;
    }

    pub(in super) fn is_current(&mut self, value: f64) -> bool {
        self.message_counter <= value || value == -1.
    }

    pub(in super) fn is_delayed(&self) -> bool { self.delayed }

    pub(in super) fn try_update_counter(&mut self) -> Option<f64> {
        if self.locks == 0 {
            self.message_counter += 1.;
            self.delayed = false;
            Some(self.message_counter)
        } else {
            self.delayed = true;
            None
        }
    }

    pub(in super) fn force_update(&self) -> bool {
        self.locks == 0 && self.delayed
    }
}
