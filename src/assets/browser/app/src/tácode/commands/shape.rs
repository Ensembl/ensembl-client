use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use composit::{ Leaf, SourceResponse };
use shape::{
    ColourSpec, tape_rectangle, tape_texture, stretch_rectangle,
    stretch_box
};
use tácode::core::{ TáContext, TáTask };
use types::{ Colour, cleaf, area };


fn draw_strects(leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_size: &Vec<f64>, y_start: &Vec<f64>, y_size: &Vec<f64>,
                colour: &Vec<f64>, hollow: bool,spot: bool) {
    let mut x_size_iter = x_size.iter().cycle();
    let mut y_start_iter = y_start.iter().cycle();
    let mut y_size_iter = y_size.iter().cycle();
    let mut colour_iter = colour.iter().cycle();
    for x_start in x_start.iter() {
        let x_size = x_size_iter.next().unwrap();
        let y_start = y_start_iter.next().unwrap();
        let y_size = y_size_iter.next().unwrap();
        let prop_start = leaf.prop(*x_start);
        let prop_end = leaf.prop(*x_start+*x_size);
        let r = colour_iter.next().unwrap();
        let g = colour_iter.next().unwrap();
        let b = colour_iter.next().unwrap();
        let col = Colour(*r as u32,*g as u32,*b as u32);
        let col = if spot {
            ColourSpec::Spot(col)
        } else {
            ColourSpec::Colour(col)
        };
        if prop_end > 0. && prop_start < 1. {
            let area = &area(cleaf(prop_start,*y_start as i32),
                             cleaf(prop_end,(*y_start+*y_size) as i32));
            let shape = if hollow {
                stretch_box(area,1,&col)
            } else {
                stretch_rectangle(area,&col)
            };
            lc.add_shape(shape);
        }
    }
}

fn draw_shapes(meta: &Vec<f64>,leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_size: &Vec<f64>, y_start: &Vec<f64>, y_size: &Vec<f64>,
                colour: &Vec<f64>) {
    let kind = if meta.len() > 0 { meta[0] as i64 } else { 0 };
    let spot = if meta.len() > 1 { meta[1] != 0. } else { false };
    match kind {
        0 => draw_strects(leaf,lc,x_start,x_size,y_start,y_size,colour,false,spot),
        1 => draw_strects(leaf,lc,x_start,x_size,y_start,y_size,colour,true,spot),
        _ => ()
    }
}

// strect #meta, #x-start, #x-size, #y-start, #y-size, #colour
pub struct Shape(TáContext,usize,usize,usize,usize,usize,usize);

impl Command for Shape {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(leaf,lc,_) = task {
                let regs = rt.registers();
                regs.get(self.1).as_floats(|meta| {                
                    regs.get(self.2).as_floats(|x_start| {
                        regs.get(self.3).as_floats(|x_size| {
                            regs.get(self.4).as_floats(|y_start| {
                                regs.get(self.5).as_floats(|y_size| {
                                    regs.get(self.6).as_floats(|colour| {
                                        draw_shapes(meta,leaf,lc,x_start,x_size,
                                                     y_start,y_size,colour);
                                    });
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

pub struct ShapeI(pub TáContext);

impl Instruction for ShapeI {
    fn signature(&self) -> Signature { Signature::new("shape","rrrrrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Shape(self.0.clone(), args[0].reg(),
            args[1].reg(), args[2].reg(), args[3].reg(), args[4].reg(),
            args[5].reg()))
    }
}
