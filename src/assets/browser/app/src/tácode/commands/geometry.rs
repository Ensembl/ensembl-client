use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use tácode::core::{ TáContext, TáTask };

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

// abutt #sizes, #starts
pub struct Abutt(usize,usize);
// extent #start/end
pub struct Extent(TáContext,usize); 
// scale #out
pub struct Scale(TáContext,usize);

impl Command for Abutt {
    fn execute(&self, rt: &mut DataState, _proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        regs.get(self.1).as_floats(|starts| {
            let (starts,sizes) = abutt(starts);
            regs.set(self.1,Value::new_from_float(starts));
            regs.set(self.0,Value::new_from_float(sizes));
        });                   
        return 1;
    }
}

impl Command for Extent {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(leaf,lc,_) = task {
                regs.set(self.1,Value::new_from_float(vec! {
                    leaf.get_start(),
                    leaf.get_end()
                }));
            }
        });
        return 1;
    }
}

impl Command for Scale {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(leaf,lc,_) = task {
                let scale = leaf.get_scale().get_index()+13;
                regs.set(self.1,Value::new_from_float(vec![scale as f64]));
            }
        });
        return 1;
    }
}

pub struct AbuttI();
pub struct ExtentI(pub TáContext);
pub struct ScaleI(pub TáContext);

impl Instruction for AbuttI {
    fn signature(&self) -> Signature { Signature::new("abutt","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Abutt(args[0].reg(),args[1].reg()))
    }
}

impl Instruction for ExtentI {
    fn signature(&self) -> Signature { Signature::new("extent","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Extent(self.0.clone(),args[0].reg()))
    }
}

impl Instruction for ScaleI {
    fn signature(&self) -> Signature { Signature::new("scale","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Scale(self.0.clone(),args[0].reg()))
    }
}
