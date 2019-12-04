use std::fmt::Debug;

pub trait Integration: Send+Sync+Debug {
    fn get_time(&self) -> f64;
    fn get_instance_id(&self) -> String;
    fn get_time_units(&self) -> String;
}
