pub trait Integration: Send+Sync {
    fn get_time(&self) -> f64;
    fn get_instance_id(&self) -> String;
    fn get_time_units(&self) -> String;
}
