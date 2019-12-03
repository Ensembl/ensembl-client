pub trait Integration: Send+Sync {
    fn current_time(&self) -> f64;
    fn instance_id(&self) -> String;
}