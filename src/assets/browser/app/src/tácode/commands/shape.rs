use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use composit::{ Leaf, SourceResponse };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use tácode::core::{ TáContext, TáTask };
use types::{ Colour, cleaf, area };


fn draw_strects(leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_size: &Vec<f64>, y_start: &Vec<f64>, y_size: &Vec<f64>,
                colour: &Vec<f64>) {
    let mut x_size_iter = x_size.iter().cycle();
    let mut y_start_iter = y_start.iter().cycle();
    let mut y_size_iter = y_size.iter().cycle();
    let mut colour_iter = colour.iter().cycle();
    for x_start in x_start.iter() {
        let x_size = x_size_iter.next().unwrap();
        let y_start = y_start_iter.next().unwrap();
        let y_size = y_size_iter.next().unwrap();
        let prop_start = leaf.prop(*x_start as i32);
        let prop_end = leaf.prop((*x_start+*x_size) as i32);
        let r = colour_iter.next().unwrap();
        let g = colour_iter.next().unwrap();
        let b = colour_iter.next().unwrap();
        let col = ColourSpec::Colour(Colour(*r as u32,*g as u32,*b as u32));
        if prop_end > 0. && prop_start < 1. {
            lc.add_shape(stretch_rectangle(
                &area(cleaf(prop_start,*y_start as i32),
                      cleaf(prop_end,(*y_start+*y_size) as i32)),&col));
        }        
    }
}

// strect #x-start, #x-size, #y-start, #y-size, #colour
pub struct StretchRect(TáContext,usize,usize,usize,usize,usize);

impl Command for StretchRect {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(leaf,lc) = task {
                let regs = rt.registers();
                regs.get(self.1).as_floats(|x_start| {
                    regs.get(self.2).as_floats(|x_size| {
                        regs.get(self.3).as_floats(|y_start| {
                            regs.get(self.4).as_floats(|y_size| {
                                regs.get(self.5).as_floats(|colour| {
                                    draw_strects(leaf,lc,x_start,x_size,
                                                 y_start,y_size,colour);
                                });
                            });
                        });
                    });
                });                    
            }
        });
        return 1
    }
}

pub struct StRectI(pub TáContext);

impl Instruction for StRectI {
    fn signature(&self) -> Signature { Signature::new("strect","rrrrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(StretchRect(self.0.clone(), args[0].reg(),
            args[1].reg(), args[2].reg(), args[3].reg(), args[4].reg()))
    }
}
