use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use composit::{ Leaf, SourceResponse };
use drawing::{ DrawingSpec };
use shape::{
    ColourSpec, Facade, FacadeType, ShapeInstanceData, TypeToShape,
    PinRectTypeSpec, StretchRectTypeSpec,
    TextureTypeSpec
};
use tácode::core::{ TáContext, TáTask };
use super::super::shapecmd::{ build_meta };
use types::{
    Colour, cedge, cleaf, Dot, area, area_size, cpixel, Rect, A_MIDDLE,
    A_RIGHT, A_TOPLEFT, TOPLEFT, AxisSense
};

fn do_scale(spec: &Box<TypeToShape>, leaf: &Leaf, x_start: f64, x_aux: f64) -> Option<(f32,f32)> {
    let needs_scale = spec.needs_scale();
    let x_pos_v = if needs_scale.0 {
        let p = leaf.prop(x_start);
        if p <= 1. { Some(p) } else { None }
    } else {
        Some(x_start as f32)
    };
    
    let x_aux_v = if needs_scale.1 {
        let p =leaf.prop(x_start+x_aux)-leaf.prop(x_start);
        if p >= 0. { Some(p) } else { None }
    } else {
        Some(x_aux as f32)
    };
    if x_pos_v.is_some() && x_aux_v.is_some() {
        Some((x_pos_v.unwrap(),x_aux_v.unwrap()))
    } else {
        None
    }
}

fn draw_shapes(meta: &Vec<f64>,leaf: &mut Leaf, lc: &mut SourceResponse, 
                tx: &Vec<DrawingSpec>,x_start: &Vec<f64>,
                x_aux: &Vec<f64>, y_start: &Vec<f64>, y_aux: &Vec<f64>,
                colour: &Vec<f64>) {
    let mut meta_iter = meta.iter().cycle();
    let mut y_start_iter = y_start.iter().cycle();
    let mut x_aux_iter = x_aux.iter().cycle();
    let mut y_aux_iter = y_aux.iter().cycle();
    if let Some(spec) = build_meta(&mut meta_iter) {
        let y_start_len = y_start.len();
        let x_aux_len = x_aux.len();
        let y_aux_len = y_aux.len();
        let col_len = colour.len();
        for i in 0..x_start.len() {
            if let Some((x_pos_v,x_aux_v)) = 
                    do_scale(&spec,leaf,x_start[i],x_aux[i%x_aux_len]) {
                let facade = match spec.get_facade_type() {
                    FacadeType::Colour => {
                        let r = colour[(i*3)%col_len] as u32;
                        let g = colour[(i*3+1)%col_len] as u32;
                        let b = colour[(i*3+2)%col_len] as u32;
                        Facade::Colour(Colour(r,g,b))
                    },
                    FacadeType::Drawing => {
                        let idx = colour[i%col_len];
                        Facade::Drawing(tx[idx as usize].clone())
                    }
                };
                let data = ShapeInstanceData {
                    pos_x: x_pos_v,
                    pos_y: y_start[i%y_start_len] as i32,
                    aux_x: x_aux_v,
                    aux_y: y_aux[i%y_aux_len] as i32,
                    facade
                };
                lc.add_shape(spec.new_shape(&data));
            }
        }
    }    
}

// strect #meta, #x-start, #x-size, #y-start, #y-size, #colour
pub struct Shape(TáContext,usize,usize,usize,usize,usize,usize);

impl Command for Shape {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,leaf,lc,ref tx,_) = task {
                let regs = rt.registers();
                regs.get(self.1).as_floats(|meta| {                
                    regs.get(self.2).as_floats(|x_start| {
                        regs.get(self.3).as_floats(|x_size| {
                            regs.get(self.4).as_floats(|y_start| {
                                regs.get(self.5).as_floats(|y_size| {
                                    regs.get(self.6).as_floats(|colour| {
                                        draw_shapes(meta,leaf,lc,tx,x_start,x_size,
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
