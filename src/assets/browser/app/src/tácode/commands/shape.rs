use std::sync::{ Arc, Mutex };

use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use composit::{ Leaf, SourceResponse };
use drawing::{ DrawingSpec };
use shape::{
    ColourSpec, pin_texture, fix_texture,
    PinRectTypeSpec, RectData, StretchRectTypeSpec
};
use tácode::core::{ TáContext, TáTask };
use types::{
    Colour, cedge, cleaf, Dot, area, area_size, cpixel, Rect, A_MIDDLE,
    A_RIGHT, A_TOPLEFT, TOPLEFT, AxisSense
};

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

struct ColourIter2<'a>(Box<Iterator<Item=&'a f64> + 'a>);
impl<'a> Iterator for ColourIter2<'a> {
    type Item = Colour;
    
    fn next(&mut self) -> Option<Colour> {
        let r = self.0.next().unwrap();
        let g = self.0.next().unwrap();
        let b = self.0.next().unwrap();
        Some(Colour(*r as u32,*g as u32,*b as u32))
    }
}

fn colour_iter2<'a>(colour: &'a Vec<f64>) -> Box<Iterator<Item=Colour>+'a> {
    Box::new(ColourIter2(Box::new(colour.iter().cycle())))
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

struct FixPointIter<'a>(Leaf,Box<Iterator<Item=&'a f64> + 'a>,Box<Iterator<Item=&'a f64> + 'a>);
impl<'a> Iterator for FixPointIter<'a> {
    type Item = Dot<i32,i32>;
    
    fn next(&mut self) -> Option<Self::Item> {
        let x = self.1.next().unwrap();
        let y = self.2.next().unwrap();
        Some(cpixel(*x as i32,*y as i32))
    }
}

fn pinpoint_iter<'a>(leaf: &mut Leaf,x: &'a Vec<f64>, y: &'a Vec<f64>) -> Box<Iterator<Item=Dot<f32,i32>>+'a> {
    Box::new(PinPointIter(leaf.clone(),Box::new(x.iter().cycle()),Box::new(y.iter().cycle())))
}

fn fixpoint_iter<'a>(leaf: &mut Leaf,x: &'a Vec<f64>, y: &'a Vec<f64>) -> Box<Iterator<Item=Dot<i32,i32>>+'a> {
    Box::new(FixPointIter(leaf.clone(),Box::new(x.iter().cycle()),Box::new(y.iter().cycle())))
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
    let x_size_len = x_size.len();
    let y_start_len = y_start.len();
    let y_size_len = y_size.len();
    let col_len = colour.len();
    for i in 0..x_start.len() {
        let x_start_v = x_start[i];
        let prop_start = leaf.prop(x_start_v);
        if prop_start > 1. { continue; }
        let x_size_v = x_size[i%x_size_len];
        let prop_end = leaf.prop(x_start_v+x_size_v);
        if prop_end < 0. { continue; }
        let y_start_v = y_start[i%y_start_len];
        let y_size_v = y_size[i%y_size_len];
        let area = &area(cleaf(prop_start,y_start_v as i32),
                         cleaf(prop_end,(y_start_v+y_size_v) as i32));
        let col = Colour(colour[(i*3)%col_len] as u32,
                         colour[(i*3+1)%col_len] as u32,
                         colour[(i*3+2)%col_len] as u32);
        let shape = {
            let srts = StretchRectTypeSpec { spot, hollow };
            srts.new_shape(&RectData {
                pos_x: prop_start,
                pos_y: y_start_v as i32,
                aux_x: prop_end-prop_start,
                aux_y: y_size_v as i32,
                colour: col
            })
        };
        lc.add_shape(shape);        
    }
}

fn draw_pinrects(leaf: &mut Leaf, lc: &mut SourceResponse, x_start: &Vec<f64>,
                x_aux: &Vec<f64>, y_start: &Vec<f64>, y_aux: &Vec<f64>,
                colour: &Vec<f64>, spot: bool) {
    let mut ci = colour_iter2(colour);
    let prts = PinRectTypeSpec {
        sea_x: None,
        sea_y: None,
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: None,
        spot
    };
    let mut y_start_iter = y_start.iter().cycle();
    let mut x_size_iter = x_aux.iter().cycle();
    let mut y_size_iter = y_aux.iter().cycle();
    for x_start in x_start.iter() {
        lc.add_shape(prts.new_shape(&RectData {
            pos_x: *x_start as f32,
            pos_y: *y_start_iter.next().unwrap() as i32,
            aux_x: *x_size_iter.next().unwrap() as f32,
            aux_y: *y_size_iter.next().unwrap() as i32,
            colour: ci.next().unwrap()
        }));
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

fn draw_fixtexture(leaf: &mut Leaf, lc: &mut SourceResponse, 
                   tx: &Vec<DrawingSpec>,
                   x_start: &Vec<f64>, x_aux: &Vec<f64>,
                   y_start: &Vec<f64>, y_aux: &Vec<f64>,
                   colour: &Vec<f64>) {
    let mut tx_iter = colour.iter().cycle();
    let mut pp_iter = fixpoint_iter(leaf,x_start,y_start);
    for x_start in x_start.iter() {
        let pos = pp_iter.next().unwrap();
        let shape = fix_texture(
            tx[*tx_iter.next().unwrap() as usize].clone(),
            &cedge(TOPLEFT,pos),
            &cpixel(0,0), // offset
            &cpixel(1,1).anchor(A_RIGHT)
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
        4 => draw_fixtexture(leaf,lc,tx,x_start,x_size,y_start,y_size,colour),
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
