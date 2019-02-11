use std::rc::{ Rc };
use std::collections::HashMap;

use runtime::Runtime;
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
        
    pub fn exec(&self, start: Option<&str>) -> Result<Runtime,String> {
        if let Some(start) = start {
            if let Some(start) = self.symbols.get(start) {
                Ok(Runtime::new(self.commands.clone(),*start))
            } else {
                Err(format!("No such entry point '{}'",start))
            }
        } else {
            Ok(Runtime::new(self.commands.clone(),0))
        }
    }
}
