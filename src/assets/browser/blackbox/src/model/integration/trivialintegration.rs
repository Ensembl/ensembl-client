use crate::Integration;

pub struct TrivialIntegration {}

impl TrivialIntegration {
    pub fn new() -> TrivialIntegration { TrivialIntegration{} }
}

impl Integration for TrivialIntegration {
    fn get_time(&self) -> f64 { 0. }
    fn get_instance_id(&self) -> String { "anon.".to_string() }
    fn get_time_units(&self) -> String { "eternal".to_string() }
}
