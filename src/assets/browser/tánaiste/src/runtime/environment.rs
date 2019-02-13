use super::interp::ProcessState;

pub trait Environment {
    fn get_time(&mut self) -> i64;
    fn finished(&mut self, pid: usize, state: ProcessState, codes: Vec<f64>, string: String);
}
