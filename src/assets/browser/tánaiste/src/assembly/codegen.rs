use std::collections::HashMap;

use core::{ BinaryCode, Command, Instruction, InstructionSet };
use super::parsetree::{ Argument, ArgumentType, SimpleArgumentType, SourceCode, Statement };

fn check_args(r: &Vec<Argument>, pat: &Vec<ArgumentType>) -> bool {
    for (i,arg) in r.iter().enumerate() {
        let p = if i<pat.len() {
            match pat[i] {
                ArgumentType::One(ref p) => Some(p),
                ArgumentType::Many(ref p) => Some(p)
            }
        } else if pat.len() != 0 {
            match pat[pat.len()-1] {
                ArgumentType::One(_) => None,
                ArgumentType::Many(ref p) => Some(p)
            }            
        } else { None };
        if let Some(pat) = p {
            let v = match arg{
                Argument::Reg(_) =>
                    *pat == SimpleArgumentType::Reg,
                Argument::Floats(_) =>
                    *pat == SimpleArgumentType::Floats ||
                    *pat == SimpleArgumentType::Const,
                Argument::Str(_) =>
                    *pat == SimpleArgumentType::Str ||
                    *pat == SimpleArgumentType::Const
            };
            if !v { return false; }
        } else {
            return false;
        }
    }
    true
}

pub fn inst_to_cmd(instr: &Box<Instruction>, r: &Vec<Argument>) -> Result<Box<Command>,String> {
    let pat = instr.signature().1;
    if check_args(&r,&pat) {
        Ok(instr.build(r))
    } else {
        Err(format!("Incorrect arguments {:?} vs {:?}",r,pat))
    }
}

pub fn codegen_cmd(is: &InstructionSet, name: &str, r: &Vec<Argument>) -> Result<Box<Command>,String> {
    if let Some(inst) = is.get_inst(name) {
        inst_to_cmd(inst,r)
    } else {
        Err(format!("Unknown command '{}'",name))
    }
}

pub fn codegen(is: &InstructionSet, source: &SourceCode) -> Result<BinaryCode,Vec<String>> {
    let mut syms = HashMap::<String,usize>::new();
    let mut cmds = Vec::<Box<Command>>::new();
    let mut errors = Vec::<String>::new();
    for stmt in &source.statements {
        match stmt {
            Statement::Label(b) => {
                syms.insert(b.to_string(),cmds.len());
            },
            Statement::Instruction(s,args) => {
                match codegen_cmd(is,&s,args) {
                    Ok(cmd) => { cmds.push(cmd); },
                    Err(e) =>  { errors.push(e); }
                };
            }
        };
    }
    if errors.len() > 0 {
        Err(errors)
    } else {
        Ok(BinaryCode::new(syms,cmds))
    }
}
