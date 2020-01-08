pub trait CommanderIntegration2 : Send {
    fn current_time(&mut self) -> f64;
    //fn enable_ticks(&mut self, cmdr: &mut Commander);
    //fn disable_ticks(&mut self, cmdr: &mut Commander, timeout: Option<f64>);
}
