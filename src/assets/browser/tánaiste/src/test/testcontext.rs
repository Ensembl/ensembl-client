use std::cell::RefCell;
use std::rc::Rc;

pub struct TestContextImpl {
    b : bool
}

impl TestContextImpl {
    pub fn new() -> TestContextImpl {
        TestContextImpl { b: false }
    }
    
    pub fn set(&mut self) {
        self.b = true;
    }

    pub fn get(&mut self) -> bool { self.b }
}

#[derive(Clone)]
pub struct TestContext(Rc<RefCell<TestContextImpl>>);

impl TestContext {
    pub fn new() -> TestContext {
        TestContext(Rc::new(RefCell::new(TestContextImpl::new())))
    }
    
    pub fn set(&self) {
        self.0.borrow_mut().set();
    }

    pub fn get(&self) -> bool {
        self.0.borrow_mut().get()
    }
}

#[cfg(test)]
mod test {
    use runtime::{ Interp, DEFAULT_CONFIG };
    use test::{ command_compile, DebugEnvironment, TestContext };
    
    #[test]
    fn test_contexts() {
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let tc = TestContext::new();
        assert!(!tc.get());
        let bin = command_compile("context",&tc);
        t.exec(&bin,None,None).ok().unwrap();
        while t.run(1000) {}
        assert!(tc.get());
    }
}
