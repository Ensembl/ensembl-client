use std::rc::{ Rc };
use std::collections::HashMap;

use runtime::{ Process, ProcessConfig, Signals };
use super::command::Command;

pub struct BinaryCode {
    symbols: HashMap<String,usize>,
    commands: Rc<Vec<Box<dyn Command>>>
}

impl BinaryCode {
    pub fn new(symbols: HashMap<String,usize>,
               commands: Vec<Box<dyn Command>>) -> BinaryCode {
        BinaryCode {
            symbols,
            commands: Rc::new(commands)
        }
    }
    
    pub fn exec(&self, start: Option<&str>, signals: Option<Signals>,
                pc: &ProcessConfig) -> Result<Process,String> {
        if let Some(start) = start {
            if let Some(start) = self.symbols.get(start) {
                Ok(Process::new(self.commands.clone(),*start,signals,
                    pc))
            } else {
                Err(format!("No such entry point '{}'",start))
            }
        } else {
            Ok(Process::new(self.commands.clone(),0,signals,pc))
        }
    }
}
