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

use controller::global::Global;

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

pub fn big_science(g: &mut Global, onoff: bool) {
    let seed = 12345678;
    
    let size = g.with_state(|s| {
        s.with_stage(|s| {
            s.get_size()
        })
    }).unwrap();

    let fc_font = FCFont::new(12,"Lato",FontVariety::Normal);

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
    
    let green_col = Colour(50,255,150);
    let green = ColourSpec::Spot(green_col);
    let red = ColourSpec::Spot(Colour(255,100,50));
    
    let (sw,sh);
    {
        sw = size.0;
        sh = size.1;
    }
    let col = Colour(200,200,200);
    
    let cs_odd = ClosureSource::new(0.,move |lc,leaf| {
        let mut rng = make_rng(seed);
        for yidx in 0..20 {
            let y = yidx * 60;
            if yidx == middle - 5 {
                for i in 1..10 {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                       A_MIDDLE,
                       10. * i as f32,None,MathsShape::Circle,
                       &green));
                }
            }
            if yidx == middle {
                closure_add(lc,&stretch_rectangle(&area_size(cleaf(-0.2,y-20),cleaf(0.1,5)),&red));
                for i in 3..8 {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., None, MathsShape::Polygon(i,0.2*i as f32),
                                   &red));
                }
                closure_add(lc,&pin_mathsshape(
                    &cleaf(-0.2,y-15),
                    A_RIGHT,
                    5.,None,
                    MathsShape::Polygon(3,0.),
                    &red));
            }
            if yidx == middle+2 || yidx == middle+4 {
                let wiggle = wiggly(&mut rng,500,cleaf(-0.5,y-5),0.002,20);
                closure_add(lc,&stretch_wiggle(wiggle,2,&green_col));
            }
            if yidx == middle +1 {
                for i in (3..7).step_by(2) {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &red));
                    let colour = Colour(0,128,255);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));
                }
            }
        }
        closure_done(lc,1200);
    });

    let cs_even = ClosureSource::new(0.,move |lc,leaf| {
        let mut rng = make_rng(seed);
        for yidx in 0..20 {
            let y = yidx * 60;
            if yidx == middle - 5 {
                for i in 1..10 {
                    let colour = Colour(255,0,128);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_MIDDLE,
                                   10. * i as f32,Some(2.),MathsShape::Circle,
                                   &ColourSpec::Colour(colour)));
                }
            }
            if yidx == middle {
                closure_add(lc,&stretch_rectangle(&area_size(cleaf(-0.2,y-15),cleaf(0.1,5)),&green));
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
                    &green));
            }
            if yidx == middle +1 {
                for i in (4..8).step_by(2) {
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.1+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &red));
                    let colour = Colour(0,128,255);
                    closure_add(lc,&pin_mathsshape(&cleaf(-0.3+0.04*(i as f32),y+20),
                                   A_TOP,
                                   10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                                   &ColourSpec::Colour(colour)));                    
                }
            }
        }
        closure_done(lc,1200);
    });
    
    let cs = ClosureSource::new(0.,move |ref mut lc,leaf| {
        let mut rng = make_rng(seed);
        measure(lc,&leaf,&red,&green);
        for yidx in 0..20 {
            let y = yidx * 60;
            let val = daft(&mut rng);
            let tx = text_texture(&val,&fc_font,&col,&Colour(255,255,255));
            
            closure_add(lc,&page_texture(tx, 
                                &cedge(TOPLEFT,cpixel(12,y+18)),
                                &cpixel(0,0),
                                &cpixel(1,1).anchor(A_TOPLEFT)));
            
            closure_add(lc,&page_mathsshape(
                                &cpixel(0,y+18).x_edge(AxisSense::Pos),
                                A_LEFT,
                                5.,None,MathsShape::Polygon(3,0.),
                                &green));            
            if yidx == middle+3 {
                closure_add(lc,&pin_rectangle(&cleaf(0.,y-10),&area_size(cpixel(0,-10),cpixel(20,20)),&ColourSpec::Colour(Colour(128,0,0))));
            }
            if yidx == middle {
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
            } else if yidx == middle-2 {
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
            } else if yidx == middle+2 || yidx == middle+4 {
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
                        let tx = text_texture(&val,&fc_font,&col,&Colour(255,255,255));
                        closure_add(lc,&pin_texture(tx, &cleaf(x/1000.,y-24), &cpixel(0,0), &cpixel(1,1).anchor(A_MIDDLE)));
                    }
                }
            }
        }
            
        closure_add(lc,&fix_rectangle(&area(cedge(TOPLEFT,cpixel(sw/2,0)),
                                        cedge(TOPLEFT,cpixel(sw/2+1,sh))),
                            &ColourSpec::Colour(Colour(0,0,0))));
        closure_add(lc,&fix_rectangle(&area(cedge(TOPLEFT,cpixel(sw/2+5,0)),
                                        cedge(TOPLEFT,cpixel(sw/2+8,sh))),
                            &red));
        let tx = bitmap_texture(vec! { 0,0,255,255,
                                     255,0,0,255,
                                     0,255,0,255,
                                     255,255,0,255 },cpixel(1,4),false);
        closure_add(lc,&fix_texture(tx, 
                                &cedge(TOPLEFT,cpixel(sw/2-5,0)),
                                &cpixel(0,0),
                                &cpixel(1,sh).anchor(A_TOPLEFT)));

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
                                   &red));
        closure_add(lc,&fix_mathsshape(&cedge(TOPRIGHT,cpixel(30,30)),
                                   A_TOPRIGHT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &red));
        closure_add(lc,&fix_mathsshape(&cedge(BOTTOMLEFT,cpixel(30,30)),
                                   A_BOTTOMLEFT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &red));
        closure_add(lc,&fix_mathsshape(&cedge(BOTTOMRIGHT,cpixel(30,30)),
                                   A_BOTTOMRIGHT,
                                   20.,None,MathsShape::Polygon(5,0.),
                                   &red));
        closure_done(lc,1200);
    });
    
    let c = Component::new(Box::new(cs.clone()),Rc::new(StateFixed(StateValue::On())));

    let c_odd = Component::new(Box::new(cs_odd.clone()),if onoff {
        Rc::new(StateAtom::new("odd"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });
    let c_even = Component::new(Box::new(cs_even.clone()),if onoff {
        Rc::new(StateAtom::new("even"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });
    
    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
            co.add_component(c_odd);
            co.add_component(c_even);
            co.set_stick(&Stick::new("A",1000000000,false));
        });
        s.run_events(vec!{ Event::Zoom(0.) });
    });
}
