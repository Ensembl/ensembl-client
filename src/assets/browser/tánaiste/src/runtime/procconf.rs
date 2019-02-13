#[derive(Clone)]
pub struct ProcessConfig {
    /* instantaneous: enforced by process */
    pub reg_limit: Option<usize>,
    pub stack_entry_limit: Option<usize>,
    pub stack_data_limit: Option<usize>,
    /* cumulative: enforced by interpereter */
    pub cpu_limit: Option<i64>,
    pub time_limit: Option<i64>
}

pub const PROCESS_CONFIG_DEFAULT : ProcessConfig = ProcessConfig {
    cpu_limit: None,
    reg_limit: None,
    stack_entry_limit: None,
    stack_data_limit: None,
    time_limit: None
};

#[cfg(test)]
mod test {
    use std::{ thread, time };
    use super::super::interp::{ Interp, ProcessState, DEFAULT_CONFIG };
    use super::PROCESS_CONFIG_DEFAULT;
    use test::{ command_compile, DebugEnvironment, TestContext };
        
    #[test]
    fn cpu_kill() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        let bin = command_compile("cycle-count",&tc);
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.cpu_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        t.start(pid);
        while t.run(1000) {}
        assert_eq!(t_env.get_exit_state().unwrap(),ProcessState::Killed("Exceeded CPU limit 100".to_string()));
    }
    
    #[test]
    fn mem_kill() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        let bin = command_compile("cycle-count",&tc);
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.reg_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        t.start(pid);
        while t.run(1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: register limit 100".to_string()),t_env.get_exit_state().unwrap());
    }
    
    #[test]
    fn stack_entry_kill() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        let bin = command_compile("limit-stack-entry",&tc);
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.stack_entry_limit = Some(3);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        t.start(pid);
        while t.run(1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: stack entry limit 3".to_string()),t_env.get_exit_state().unwrap());
    }
    
    #[test]    
    fn stack_data_kill() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        let bin = command_compile("limit-stack-data",&tc);
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.stack_data_limit = Some(3);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        t.start(pid);
        while t.run(1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: stack data limit 3".to_string()),t_env.get_exit_state().unwrap());
    }
    
    #[test]
    fn time_limit() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        let bin = command_compile("time-limit",&tc);
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.time_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        t.start(pid);
        while t.run(1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(1000) {}
        assert_eq!(ProcessState::Killed("Exceeded time limit 100".to_string()),t_env.get_exit_state().unwrap());
    }
}
