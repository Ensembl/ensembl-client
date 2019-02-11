use core::Command;
use super::{ Value, RegisterFile };

pub struct DataState {
    continuations: RegisterFile,
    registers: RegisterFile,
    data_stack: Vec<Value>,
    pc: usize,
    again: bool
}

impl DataState {
    pub fn new(pc: usize) -> DataState {
        DataState {
            registers: RegisterFile::new(),
            continuations: RegisterFile::new(),
            data_stack: Vec::<Value>::new(),
            pc,
            again: false
        }
    }
    
    pub fn continuations(&mut self) -> &mut RegisterFile { &mut self.continuations }
    pub fn registers(&mut self) -> &mut RegisterFile { &mut self.registers }
    
    pub fn push_data(&mut self, v: Value) {
        self.data_stack.push(v);
    }
    
    pub fn pop_data(&mut self) -> Value {
        self.data_stack.pop().unwrap_or_else(|| Value::new_null())
    }
    
    pub fn peek_data(&self) -> Value {
        self.data_stack.last().map(|s| s.clone()).unwrap_or_else(|| Value::new_null())
    }    
    
    pub fn jump(&mut self, delta: i32) {
        self.pc = ((self.pc as i32) + delta) as usize;
    }
    
    pub fn pc(&self) -> usize { self.pc }
    
    pub fn set_again(&mut self) {
        self.pc -= 1;
        self.again = true;
    }
    
    pub fn clear_cont(&mut self) {
        if self.again {
            self.again = false;
        } else {
            self.continuations.clear();
        }
    }
}
