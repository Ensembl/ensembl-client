#![allow(unused)]

use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;
use std::rc::Rc;

use rand::distributions::Distribution;
use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use composit::{
    StateFixed, Component, StateValue, StateAtom, Leaf, LeafComponent,
    LCBuilder, Stick, vscale_bp_per_leaf
};

use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture, tape_rectangle, tape_mathsshape,
    page_texture,  pin_texture,  pin_mathsshape, pin_rectangle,
    stretch_rectangle, stretch_texture, stretch_wiggle, tape_texture,
    ColourSpec, MathsShape, fix_mathsshape, page_mathsshape
};

use controller::global::App;

use types::{
    Colour, cleaf, cpixel, area, cedge, AxisSense,
    TOPLEFT, BOTTOMLEFT, TOPRIGHT, BOTTOMRIGHT, area_size,
    A_MIDDLE, A_BOTTOMRIGHT, A_BOTTOMLEFT, A_TOPLEFT, A_TOPRIGHT, A_TOP,
    A_RIGHT, A_LEFT
};

use drawing::{
    text_texture, bitmap_texture, collage, FCFont,
    mark_rectangle, FontVariety, MarkSpec, DrawingSpec
};

use controller::input::Event;

const SW : i32 = 1000;
const SH : i32 = 1000;

fn battenberg() -> DrawingSpec {
    bitmap_texture(vec! { 0,0,255,255,
                          255,0,0,255,
                          0,255,0,255,
                          255,255,0,255 },cpixel(2,2),false)
}

fn measure(lc: &mut LCBuilder, leaf: &Leaf, cs: &ColourSpec, cs2: &ColourSpec) {
    for x in -10..10 {
        closure_add(lc,&tape_rectangle(
            &cleaf(x as f32/10.,0),
            &area_size(cpixel(0,0),cpixel(20,20)).y_edge(AxisSense::Pos,AxisSense::Pos),
            cs));
        closure_add(lc,&tape_mathsshape(
            &cleaf(x as f32/10.+25.,0).y_edge(AxisSense::Pos),
            A_TOP,
            10., None, MathsShape::Polygon(5,0.05),
            cs2));
        closure_add(lc,&tape_texture(battenberg(),
            &cleaf(x as f32/10.+0.05,0).y_edge(AxisSense::Pos),
            &cpixel(0,0),&cpixel(10,10).anchor(A_TOP)));
        closure_add(lc,&tape_mathsshape(
            &cleaf(x as f32/10.+0.075,0).y_edge(AxisSense::Pos),
            A_TOP,
            10., Some(1.), MathsShape::Circle,
            cs));
    }
}

fn make_rng(seed: i32) -> SmallRng {
    let seed = 12345678;
    let s = seed as u8;
    let t = (seed/256) as u8;
    SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t])
}


fn source_odd() -> ClosureSource {
    let seed = 12345678;
    
    let p = Palette::new();
    ClosureSource::new(0.,enclose! { (p) move |lc,leaf| {
        let mut rng = make_rng(seed);
        /*
        for yidx in 0..20 {
            let y = yidx * 60;
            if yidx == p.middle - 5 {
                for i in 1..10 {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                       A_MIDDLE,
                       10. * i as f32,None,MathsShape::Circle,
                       &p.green));
                }
            }
            if yidx == p.middle {
                closure_add(lc,&stretch_rectangle(&area_size(cleaf(-0.2,y-20),cleaf(0.1,5)),&p.red));
                for i in 3..8 {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., None, MathsShape::Polygon(i,0.2*i as f32),
                                   &p.red));
                }
                closure_add(lc,&pin_mathsshape(
                    &cleaf(-0.2,y-15),
                    A_RIGHT,
                    5.,None,
                    MathsShape::Polygon(3,0.),
                    &p.red));
            }
            if yidx == p.middle+2 || yidx == p.middle+4 {
                let wiggle = wiggly(&mut rng,500,cleaf(-0.5,y-5),0.002,20);
                closure_add(lc,&stretch_wiggle(wiggle,2,&p.green_col));
            }
            if yidx == p.middle +1 {
                for i in (3..7).step_by(2) {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &p.red));
                    let colour = Colour(0,128,255);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));
                }
            }
        }
        */
        closure_done(lc,1200);
    }})
}

fn source_even() -> ClosureSource {
    let seed = 12345678;
    
    let p = Palette::new();
    ClosureSource::new(0.,enclose! { (p) move |lc,leaf| {
        let mut rng = make_rng(seed);
        for yidx in 0..20 {
            let y = yidx * 60;
            /*
            if yidx == p.middle - 5 {
                for i in 1..10 {
                    let colour = Colour(255,0,128);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_MIDDLE,
                                   10. * i as f32,Some(2.),MathsShape::Circle,
                                   &ColourSpec::Colour(colour)));
                }
            }
            if yidx == p.middle {
                closure_add(lc,&stretch_rectangle(&area_size(cleaf(-0.2,y-15),cleaf(0.1,5)),&p.green));
                for i in 3..8 {
                    let colour = Colour(0,128,255);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                       A_TOP,
                       10., None, MathsShape::Polygon(i,0.2*i as f32),
                       &ColourSpec::Colour(colour)));

                }
                closure_add(lc,&pin_mathsshape(
                    &cleaf(-0.1,y-15),
                    A_LEFT,
                    5.,None,
                    MathsShape::Polygon(3,0.5),
                    &p.green));
            }
            if yidx == p.middle +1 {
                for i in (4..8).step_by(2) {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &p.red));
                    let colour = Colour(0,128,255);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));                    
                }
            }
            */
        }
        closure_done(lc,1200);
    }})
}

pub fn bs_source_sub(even: bool) -> ClosureSource {
    if even { source_even() } else { source_odd() }
}

fn bytes_of_u32(v: u32) -> [u8;4] {
    [
        ((v>>24)&0xff) as u8,
        ((v>>16)&0xff) as u8,
        ((v>> 8)&0xff) as u8,
        ((v    )&0xff) as u8
    ]
}

fn bytes_of_u64(v: u64) -> [u8;8] {
    [
        ((v>>56)&0xff) as u8,
        ((v>>48)&0xff) as u8,
        ((v>>40)&0xff) as u8,
        ((v>>32)&0xff) as u8,
        ((v>>24)&0xff) as u8,
        ((v>>16)&0xff) as u8,
        ((v>> 8)&0xff) as u8,
        ((v    )&0xff) as u8
    ]
}

const RNG_BLOCK_SIZE : u32 = 1000000;

fn rng_pos(kind: [u8;8], start: u32, end: u32, sep: u32, size: u32) -> Vec<[u32;2]> {
    let mut out = Vec::<[u32;2]>::new();
    let start_block = start/RNG_BLOCK_SIZE;
    let end_block = end/RNG_BLOCK_SIZE;
    for block in start_block..(end_block+1) {
        let block_start = block * RNG_BLOCK_SIZE;
        let seed = [kind[0],kind[1],kind[2],kind[3],
                    kind[4],kind[5],kind[6],kind[7],
                    0,0,0,0,
                    ((block>>24)&0xff) as u8,
                    ((block>>16)&0xff) as u8,
                    ((block>> 8)&0xff) as u8,
                    ((block    )&0xff) as u8];
        let mut rng = SmallRng::from_seed(seed);
        let mut min_start = 0;
        while min_start < RNG_BLOCK_SIZE {
            let rnd_start = min_start + rng.gen_range(sep/2,sep);
            let rnd_end = rng.gen_range(0,size) + rnd_start;
            let obj_start = rnd_start + block_start;
            let obj_end = rnd_end + block_start;
            if obj_end >= start && obj_start <= end {
                out.push([obj_start,obj_end]);
            }
            min_start = rnd_end + rng.gen_range(size/2,size);
        }
    }
    out.sort();
    out
}

fn rng_colour(kind: [u8;8], start: &[u32;2]) -> Colour {
    let mut h = DefaultHasher::new();
    h.write(&kind);
    h.write_u32(start[0]);
    h.write_u32(start[1]);
    let b = bytes_of_u64(h.finish());
    Colour(b[0] as u32,b[1] as u32,b[2] as u32)
}

fn rng_subdivide(kind: [u8;8], extent: &[u32;2], parts: u32) -> Vec<[u32;2]> {
    let mut h = DefaultHasher::new();
    h.write(&kind);
    h.write_u32(extent[0]);
    h.write_u32(extent[1]);
    let b = bytes_of_u64(h.finish());
    let seed = [b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],
                kind[0],kind[1],kind[2],kind[3],
                kind[4],kind[5],kind[6],kind[7]];
    let mut rng = SmallRng::from_seed(seed);
    let mut breaks = Vec::<u32>::new();
    for i in 0..parts {
        breaks.push(rng.gen_range(extent[0],extent[1]));
    }
    breaks.sort();
    let mut out = Vec::<[u32;2]>::new();
    for i in 0..breaks.len()-1 {
        out.push([breaks[i],breaks[i+1]]);
    }
    out
}

fn prop(leaf: &Leaf, pos: u32) -> f32 {
    let mul = vscale_bp_per_leaf(leaf.get_vscale());
    let start_leaf = (leaf.get_index() as f64 * mul).floor() as f64;
    let end_leaf = ((leaf.get_index()+1) as f64 * mul).ceil() as f64;
    let leaf_size = end_leaf-start_leaf;
    ((pos as f64-start_leaf)/leaf_size) as f32
}

pub fn bs_source_main() -> ClosureSource {
    let seed = 12345678;
    
    let p = Palette::new();
    ClosureSource::new(0.,enclose! { (p) move |ref mut lc,leaf| {
        let mul = vscale_bp_per_leaf(leaf.get_vscale());
        let start_leaf = (leaf.get_index() as f64 * mul).floor() as u32;
        let end_leaf = ((leaf.get_index()+1) as f64 * mul).ceil() as u32;
        
        let mut rng = make_rng(seed);
        measure(lc,&leaf,&p.red,&p.green);
        
        for yidx in 0..20 {
            let genestart_rng = rng_pos([yidx as u8,0,0,0,0,0,0,0],start_leaf,end_leaf,10000,10000);
            let y = yidx * 60;
            let val = daft(&mut rng);
            let tx = text_texture(&val,&p.fc_font,&p.col,&Colour(255,255,255));
            
            closure_add(lc,&page_texture(tx, 
                                &cedge(TOPLEFT,cpixel(12,y+18)),
                                &cpixel(0,0),
                                &cpixel(1,1).anchor(A_TOPLEFT)));
            
            closure_add(lc,&page_mathsshape(
                                &cpixel(0,y+18).x_edge(AxisSense::Pos),
                                A_LEFT,
                                5.,None,MathsShape::Polygon(3,0.),
                                &p.green));            
            if yidx == p.middle+3 {
                //closure_add(lc,&pin_rectangle(&cleaf(0.,y-10),&area_size(cpixel(0,-10),cpixel(20,20)),&ColourSpec::Colour(Colour(128,0,0))));
            }
            if yidx == p.middle {
                /*
                let tx = bitmap_texture(
                                    vec! { 0,0,255,255,
                                             255,0,0,255,
                                             0,255,0,255,
                                             255,255,0,255 },cpixel(4,1),true);
                closure_add(lc,&stretch_texture(tx,&area_size(cleaf(-0.5,y-5),cleaf(1.,10))));
                let tx = bitmap_texture(
                                    vec! { 0,0,255,255,
                                             255,0,0,255,
                                             0,255,0,255,
                                             255,255,0,255 },cpixel(2,2),false);
                closure_add(lc,&pin_texture(tx,&cleaf(0.,y-25),&cpixel(0,0),&cpixel(10,10).anchor(A_TOPLEFT)));
                */
            } else if yidx == p.middle-2 {
                /*
                let mut parts = Vec::<MarkSpec>::new();
                for row in 0..8 {
                    let mut off = 0;
                    for _pos in 0..100 {
                        let size = rng.gen_range(1,7);
                        let gap = rng.gen_range(1,5);
                        if off + gap + size > 1000 { continue }
                        off += gap;
                        parts.push(mark_rectangle(
                            &area_size(cpixel(off,row*5),cpixel(size,4)),
                            &Colour(255,200,100)));
                        if rng.gen_range(0,2) == 1 {
                            parts.push(mark_rectangle(
                                &area_size(cpixel(off,row*5),cpixel(1,4)),
                                &Colour(200,0,0)));
                        }
                        if rng.gen_range(0,2) == 1 {
                            parts.push(mark_rectangle(
                                &area_size(cpixel(off+size-1,row*5),cpixel(1,4)),
                                &Colour(0,0,200)));
                        }
                        off += size;
                    }
                }
                let tx = collage(parts,cpixel(1000,40));
                closure_add(lc,&stretch_texture(tx,&area_size(cleaf(-0.7,y-25),cleaf(2.,40))));
                */
            } else if yidx == p.middle+2 || yidx == p.middle+4 {
                // no-op, wiggles
            } else {
                
                for (i,start) in genestart_rng.iter().enumerate() {
                    let colour = rng_colour([yidx as u8,0,0,0,0,0,0,1],start);
                    let mut hh = 0;
                    for p in rng_subdivide([yidx as u8,0,0,0,0,0,0,2],start,6) {
                        let h = hh+1;
                        hh = 5 -hh;
                        let start_prop = prop(leaf,p[0]);
                        let end_prop = prop(leaf,p[1]);
                        closure_add(lc,
                            &stretch_rectangle(&area(cleaf(start_prop,y-h),cleaf(end_prop,y+h)),
                                        &ColourSpec::Colour(colour)));
                    }
                    
                }
 
                for idx in -100..100 {
                    let v1 = (idx as f32) * 0.1;
                    let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
                    let dx = rng.gen_range(0.,20.);
                    let x = v1 * 100. + (yidx as f32).cos() * 100.;
                    let colour = Colour(
                        (128.*v2.cos()+128.) as u32,
                        (128.*v2.sin()+128.) as u32,
                        (128.*(v2+1.0).sin()+128.) as u32,
                    );
                    //let h = if rng.gen_range(0,13) == 0 { 1 } else { 5 };
                    
                    
                    
                    let h = 1;
                    //closure_add(lc,&stretch_rectangle(&area_size(cleaf(x/1000.,y-h),cleaf(dx/1000.,2*h)),
                    //                &ColourSpec::Colour(colour)));
                    /*
                    if idx %5 == 0 {
                        let colour = Colour(colour.2,colour.0,colour.1);
                        closure_add(lc,&pin_mathsshape(
                                        &cleaf(x/1000.,y+h),
                                        A_TOP,
                                        8.,None,
                                        MathsShape::Polygon(3,0.75),
                                        &ColourSpec::Colour(colour)));
                    }
                    if rng.gen_range(0,10) == 0 {
                        let val = bio_daft(&mut rng);
                        let tx = text_texture(&val,&p.fc_font,&p.col,&Colour(255,255,255));
                        closure_add(lc,&pin_texture(tx, &cleaf(x/1000.,y-24), &cpixel(0,0), &cpixel(1,1).anchor(A_MIDDLE)));
                    }
                    */
                }
            }
        }
            
        closure_add(lc,&fix_rectangle(&area(cedge(TOPLEFT,cpixel(SW/2,0)),
                                        cedge(TOPLEFT,cpixel(SW/2+1,SH))),
                            &ColourSpec::Colour(Colour(0,0,0))));
        closure_add(lc,&fix_rectangle(&area(cedge(TOPLEFT,cpixel(SW/2+5,0)),
                                        cedge(TOPLEFT,cpixel(SW/2+8,SH))),
                            &p.red));
        let tx = bitmap_texture(vec! { 0,0,255,255,
                                     255,0,0,255,
                                     0,255,0,255,
                                     255,255,0,255 },cpixel(1,4),false);
        closure_add(lc,&fix_texture(tx, 
                                &cedge(TOPLEFT,cpixel(SW/2-5,0)),
                                &cpixel(0,0),
                                &cpixel(1,SH).anchor(A_TOPLEFT)));

        closure_add(lc,&fix_texture(battenberg(),
                                &cedge(TOPLEFT,cpixel(0,0)),
                                &cpixel(0,0),
                                &cpixel(10,10).anchor(A_TOPLEFT)));
        closure_add(lc,&fix_texture(battenberg(),
                                &cedge(BOTTOMLEFT,cpixel(0,0)),
                                &cpixel(0,0),
                                &cpixel(10,10).anchor(A_BOTTOMLEFT)));
        closure_add(lc,&fix_texture(battenberg(),
                                &cedge(TOPRIGHT,cpixel(0,0)),
                                &cpixel(0,0),
                                &cpixel(10,10).anchor(A_TOPRIGHT)));
        closure_add(lc,&fix_texture(battenberg(),
                                &cedge(BOTTOMRIGHT,cpixel(0,0)),
                                &cpixel(0,0),
                                &cpixel(10,10).anchor(A_BOTTOMRIGHT)));
        
        closure_add(lc,&fix_mathsshape(&cedge(TOPLEFT,cpixel(30,30)),
                                   A_TOPLEFT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &p.red));
        closure_add(lc,&fix_mathsshape(&cedge(TOPRIGHT,cpixel(30,30)),
                                   A_TOPRIGHT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &p.red));
        closure_add(lc,&fix_mathsshape(&cedge(BOTTOMLEFT,cpixel(30,30)),
                                   A_BOTTOMLEFT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &p.red));
        closure_add(lc,&fix_mathsshape(&cedge(BOTTOMRIGHT,cpixel(30,30)),
                                   A_BOTTOMRIGHT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &p.red));
        closure_done(lc,1200);
    }})
}

#[derive(Clone)]
struct Palette {
    col: Colour,
    green_col: Colour,
    green: ColourSpec,
    red: ColourSpec,
    middle: i32,
    fc_font: FCFont
}

impl Palette {
    fn new() -> Palette {
        let fc_font = FCFont::new(12,"Lato",FontVariety::Normal);

        let mut middle = SH / 120;
        if middle < 5 { middle = 5; }
        
        let green_col = Colour(50,255,150);
        let green = ColourSpec::Spot(green_col);
        let red = ColourSpec::Spot(Colour(255,100,50));
        Palette {
            col: Colour(200,200,200),
            green_col, green, red, middle, fc_font
        }
    }
}
