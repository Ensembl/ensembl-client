use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use composit::{ Leaf, SourceResponse };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use tácode::core::{ TáContext, TáTask };
use types::{ Colour, cleaf, area };

fn not(data: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    for v in data.iter() {
        out.push(if *v == 0. { 1. } else { 0. });
    }
    out
}

fn elide(data: &Vec<f64>, bools: &Vec<f64>, stride: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    let mut data_iter = data.iter();
    let mut bool_iter = bools.iter().cycle();
    let mut term = false;
    while !term {
        let b = *bool_iter.next().unwrap() != 0.;
        for i in 0..stride[0] as usize {
            match data_iter.next() {
                Some(v) => { if b { out.push(*v); } }
                None => { term = true; break; }
            }
        }
    }
    out
}

// not #target, #source
pub struct Not(usize,usize);
// elide #target, #bools, #stride
pub struct Elide(usize,usize,usize);

impl Command for Elide {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.0).as_floats(|data| {
            regs.get(self.1).as_floats(|bools| {
                regs.get(self.2).as_floats(|stride| {
                    let data = elide(data,bools,stride);
                    regs.set(self.0,Value::new_from_float(data));
                });
            });
        });                   
        return 1;
    }
}

impl Command for Not {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|data| {
            regs.set(self.0,Value::new_from_float(not(data)));
        });                   
        return 1;
    }
}

pub struct ElideI();

impl Instruction for ElideI {
    fn signature(&self) -> Signature { Signature::new("elide","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Elide(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

pub struct NotI();

impl Instruction for NotI {
    fn signature(&self) -> Signature { Signature::new("not","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Not(args[0].reg(),args[1].reg()))
    }
}
