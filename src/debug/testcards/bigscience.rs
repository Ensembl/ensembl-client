use std::clone::Clone;
use std::rc::Rc;

use rand::distributions::Distribution;
use rand::distributions::range::Range;
use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use composit::{ StateFixed, Component, StateValue, StateAtom };

use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture, tape_rectangle, tape_mathsshape,
    page_texture,  pin_texture,  pin_mathsshape, pin_rectangle,
    stretch_rectangle, stretch_texture, stretch_wiggle, tape_texture,
    ColourSpec, MathsShape, fix_mathsshape, page_mathsshape
};

use controller::global::Global;

use types::{
    Colour, cleaf, cpixel, area, cedge, AxisSense, Dot,
    TOPLEFT, BOTTOMLEFT, TOPRIGHT, BOTTOMRIGHT, area_size,
    A_MIDDLE, A_BOTTOMRIGHT, A_BOTTOMLEFT, A_TOPLEFT, A_TOPRIGHT, A_TOP,
    A_RIGHT, A_LEFT
};

use drawing::{
    text_texture, bitmap_texture, collage, Mark, Artist, FCFont,
    mark_rectangle, FontVariety
};

use controller::input::Event;

fn battenberg() -> Rc<Artist> {
    bitmap_texture(vec! { 0,0,255,255,
                          255,0,0,255,
                          0,255,0,255,
                          255,255,0,255 },cpixel(2,2),false)
}

fn measure(c: &mut Component, cs: &ColourSpec, cs2: &ColourSpec) {
    for x in -10..10 {
        c.add_shape(tape_rectangle(
            &cleaf(x as f32*100.,0),
            &area_size(cpixel(0,0),cpixel(20,20)).y_edge(AxisSense::Pos,AxisSense::Pos),
            cs).create());
        c.add_shape(tape_mathsshape(
            &cleaf(x as f32*100.+25.,0).y_edge(AxisSense::Pos),
            A_TOP,
            10., None, MathsShape::Polygon(5,0.05),
            cs2).create());
        c.add_shape(tape_texture(battenberg(),
            &cleaf(x as f32*100.+50.,0).y_edge(AxisSense::Pos),
            &cpixel(0,0),&cpixel(10,10).anchor(A_TOP)));
        c.add_shape(tape_mathsshape(
            &cleaf(x as f32*100.+75.,0).y_edge(AxisSense::Pos),
            A_TOP,
            10., Some(1.), MathsShape::Circle,
            cs).create());
    }
}

pub fn big_science(g: &mut Global, onoff: bool) {
    let seed = 12345678;
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);

    let size = g.canvas_size();

    let mut c_odd = Component::new(if onoff {
        Rc::new(StateAtom::new("odd"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });
    let mut c_even = Component::new(if onoff {
        Rc::new(StateAtom::new("even"))
    } else {
        Rc::new(StateFixed(StateValue::On()))
    });

    let fc_font = FCFont::new(12,"Lato",FontVariety::Normal);

    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
    
    let green_col = Colour(50,255,150);
    let green = ColourSpec::Spot(green_col);
    let red = ColourSpec::Spot(Colour(255,100,50));
    
    let len_gen = Range::new(0.,0.2);
    let thick_gen = Range::new(0,13);
    let showtext_gen = Range::new(0,10);
    let (sw,sh);
    {
        sw = size.0;
        sh = size.1;
    }
    let col = Colour(200,200,200);
    
    measure(&mut c,&red,&green);
    for yidx in 0..20 {
        let y = yidx * 60;
        let val = daft(&mut rng);
        let tx = text_texture(&val,&fc_font,&col,&Colour(255,255,255));
  
        c.add_shape(page_texture(tx, 
                            &cedge(TOPLEFT,cpixel(12,y+18)),
                            &cpixel(1,1).anchor(A_TOPLEFT)));
        
        c.add_shape(page_mathsshape(
                            &cpixel(0,y+18).x_edge(AxisSense::Pos),
                            A_LEFT,
                            5.,None,MathsShape::Polygon(3,0.),
                            &green).create());
        
        if yidx == middle - 5 {
            for i in 1..10 {
                c_odd.add_shape(pin_mathsshape(&cleaf(-100.+40.*(i as f32),y+20),
                               A_MIDDLE,
                               10. * i as f32,None,MathsShape::Circle,
                               &green).create());
                let colour = Colour(255,0,128);
                c_even.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               A_MIDDLE,
                               10. * i as f32,Some(2.),MathsShape::Circle,
                               &ColourSpec::Colour(colour)).create());
            }
        }
        if yidx == middle {
            for i in 3..8 {
                c_odd.add_shape(pin_mathsshape(&cleaf(-100.+40.*(i as f32),y+20),
                               A_TOP,
                               10., None, MathsShape::Polygon(i,0.2*i as f32),
                               &red).create());
                let colour = Colour(0,128,255);
                c_even.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               A_TOP,
                               10., None, MathsShape::Polygon(i,0.2*i as f32),
                               &ColourSpec::Colour(colour)).create());
            }
        }
        if yidx == middle +1 {
            for i in 3..8 {
                let cs = if i % 2 == 1 { &mut c_odd } else { &mut c_even };
                cs.add_shape(pin_mathsshape(&cleaf(-100.+40.*(i as f32),y+20),
                               A_TOP,
                               10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                               &red).create());
                let colour = Colour(0,128,255);
                cs.add_shape(pin_mathsshape(&cleaf(-300.+40.*(i as f32),y+20),
                               A_TOP,
                               10., Some(2.), MathsShape::Polygon(i,0.2*i as f32),
                               &ColourSpec::Colour(colour)).create());
            }
        }
        if yidx == middle+3 {
            c.add_shape(pin_rectangle(&cleaf(0.,y-10),&area_size(cpixel(0,-10),cpixel(20,20)),&ColourSpec::Colour(Colour(128,0,0))).create());
        }
        if yidx == middle {
            let tx = bitmap_texture(
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },cpixel(4,1),true);
            c.add_shape(stretch_texture(tx,&area_size(cleaf(-500.,y-5),cleaf(1000.,10))));
            let tx = bitmap_texture(
                                vec! { 0,0,255,255,
                                         255,0,0,255,
                                         0,255,0,255,
                                         255,255,0,255 },cpixel(2,2),false);
            c.add_shape(pin_texture(tx,&cleaf(0.,y-25),&cpixel(0,0),&cpixel(10,10).anchor(A_TOPLEFT)));
            c_odd.add_shape(stretch_rectangle(&area_size(cleaf(-200.,y-20),cleaf(100.,5)),&red).create());
            c_even.add_shape(stretch_rectangle(&area_size(cleaf(-200.,y-15),cleaf(100.,5)),&green).create());

            c_odd.add_shape(pin_mathsshape(
                            &cleaf(-200.,y-15),
                            A_RIGHT,
                            5.,None,
                            MathsShape::Polygon(3,0.),
                            &red).create());
            c_even.add_shape(pin_mathsshape(
                            &cleaf(-100.,y-15),
                            A_LEFT,
                            5.,None,
                            MathsShape::Polygon(3,0.5),
                            &green).create());
        } else if yidx == middle-2 {
            let mut parts = Vec::<Box<Mark>>::new();
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
            c.add_shape(stretch_texture(tx,&area_size(cleaf(-700.,y-25),cleaf(2000.,40))));
        } else if yidx == middle+2 || yidx == middle+4 {
            let wiggle = wiggly(&mut rng,500,cleaf(-500.,y-5),2.,20);
            c_odd.add_shape(stretch_wiggle(wiggle,2,&green_col));
        } else {
            for idx in -100..100 {
                let v1 = (idx as f32) * 0.1;
                let v2 = (idx as f32)+10.0*(yidx as f32) * 0.1;
                let dx = len_gen.sample(&mut rng) * 100.;
                let x = v1 * 100. + (yidx as f32).cos() * 100.;
                let colour = Colour(
                    (128.*v2.cos()+128.) as u32,
                    (128.*v2.sin()+128.) as u32,
                    (128.*(v2+1.0).sin()+128.) as u32,
                );
                let h = if thick_gen.sample(&mut rng) == 0 { 1 } else { 5 };
                c.add_shape(stretch_rectangle(&area_size(cleaf(x,y-h),cleaf(dx,2*h)),
                                &ColourSpec::Colour(colour)).create());
                if idx %5 == 0 {
                    let colour = Colour(colour.2,colour.0,colour.1);
                    c.add_shape(pin_mathsshape(
                                    &cleaf(x,y+h),
                                    A_TOP,
                                    8.,None,
                                    MathsShape::Polygon(3,0.75),
                                    &ColourSpec::Colour(colour)).create());
                }
                if showtext_gen.sample(&mut rng) == 0 {
                    let val = bio_daft(&mut rng);
                    let tx = text_texture(&val,&fc_font,&col,&Colour(255,255,255));
                    c.add_shape(pin_texture(tx, &cleaf(x,y-24), &cpixel(0,0), &cpixel(1,1).anchor(A_MIDDLE)));
                }
            }
        }
    }
        
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(sw/2,0)),
                                    cedge(TOPLEFT,cpixel(sw/2+1,sh))),
                        &ColourSpec::Colour(Colour(0,0,0))).create());
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(sw/2+5,0)),
                                    cedge(TOPLEFT,cpixel(sw/2+8,sh))),
                        &red).create());
    let tx = bitmap_texture(vec! { 0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255 },cpixel(1,4),false);
    c.add_shape(fix_texture(tx, 
                            &cedge(TOPLEFT,cpixel(sw/2-5,0)),
                            &cpixel(1,sh).anchor(A_TOPLEFT)));

    c.add_shape(fix_texture(battenberg(),
                            &cedge(TOPLEFT,cpixel(0,0)),
                            &cpixel(10,10).anchor(A_TOPLEFT)));
    c.add_shape(fix_texture(battenberg(),
                            &cedge(BOTTOMLEFT,cpixel(0,0)),
                            &cpixel(10,10).anchor(A_BOTTOMLEFT)));
    c.add_shape(fix_texture(battenberg(),
                            &cedge(TOPRIGHT,cpixel(0,0)),
                            &cpixel(10,10).anchor(A_TOPRIGHT)));
    c.add_shape(fix_texture(battenberg(),
                            &cedge(BOTTOMRIGHT,cpixel(0,0)),
                            &cpixel(10,10).anchor(A_BOTTOMRIGHT)));
    
    c.add_shape(fix_mathsshape(&cedge(TOPLEFT,cpixel(30,30)),
                               A_TOPLEFT,
                               20.,None,MathsShape::Polygon(5,0.),
                               &red).create());
    c.add_shape(fix_mathsshape(&cedge(TOPRIGHT,cpixel(30,30)),
                               A_TOPRIGHT,
                               20.,None,MathsShape::Polygon(5,0.),
                               &red).create());
    c.add_shape(fix_mathsshape(&cedge(BOTTOMLEFT,cpixel(30,30)),
                               A_BOTTOMLEFT,
                               20.,None,MathsShape::Polygon(5,0.),
                               &red).create());
    c.add_shape(fix_mathsshape(&cedge(BOTTOMRIGHT,cpixel(30,30)),
                               A_BOTTOMRIGHT,
                               20.,None,MathsShape::Polygon(5,0.),
                               &red).create());

    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
            co.add_component(c_odd);
            co.add_component(c_even);
        });
        s.run_events(vec!{ Event::Zoom(2.5) });
    });
}
