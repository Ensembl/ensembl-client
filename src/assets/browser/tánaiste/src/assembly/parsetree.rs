use std::fmt;

use super::escapes::string_escape;

#[derive(Clone,Debug)]
pub enum Argument {
    Reg(usize),
    Str(String),
    Floats(Vec<f64>)
}

// TODO string escapes parse+serial
impl fmt::Display for Argument {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Argument::Reg(r) =>
                write!(f,"#{}",r),
            Argument::Str(s) =>
                write!(f,"\"{}\"",string_escape(s,false)),
            Argument::Floats(ff) => {
                let mut ff_s = Vec::<String>::new();
                for f in ff {
                    ff_s.push(format!("{}",f));
                }
                write!(f,"[{}]",ff_s.join(", "))
            }
        }
    }
}

#[derive(Clone,Debug)]
pub enum Statement {
    Instruction(String,Vec<Argument>),
    Label(String)
}

#[derive(Clone,Debug)]
pub struct SourceCode {
    pub statements: Vec<Statement>
}

impl fmt::Display for Statement {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Statement::Instruction(code,args) => {
                let mut args_s = Vec::<String>::new();
                for arg in args {
                    args_s.push(format!("{}",arg));
                }
                write!(f,"    {} {}\n",code,args_s.join(", "))
            },
            Statement::Label(name) =>
                write!(f,".{}:\n",name)
        }
    }
}

impl fmt::Display for SourceCode {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for s in self.statements.iter() {
            write!(f,"{}",s).ok();
        }
        Ok(())
    }
}
