use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use composit::{ Leaf, SourceResponse };

#[derive(Clone)]
pub enum BinOpType {
    Add,
    Mul,
    Eq,
    Or
}

impl BinOpType {
    fn op(&self, a: f64, b: f64) -> f64 {
        match self {
            BinOpType::Add => a+b,
            BinOpType::Mul => a*b,
            BinOpType::Eq  => if a==b { 1. } else { 0. },
            BinOpType::Or => if a != 0. || b != 0. { 1. } else { 0. }
        }
    }
    fn name(&self) -> &str {
        match self {
            BinOpType::Add => "add",
            BinOpType::Mul => "mul",
            BinOpType::Eq  => "eq",
            BinOpType::Or => "or"
        }
    }
}

fn binop(type_: &BinOpType, a: &Vec<f64>, b: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    let mut b_iter = b.iter().cycle();
    for av in a.iter() {
        out.push(type_.op(*av,*b_iter.next().unwrap()));
    }
    out
}

// add Add, #a+b, #a, #b
// mul Mull #a*b, #a, #b
pub struct BinOp(BinOpType,usize,usize,usize);

impl Command for BinOp {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.2).as_floats(|a| {
            regs.get(self.3).as_floats(|b| {
                let data = binop(&self.0,a,b);
                regs.set(self.1,Value::new_from_float(data));
            });
        });
        return 1;
    }
}

pub struct BinOpI(pub BinOpType);
impl Instruction for BinOpI {
    fn signature(&self) -> Signature { Signature::new(self.0.name(),"rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(BinOp(self.0.clone(),args[0].reg(),args[1].reg(),args[2].reg()))
    }
}
