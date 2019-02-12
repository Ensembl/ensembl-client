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
    use test::{ command_compile, DebugEnvironment };
        
    #[test]
    fn cpu_kill() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("cycle-count");
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.cpu_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Killed("Exceeded CPU limit 100".to_string()),t.status(pid).state);
    }
    
    #[test]
    fn mem_kill() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("cycle-count");
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.reg_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: register limit 100".to_string()),t.status(pid).state);
    }
    
    #[test]
    fn stack_entry_kill() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("limit-stack-entry");
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.stack_entry_limit = Some(3);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: stack entry limit 3".to_string()),t.status(pid).state);
    }
    
    #[test]    
    fn stack_data_kill() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("limit-stack-data");
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.stack_data_limit = Some(3);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Killed("Exceeded memory limit: stack data limit 3".to_string()),t.status(pid).state);
    }
    
    #[test]
    fn time_limit() {
        let mut t_env = DebugEnvironment::new();
        let now = t_env.get_time();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let bin = command_compile("time-limit");
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.time_limit = Some(100);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.run(now+1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(now+1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(now+1000) {}
        thread::sleep(time::Duration::from_millis(200));
        while t.run(now+1000) {}
        assert_eq!(ProcessState::Killed("Exceeded time limit 100".to_string()),t.status(pid).state);
    }
}
