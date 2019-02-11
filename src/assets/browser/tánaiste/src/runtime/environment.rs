use std::time::Instant;

pub trait Environment {
    fn get_time(&mut self) -> i64;
}

pub struct DefaultEnvironment {
    start: Instant
}

impl DefaultEnvironment {
    pub fn new() -> Box<Environment> {
        Box::new(DefaultEnvironment {
            start: Instant::now()
        })
    }
}

impl Environment for DefaultEnvironment {
    fn get_time(&mut self) -> i64 {
        let d = Instant::now().duration_since(self.start);
        d.as_secs() as i64 * 1000 + d.subsec_millis() as i64
    }
}
