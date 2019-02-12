pub trait Environment {
    fn get_time(&mut self) -> i64;
    fn finished(&mut self, pid: usize, codes: Vec<f64>, string: String);
}
