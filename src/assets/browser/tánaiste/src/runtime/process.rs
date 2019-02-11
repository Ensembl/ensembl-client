use std::rc::Rc;
use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::Command;
use commands::{ Constant, DebugPrint, Concat, Sleep, External, Move };
use super::registers::RegisterFile;
use super::datastate::DataState;
use super::procstate::ProcState;
use super::value::Value;

/* TODO
 * limit: register size, stack size, value size, execution time
 */

pub struct Process {
    program: Rc<Vec<Box<Command>>>,
    data: DataState,
    proc: Arc<Mutex<ProcState>>
}

impl Process {
    pub fn new(program: Rc<Vec<Box<Command>>>, pc: usize) -> Process {
        Process {
            program,
            data: DataState::new(pc),
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
    
    pub fn get_reg(&mut self, idx: usize) -> String {
        let val = self.data.registers().get(idx);
        format!("{:?}",val)
    }
}

#[cfg(test)]
mod test {
    use std::rc::Rc;
    use runtime::Value;
    use super::Process;
    
    #[test]
    fn registers() {
        let mut r = Process::new(Rc::new(vec!{}),0);
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
        let mut r = Process::new(Rc::new(vec!{}),0);
        r.data.push_data(Value::new_from_string("lo".to_string()));
        r.data.push_data(Value::new_from_string("hi".to_string()));
        assert_eq!("\"hi\"",format!("{:?}",r.data.peek_data()));
        assert_eq!("\"hi\"",format!("{:?}",r.data.pop_data()));
        assert_eq!("\"lo\"",format!("{:?}",r.data.pop_data()));
        assert_eq!("[]",format!("{:?}",r.data.pop_data()));
    }
}
