use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use composit::{ Leaf, SourceResponse };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use tácode::core::{ TáContext, TáTask };
use types::{ Colour, cleaf, area };

// TODO check ranges
// TODO &mut-able registers
// TODO clever copying
fn abutt(starts: &Vec<f64>, ends: &Vec<f64>) -> (Vec<f64>, Vec<f64>) {
    let mut starts_out = Vec::<f64>::new();
    let mut sizes_out = Vec::<f64>::new();
    starts_out.push(ends[0]);
    let mut prev_start = ends[0];
    for p in starts.iter() {
        starts_out.push(*p);
        sizes_out.push(*p-prev_start);
        prev_start = *p;
    }
    sizes_out.push(ends[1]-prev_start);
    (starts_out,sizes_out)
}

// strect #sizes, #starts, #start/end
pub struct Abutt(usize,usize,usize);

impl Command for Abutt {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|starts| {
            regs.get(self.2).as_floats(|ends| {
                let (starts,sizes) = abutt(starts,ends);
                regs.set(self.1,Value::new_from_float(starts));
                regs.set(self.0,Value::new_from_float(sizes));
            });
        });                   
        return 1;
    }
}

pub struct AbuttI();

impl Instruction for AbuttI {
    fn signature(&self) -> Signature { Signature::new("abutt","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Abutt(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}
