use core::{ Value, Command };

pub struct RegisterFile {
    registers: Vec<Value>
}

impl RegisterFile {
    pub fn new() -> RegisterFile {
        RegisterFile {
            registers: Vec::<Value>::new()
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
}
