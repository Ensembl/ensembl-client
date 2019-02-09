use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::{ Value, Command };
use commands::{ Constant, DebugPrint, Concat, Sleep, External, Move };

/* TODO
 * limit: register size, stack size, value size, execution time
 */

pub struct RuntimeProcess {
    halted: bool,
    sleeping: bool
}

impl RuntimeProcess {
    pub fn sleep(&mut self) {
        self.sleeping = true;
    }

    pub fn wake(&mut self) {
        self.sleeping = false;
    }
    
    pub fn is_sleeping(&self) -> bool { self.sleeping }
    pub fn is_halted(&self) -> bool { self.halted }
}

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

pub struct RuntimeData {
    continuations: RegisterFile,
    registers: RegisterFile,
    data_stack: Vec<Value>,
    pc: usize,
    again: bool
}

impl RuntimeData {
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

pub struct Runtime {
    program: Vec<Box<Command>>,
    data: RuntimeData,
    proc: Arc<Mutex<RuntimeProcess>>
}

impl Runtime {
    pub fn new(program: Vec<Box<Command>>) -> Runtime {
        Runtime {
            program,
            data: RuntimeData {
                registers: RegisterFile::new(),
                continuations: RegisterFile::new(),
                data_stack: Vec::<Value>::new(),
                pc: 0,
                again: false
            },
            proc: Arc::new(Mutex::new(RuntimeProcess {
                halted: false,
                sleeping: false
            }))
        }
    }
    
    pub fn step(&mut self) {
        let data = &mut self.data;
        {
            let mut proc = self.proc.lock().unwrap();
            if proc.halted || data.pc >= self.program.len() { 
                proc.halted = true;
                return;
            }
        }
        data.clear_cont();
        self.program[data.pc].execute(data,self.proc.clone());
        data.pc += 1;
    }
    
    pub fn halted(&self) -> bool {
        let proc = self.proc.lock().unwrap();
        proc.is_halted()
    }
    
    pub fn ready(&self) -> bool {
        let proc = self.proc.lock().unwrap();
        !proc.is_sleeping() && !proc.is_halted()
    }
    
    pub fn run(&mut self) {
        loop {
            if !self.ready() { return; }
            self.step();
        }
    }
}

#[test]
fn registers() {
    let mut r = Runtime::new(vec!{});
    let regs = r.data.registers();
    regs.set(4,Value::new_from_string("hi".to_string()));
    let v = regs.get(4);
    regs.set(2,v);
    regs.set(4,Value::new_from_string("lo".to_string()));
    assert_eq!("\"lo\"",format!("{:?}",regs.get(4)));
    assert_eq!("\"hi\"",format!("{:?}",regs.get(2)));
    assert_eq!("[]",format!("{:?}",regs.get(1)));
    regs.drop(4);
    assert_eq!("[]",format!("{:?}",regs.get(4)));
}

#[test]
fn data_stack() {
    let mut r = Runtime::new(vec!{});
    r.data.push_data(Value::new_from_string("lo".to_string()));
    r.data.push_data(Value::new_from_string("hi".to_string()));
    assert_eq!("\"hi\"",format!("{:?}",r.data.peek_data()));
    assert_eq!("\"hi\"",format!("{:?}",r.data.pop_data()));
    assert_eq!("\"lo\"",format!("{:?}",r.data.pop_data()));
    assert_eq!("[]",format!("{:?}",r.data.pop_data()));
}

#[test]
fn commands() {
    let mut r = Runtime::new(vec!{
        Constant::new(1,Value::new_from_string("hello ".to_string())),
        Constant::new(2,Value::new_from_string("world!".to_string())),
        Concat::new(3,1,2),
        DebugPrint::new(1),
        DebugPrint::new(2),
        DebugPrint::new(3)
    });
    r.run();
    assert_eq!("\"hello world!\"",format!("{:?}",r.data.registers().get(3)));
}

#[test]
fn sleep() {
    let mut r = Runtime::new(vec!{
        Constant::new(1,Value::new_from_string("sleeping".to_string())),
        DebugPrint::new(1),
        Sleep::new(100.),
        Constant::new(1,Value::new_from_string("waking".to_string())),
        DebugPrint::new(1),
    });
    r.run();
    let mut num_f = 0;
    for _ in 0..20 {
        if r.ready() { break; }
        num_f += 1;
        thread::sleep(time::Duration::from_millis(10));
    }
    assert!(num_f > 5);
    assert!(num_f < 15);
    
    r.run();
}

#[test]
fn external() {    
    let mut r = Runtime::new(vec!{
        Constant::new(4,Value::new_from_string("running".to_string())),
        DebugPrint::new(4),
        Constant::new(1,Value::new_from_float(vec!{ 4. })),
        Constant::new(2,Value::new_from_float(vec!{ 4. })),
        External::new(3,None,None,"touch /tmp/x"),
        External::new(1,None,Some(4),"ls /tmp/x ; rm /tmp/x"),
        External::new(2,None,Some(5),"ls /tmp/x ; rm /tmp/x"),
        Constant::new(0,Value::new_from_string("finished".to_string())),
        DebugPrint::new(4),
        DebugPrint::new(4),
        DebugPrint::new(5),
    });
    r.run();
    while !r.halted() {
        r.run();
        thread::sleep(time::Duration::from_millis(100));
    }
    assert_eq!("[0.0]",format!("{:?}",r.data.registers().get(1)));
    assert_eq!("[1.0]",format!("{:?}",r.data.registers().get(2)));
    assert_eq!("\"\"",format!("{:?}",r.data.registers().get(4)));
    assert_ne!("\"\"",format!("{:?}",r.data.registers().get(5)));
    r.run();
}
