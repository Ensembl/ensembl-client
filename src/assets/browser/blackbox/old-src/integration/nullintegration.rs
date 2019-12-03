use crate::Integration;

pub struct NullIntegration {}

impl NullIntegration {
    pub fn new() -> NullIntegration {
        NullIntegration {}
    }
}

impl Integration for NullIntegration {
    fn current_time(&self) -> f64 { 0. }
    fn instance_id(&self) -> String { "anon.".to_string() }
}
