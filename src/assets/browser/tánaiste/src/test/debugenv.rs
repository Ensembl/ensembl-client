use std::cell::{ RefCell, RefMut };
use std::rc::Rc;
use std::time::Instant;

use runtime::Environment;

pub struct DebugEnvironmentExtern {
    start: Instant,
    last_exit_str: Option<String>,
    last_exit_float: Option<Vec<f64>>
}

impl DebugEnvironmentExtern {
    pub fn new() -> DebugEnvironmentExtern {
        DebugEnvironmentExtern {
            start: Instant::now(),
            last_exit_str: None,
            last_exit_float: None
        }
    }
        
    pub fn get_exit_str(&self) -> Option<&String> { self.last_exit_str.as_ref() }
    pub fn get_exit_float(&self) -> Option<&Vec<f64>> { self.last_exit_float.as_ref() }
}

impl Environment for DebugEnvironmentExtern {
    fn get_time(&mut self) -> i64 {
        let d = Instant::now().duration_since(self.start);
        d.as_secs() as i64 * 1000 + d.subsec_millis() as i64
    }
    
    fn finished(&mut self, pid: usize, codes: Vec<f64>, string: String) {
        println!("exit pid={} codes={:?}, string={}",pid,codes,string);
        self.last_exit_str = Some(string);
        self.last_exit_float = Some(codes);
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
    pub fn get_exit_str(&self) -> Option<String> {
        self.0.borrow_mut().get_exit_str().map(|s| s.clone())
    }
    pub fn get_exit_float(&self) -> Option<Vec<f64>> {
        self.0.borrow_mut().get_exit_float().map(|s| s.clone())
    }
}
