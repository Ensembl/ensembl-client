use std::sync::{ Arc, Mutex };

use crate::Integration;

struct SimpleIntegrationImpl {
    id: String,
    time: f64
}

impl SimpleIntegrationImpl {
    pub fn new(id: &str) -> SimpleIntegrationImpl {
        SimpleIntegrationImpl {
            id: id.to_string(),
            time: 0.
        }
    }

    pub fn tick(&mut self) {
        self.time += 1.;
    }
}

impl Integration for SimpleIntegrationImpl {
    fn get_time(&self) -> f64 { self.time }
    fn get_instance_id(&self) -> String { self.id.to_string() }
    fn get_time_units(&self) -> String { "units".to_string() }
}

#[derive(Clone)]
pub struct SimpleIntegration(Arc<Mutex<SimpleIntegrationImpl>>);

impl SimpleIntegration {
    pub fn new(id: &str) -> SimpleIntegration {
        SimpleIntegration(Arc::new(Mutex::new(SimpleIntegrationImpl::new(id))))
    }

    pub fn tick(&mut self) { self.0.lock().unwrap().tick(); }
}

impl Integration for SimpleIntegration {
    fn get_time(&self) -> f64 { self.0.lock().unwrap().get_time() }
    fn get_instance_id(&self) -> String { self.0.lock().unwrap().get_instance_id() }
    fn get_time_units(&self) -> String { self.0.lock().unwrap().get_time_units() }
}
