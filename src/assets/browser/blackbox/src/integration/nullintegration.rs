use crate::Integration;

#[derive(Debug)]
pub struct NullIntegration {}

impl NullIntegration {
    pub fn new() -> NullIntegration { NullIntegration{} }
}

impl Integration for NullIntegration {
    fn get_time(&self) -> f64 { 0. }
    fn get_instance_id(&self) -> String { "anon.".to_string() }
    fn get_time_units(&self) -> String { "ms".to_string() }
}
