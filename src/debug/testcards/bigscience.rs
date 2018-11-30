#![allow(unused)]
use std::rc::Rc;

use rand::distributions::Distribution;
use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use composit::{
    StateFixed, Component, StateValue, StateAtom, Leaf, LeafComponent,
    LCBuilder, Stick
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
        }
        closure_done(lc,1200);
    }})
}

pub fn bs_source_sub(even: bool) -> ClosureSource {
    if even { source_even() } else { source_odd() }
}

pub fn bs_source_main() -> ClosureSource {
    let seed = 12345678;
    
    let p = Palette::new();
    ClosureSource::new(0.,enclose! { (p) move |ref mut lc,leaf| {
        let mut rng = make_rng(seed);
        measure(lc,&leaf,&p.red,&p.green);
        for yidx in 0..20 {
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
                closure_add(lc,&pin_rectangle(&cleaf(0.,y-10),&area_size(cpixel(0,-10),cpixel(20,20)),&ColourSpec::Colour(Colour(128,0,0))));
            }
            if yidx == p.middle {
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
            } else if yidx == p.middle-2 {
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
            } else if yidx == p.middle+2 || yidx == p.middle+4 {
                // no-op, wiggles
            } else {
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
                    let h = if rng.gen_range(0,13) == 0 { 1 } else { 5 };
                    closure_add(lc,&stretch_rectangle(&area_size(cleaf(x/1000.,y-h),cleaf(dx/1000.,2*h)),
                                    &ColourSpec::Colour(colour)));
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

pub fn big_science(a: &mut App, onoff: bool) {
    let seed = 12345678;
    
    let cs_odd = source_odd();
    let cs_even = source_even();
    let cs = bs_source_main();
    
    let c = Component::new("XXX",Box::new(cs.clone()),Rc::new(StateFixed(StateValue::On())));

    let c_odd = Component::new("XXX",Box::new(cs_odd.clone()),if onoff {
        Rc::new(StateAtom::new("odd"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });
    let c_even = Component::new("XXX",Box::new(cs_even.clone()),if onoff {
        Rc::new(StateAtom::new("even"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });
    
    a.with_compo(|co| {
        co.add_component(c);
        co.add_component(c_odd);
        co.add_component(c_even);
        co.set_stick(&Stick::new("A",1000000000,false));
    });
    a.run_events(vec!{ Event::Zoom(0.) });
}
