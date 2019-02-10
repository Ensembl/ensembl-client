use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::{ Value, Command };
use commands::{ Constant, DebugPrint, Concat, Sleep, External, Move };
use core::registers::RegisterFile;
use core::datastate::DataState;
use core::procstate::ProcState;

/* TODO
 * limit: register size, stack size, value size, execution time
 */

pub struct Runtime {
    program: Vec<Box<Command>>,
    data: DataState,
    proc: Arc<Mutex<ProcState>>
}

impl Runtime {
    pub fn new(program: Vec<Box<Command>>) -> Runtime {
        Runtime {
            program,
            data: DataState::new(),
            proc: Arc::new(Mutex::new(ProcState::new()))
        }
    }
    
    pub fn step(&mut self) {
        let data = &mut self.data;
        {
            if data.pc() >= self.program.len() {
                self.proc.lock().unwrap().halt();
            }
            if self.proc.lock().unwrap().is_halted() {
                return;
            }
        }
        data.clear_cont();
        self.program[data.pc()].execute(data,self.proc.clone());
        data.jump(1);
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
        External::new(3,0,0,"touch /tmp/x"),
        External::new(1,0,4,"ls /tmp/x ; rm /tmp/x"),
        External::new(2,0,5,"ls /tmp/x ; rm /tmp/x"),
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
