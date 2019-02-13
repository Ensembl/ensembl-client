use std::cell::RefCell;
use std::rc::Rc;
use std::time::Instant;

use runtime::Environment;

pub struct DebugEnvironmentExtern {
    start: Instant,
    last_exit_str: Vec<String>,
    last_exit_float: Vec<Vec<f64>>
}

impl DebugEnvironmentExtern {
    pub fn new() -> DebugEnvironmentExtern {
        DebugEnvironmentExtern {
            start: Instant::now(),
            last_exit_str: Vec::<String>::new(),
            last_exit_float: Vec::<Vec<f64>>::new()
        }
    }
        
    pub fn get_exit_str(&self) -> &Vec<String> { &self.last_exit_str }
    pub fn get_exit_float(&self) -> &Vec<Vec<f64>> { &self.last_exit_float }
}

impl Environment for DebugEnvironmentExtern {
    fn get_time(&mut self) -> i64 {
        let d = Instant::now().duration_since(self.start);
        d.as_secs() as i64 * 1000 + d.subsec_millis() as i64
    }
    
    fn finished(&mut self, _pid: usize, codes: Vec<f64>, string: String) {
        self.last_exit_str.push(string);
        self.last_exit_float.push(codes);
    }
}

pub struct DebugEnvironmentBox(Rc<RefCell<DebugEnvironmentExtern>>);

impl Environment for DebugEnvironmentBox {
    fn get_time(&mut self) -> i64 {
        self.0.borrow_mut().get_time()
    }
    
    fn finished(&mut self, pid: usize, codes: Vec<f64>, string: String) {
        self.0.borrow_mut().finished(pid, codes, string);
    }
}

pub struct DebugEnvironment(Rc<RefCell<DebugEnvironmentExtern>>);

impl DebugEnvironment {
    pub fn new() -> DebugEnvironment {
        DebugEnvironment(Rc::new(RefCell::new(DebugEnvironmentExtern::new())))
    }

    pub fn make(&self) -> Box<Environment> {
        Box::new(DebugEnvironmentBox(self.0.clone()))
    }

    pub fn get_time(&mut self) -> i64 { self.0.borrow_mut().get_time() }
    pub fn get_exit_str(&self) -> Vec<String> {
        self.0.borrow_mut().get_exit_str().clone()
    }
    pub fn get_exit_float(&self) -> Vec<Vec<f64>> {
        self.0.borrow_mut().get_exit_float().clone()
    }
}
