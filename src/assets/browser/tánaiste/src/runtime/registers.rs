use core::Command;
use super::Value;

pub struct RegisterFile {
    registers: Vec<Value>,
    limit: Option<usize>,
    size: usize,
    bust: bool
}

impl RegisterFile {
    pub fn new(limit: Option<usize>) -> RegisterFile {
        RegisterFile {
            registers: Vec::<Value>::new(),
            limit,
            size: 0,
            bust: false
        }
    }
    
    fn registers_size(&mut self, idx: usize) {
        if idx >= self.registers.len() {
            self.registers.resize_with(idx+1,|| Value::new_null());
        }
    }
    
    pub fn get(&mut self, idx: usize) -> Value {
        self.registers_size(idx);
        self.registers[idx].clone()
    }
    
    pub fn set(&mut self, idx: usize, v: Value) {
        if idx > 0 {
            self.registers_size(idx);
            if let Some(limit) = self.limit {
                let delta = v.len() - self.registers[idx].len();
                if self.size + delta > limit {
                    self.bust = true;
                    return;
                }
            }
            self.registers[idx] = v.clone();
        }
    }
    
    pub fn drop(&mut self, idx: usize) {
        if idx > 0 {
            self.set(idx,Value::new_null());
        }
    }
    
    pub fn clear(&mut self) {
        self.registers.clear();
    }
    
    pub fn is_bust(&self) -> Option<String> { 
        if self.bust {
            Some(format!("register limit {}",self.limit.unwrap()))
        } else {
            None
        }
    }
}
