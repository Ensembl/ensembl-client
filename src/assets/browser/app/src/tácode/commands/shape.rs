use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use composit::{ Leaf, SourceResponse };
use drawing::{ DrawingSpec };
use shape::{
    ColourSpec, stretch_rectangle, stretch_box, pin_rectangle,
    pin_texture
};
use tácode::core::{ TáContext, TáTask };
use types::{ Colour, cleaf, Dot, area, area_size, cpixel, Rect, A_MIDDLE };

struct ColourIter<'a>(bool,Box<Iterator<Item=&'a f64> + 'a>);
impl<'a> Iterator for ColourIter<'a> {
    type Item = ColourSpec;
    
    fn next(&mut self) -> Option<ColourSpec> {
        let r = self.1.next().unwrap();
        let g = self.1.next().unwrap();
        let b = self.1.next().unwrap();
        let col = Colour(*r as u32,*g as u32,*b as u32);
        if self.0 {
            Some(ColourSpec::Spot(col))
        } else {
            Some(ColourSpec::Colour(col))
        }        
    }
}

fn colour_iter<'a>(colour: &'a Vec<f64>, spot: bool) -> Box<Iterator<Item=ColourSpec>+'a> {
    Box::new(ColourIter(spot,Box::new(colour.iter().cycle())))
}

struct PinPointIter<'a>(Leaf,Box<Iterator<Item=&'a f64> + 'a>,Box<Iterator<Item=&'a f64> + 'a>);
impl<'a> Iterator for PinPointIter<'a> {
    type Item = Dot<f32,i32>;
    
    fn next(&mut self) -> Option<Self::Item> {
        let x = self.1.next().unwrap();
        let y = self.2.next().unwrap();
        Some(cleaf(self.0.prop(*x),*y as i32))
    }
}

fn pinpoint_iter<'a>(leaf: &mut Leaf,x: &'a Vec<f64>, y: &'a Vec<f64>) -> Box<Iterator<Item=Dot<f32,i32>>+'a> {
    Box::new(PinPointIter(leaf.clone(),Box::new(x.iter().cycle()),Box::new(y.iter().cycle())))
}

struct PixelAreaIter<'a>(Box<Iterator<Item=&'a f64> + 'a>,Box<Iterator<Item=&'a f64> + 'a>);
impl<'a> Iterator for PixelAreaIter<'a> {
    type Item = Rect<i32,i32>;
    
    fn next(&mut self) -> Option<Self::Item> {
        let x = *self.0.next().unwrap() as i32;
        let y = *self.1.next().unwrap() as i32;
        let xs = *self.0.next().unwrap() as i32;
        let ys = *self.1.next().unwrap() as i32;
        Some(area_size(cpixel(x,y),cpixel(xs,ys)))
    }
}

fn pixelarea_iter<'a>(x: &'a Vec<f64>, y: &'a Vec<f64>) -> Box<Iterator<Item=Rect<i32,i32>>+'a> {
    Box::new(PixelAreaIter(Box::new(x.iter().cycle()),Box::new(y.iter().cycle())))
}

fn draw_strects(leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_size: &Vec<f64>, y_start: &Vec<f64>, y_size: &Vec<f64>,
                colour: &Vec<f64>, hollow: bool,spot: bool) {
    let mut x_size_iter = x_size.iter().cycle();
    let mut y_start_iter = y_start.iter().cycle();
    let mut y_size_iter = y_size.iter().cycle();
    let mut ci : Box<Iterator<Item=ColourSpec>> = colour_iter(colour,spot);
    for x_start in x_start.iter() {
        let x_size = x_size_iter.next().unwrap();
        let y_start = y_start_iter.next().unwrap();
        let y_size = y_size_iter.next().unwrap();
        let prop_start = leaf.prop(*x_start);
        let prop_end = leaf.prop(*x_start+*x_size);
        let col : ColourSpec = ci.next().unwrap();
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

fn draw_pinrects(leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_aux: &Vec<f64>, y_start: &Vec<f64>, y_aux: &Vec<f64>,
                colour: &Vec<f64>, spot: bool) {
    let mut ci = colour_iter(colour,spot);
    let mut pp_iter = pinpoint_iter(leaf,x_start,y_start);
    let mut pa_iter = pixelarea_iter(x_aux,y_aux);
    for x_start in x_start.iter() {
        let shape = pin_rectangle(
            &pp_iter.next().unwrap(),
            &pa_iter.next().unwrap(),
            &ci.next().unwrap()
        );
        lc.add_shape(shape);
    }
}

fn draw_pintexture(leaf: &mut Leaf, lc: &mut SourceResponse, 
                   tx: &Vec<DrawingSpec>,
                   x_start: &Vec<f64>, x_aux: &Vec<f64>,
                   y_start: &Vec<f64>, y_aux: &Vec<f64>,
                   colour: &Vec<f64>) {
    let mut tx_iter = colour.iter().cycle();
    let mut pp_iter = pinpoint_iter(leaf,x_start,y_start);
    for x_start in x_start.iter() {
        let pos = pp_iter.next().unwrap();
        let shape = pin_texture(
            tx[*tx_iter.next().unwrap() as usize].clone(),
            &pos,
            &cpixel(0,0), // offset
            &cpixel(1,1).anchor(A_MIDDLE)
        );
        lc.add_shape(shape);
    }
}

fn draw_shapes(meta: &Vec<f64>,leaf: &mut Leaf, lc: &mut SourceResponse, 
                tx: &Vec<DrawingSpec>,x_start: &Vec<f64>,
                x_size: &Vec<f64>, y_start: &Vec<f64>, y_size: &Vec<f64>,
                colour: &Vec<f64>) {
    let kind = if meta.len() > 0 { meta[0] as i64 } else { 0 };
    let spot = if meta.len() > 1 { meta[1] != 0. } else { false };
    match kind {
        0 => draw_strects(leaf,lc,x_start,x_size,y_start,y_size,colour,false,spot),
        1 => draw_strects(leaf,lc,x_start,x_size,y_start,y_size,colour,true,spot),
        2 => draw_pinrects(leaf,lc,x_start,x_size,y_start,y_size,colour,spot),
        3 => draw_pintexture(leaf,lc,tx,x_start,x_size,y_start,y_size,colour),
        _ => ()
    }
}

// strect #meta, #x-start, #x-size, #y-start, #y-size, #colour
pub struct Shape(TáContext,usize,usize,usize,usize,usize,usize);

impl Command for Shape {
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(leaf,lc,ref tx,_) = task {
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
