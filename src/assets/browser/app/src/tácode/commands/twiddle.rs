use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

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
        for _ in 0..stride[0] as usize {
            match data_iter.next() {
                Some(v) => { if b { out.push(*v); } }
                None => { term = true; break; }
            }
        }
    }
    out
}

fn pick(source: &Vec<f64>, palette: &Vec<f64>, stride: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    let stride = stride[0] as usize;
    for s in source.iter() {
        for i in 0..stride {
            out.push(palette[*s as usize*stride+i]);
        }
    }
    out
}

fn index(data: &Vec<f64>, palette: &Vec<f64>) -> Vec<f64> {
    let mut out = Vec::<f64>::new();
    let len = palette.len();
    for v in data.iter() {
        out.push(palette.iter()
                    .position(|x| x == v)
                    .unwrap_or(len) 
                    as f64
        );
    }
    out
}

// not #target, #source
pub struct Not(usize,usize);
// elide #target, #bools, #stride
pub struct Elide(usize,usize,usize);
// pick #tagret, #source, #palette, #stride
pub struct Pick(usize,usize,usize,usize);
// all #out, #start/end
pub struct All(usize,usize);
// index #out, #source, #palette
pub struct Index(usize,usize,usize);

impl Command for Elide {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
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
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|data| {
            regs.set(self.0,Value::new_from_float(not(data)));
        });                   
        return 1;
    }
}

impl Command for Pick {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|source| {
            regs.get(self.2).as_floats(|palette| {
                regs.get(self.3).as_floats(|stride| {
                    let data = pick(source,palette,stride);
                    regs.set(self.0,Value::new_from_float(data));
                });
            });
        });                   
        return 1;
    }
}

impl Command for All {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|start_end| {
            let v : Vec<f64> = (start_end[0] as i64..start_end[1] as i64)
                .map(|v| v as f64)
                .collect();
            regs.set(self.0,Value::new_from_float(v));
        });
        return 1;
    }
}

impl Command for Index {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|data| {
            regs.get(self.2).as_floats(|palette| {
                regs.set(self.0,Value::new_from_float(index(data,palette)))
            });
        });
        return 1;
    }
}

pub struct ElideI();
pub struct NotI();
pub struct PickI();
pub struct AllI();
pub struct IndexI();

impl Instruction for ElideI {
    fn signature(&self) -> Signature { Signature::new("elide","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Elide(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

impl Instruction for NotI {
    fn signature(&self) -> Signature { Signature::new("not","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Not(args[0].reg(),args[1].reg()))
    }
}

impl Instruction for PickI {
    fn signature(&self) -> Signature { Signature::new("pick","rrrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Pick(args[0].reg(),args[1].reg(),args[2].reg(),args[3].reg()))
    }
}

impl Instruction for AllI {
    fn signature(&self) -> Signature { Signature::new("all","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(All(args[0].reg(),args[1].reg()))
    }
}

impl Instruction for IndexI {
    fn signature(&self) -> Signature { Signature::new("index","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Index(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}
