use core::Command;
use super::{ Value, RegisterFile, ProcessConfig };

pub struct DataState {
    continuations: RegisterFile,
    registers: RegisterFile,
    data_stack: Vec<Value>,
    pc: usize,
    again: bool,
    stack_size: usize,
    stack_data_limit: Option<usize>,
    stack_entry_limit: Option<usize>,
    bust: Option<String>
}

impl DataState {
    pub fn new(pc: usize, config: &ProcessConfig) -> DataState {
        DataState {
            registers: RegisterFile::new(config.reg_limit),
            continuations: RegisterFile::new(None),
            data_stack: Vec::<Value>::new(),
            pc,
            stack_data_limit: config.stack_data_limit,
            stack_entry_limit: config.stack_entry_limit,
            stack_size: 0,
            again: false,
            bust: None
        }
    }
    
    pub fn continuations(&mut self) -> &mut RegisterFile { &mut self.continuations }
    pub fn registers(&mut self) -> &mut RegisterFile { &mut self.registers }
    
    pub fn is_bust(&self) -> Option<String> {
        if let Some(msg) = self.registers.is_bust() {
            return Some(msg);
        }
        return self.bust.as_ref().map(|s| s.clone())
    }
    
    pub fn push_data(&mut self, v: Value) {
        if let Some(limit) = self.stack_entry_limit {
            if limit <= self.data_stack.len() {
                self.bust = Some(format!("stack entry limit {}",limit));
            }
        }
        if let Some(limit) = self.stack_data_limit {
            self.stack_size += v.len();
            if limit <= self.stack_size {
                self.bust = Some(format!("stack data limit {}",limit));
            }
        }
        self.data_stack.push(v);
    }
    
    pub fn pop_data(&mut self) -> Value {
        let v = self.data_stack.pop().unwrap_or_else(|| Value::new_null());
        if let Some(limit) = self.stack_data_limit {
            self.stack_size -= v.len();
        }
        v
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
