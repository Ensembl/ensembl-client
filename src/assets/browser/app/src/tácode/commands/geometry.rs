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
fn abutt(starts: &Vec<f64>) -> (Vec<f64>, Vec<f64>) {
    let mut starts_out = Vec::<f64>::new();
    let mut sizes_out = Vec::<f64>::new();
    let mut starts_iter = starts.iter();
    if let Some(mut prev) = starts_iter.next() {
        loop {
            match starts_iter.next() {
                Some(next) => {
                    starts_out.push(*prev);
                    sizes_out.push(next-*prev);
                    prev = next;
                },
                None => { break; }
            }
        }
    }
    (starts_out,sizes_out)
}

// strect #sizes, #starts
pub struct Abutt(usize,usize);

impl Command for Abutt {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|starts| {
            let (starts,sizes) = abutt(starts);
            regs.set(self.1,Value::new_from_float(starts));
            regs.set(self.0,Value::new_from_float(sizes));
        });                   
        return 1;
    }
}

pub struct AbuttI();

impl Instruction for AbuttI {
    fn signature(&self) -> Signature { Signature::new("abutt","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Abutt(args[0].reg(),args[1].reg()))
    }
}
