use std::rc::{ Rc };
use std::collections::HashMap;

use runtime::{ Process, Signals };
use super::command::Command;

#[derive(Debug)]
pub struct BinaryCode {
    symbols: HashMap<String,usize>,
    commands: Rc<Vec<Box<Command>>>
}

impl BinaryCode {
    pub fn new(symbols: HashMap<String,usize>,
               commands: Vec<Box<Command>>) -> BinaryCode {
        BinaryCode {
            symbols,
            commands: Rc::new(commands)
        }
    }
    
    pub fn exec(&self, start: Option<&str>, signals: Option<Signals>,
                reg_limit: Option<usize>,
                stack_entry_limit: Option<usize>,
                stack_data_limit: Option<usize>) -> Result<Process,String> {
        if let Some(start) = start {
            if let Some(start) = self.symbols.get(start) {
                Ok(Process::new(self.commands.clone(),*start,signals,
                    reg_limit,stack_entry_limit,stack_data_limit))
            } else {
                Err(format!("No such entry point '{}'",start))
            }
        } else {
            Ok(Process::new(self.commands.clone(),0,signals, reg_limit,stack_entry_limit,stack_data_limit))
        }
    }
}
