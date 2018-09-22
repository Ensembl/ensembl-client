use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use drawing::{ FCFont, FontVariety };
use composit::{ StateFixed, Component, StateValue, StateAtom };

use separator::Separatable;

use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture, page_rectangle,
    fixundertape_rectangle, fixundertape_texture,
    fixunderpage_rectangle, fixunderpage_texture,
    page_texture, pin_texture,  pin_mathsshape,
    stretch_rectangle, stretch_texture, stretch_wiggle,
    Spot, ColourSpec, MathsShape, tape_mathsshape,
    tape_rectangle, tape_texture
};

use drawing::{
    mark_rectangle,
};

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use std::rc::Rc;

use controller::Global;

use types::{ 
    Colour, cleaf, cpixel, area_size, area, cedge,
    TOPLEFT, TOPRIGHT, Dot, AxisSense, Corner, 
    A_MIDDLE, A_LEFT, A_TOPLEFT, A_RIGHT,
};

use drawing::{ text_texture, bitmap_texture, collage, Mark, Artist };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

use controller::Event;

const TRACKS: i32 = 20;
const PITCH : i32 = 63;
const TOP   : i32 = 50;

struct Palette {
    lato_12: FCFont,
    lato_18: FCFont,
    white: ColourSpec,
    grey: ColourSpec
}

fn one_offs(c: &mut Component, p: &Palette) {
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(0,2)),
                                    cedge(TOPLEFT,cpixel(36,16))),
                                &p.white));
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(36,1)),
                                    cedge(TOPLEFT,cpixel(37,17))),
                                &p.grey));
    let tx = text_texture("bp",
                          &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
    c.add_shape(fix_texture(tx,&cedge(TOPLEFT,cpixel(34,9)),
                            &cpixel(1,1).anchor(A_RIGHT)));
    
}

fn draw_frame(c: &mut Component,edge: AxisSense, p: &Palette) {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    let top = Corner(edge,AxisSense::Pos);
    let bottom = Corner(edge,AxisSense::Neg);
    
    /* top/bottom */
    c.add_shape(fixundertape_rectangle(&area(cedge(left,cpixel(0,1)),
                                    cedge(right,cpixel(0,18))),
                        &p.white));
    for y in [0,17].iter() {
        c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,*y)),
                                        cedge(right,cpixel(0,*y+1))),
                            &p.grey));
    }

    /* left/right */
    c.add_shape(fixunderpage_rectangle(&area(cedge(top,cpixel(0,18)),
                                    cedge(bottom,cpixel(36,18))),
                        &p.white));
}

fn measure(c: &mut Component,edge: AxisSense, p: &Palette) {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    
    for x in -10..10 {
        c.add_shape(tape_rectangle(
            &cleaf(x as f32*100.,0),
            &area_size(cpixel(0,1),cpixel(1,18)).y_edge(edge,edge),
            &p.grey));
        let tx = text_texture(&format!("{}",((x+20)*100000).separated_string()),
                              &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
        c.add_shape(tape_texture(tx,&cleaf(x as f32*100.,4).y_edge(edge),
                                 &cpixel(4,6),&cpixel(1,1).anchor(A_LEFT)));
    }
}

fn track(c: &mut Component, p: &Palette, t: i32) {
    let name = if t % 7 == 3 { "E" } else { "K" };
    let tx = text_texture(name,&p.lato_18,
                          &Colour(96,96,96),&Colour(255,255,255));
    c.add_shape(page_texture(tx,&cedge(TOPLEFT,cpixel(30,t*PITCH+TOP)),
                                &cpixel(1,1).anchor(A_RIGHT)));
    if t == 2 {
        c.add_shape(page_rectangle(&area(cedge(TOPLEFT,cpixel(0,t*PITCH-PITCH/3+TOP)),
                                         cedge(TOPLEFT,cpixel(6,t*PITCH+PITCH/3+TOP))),
                                   &ColourSpec::Colour(Colour(75,168,252))));
    }
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let p = g.with_compo(|c| Palette {
        lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
        lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
        white: ColourSpec::Spot(Spot::new(c,&Colour(255,255,255))),
        grey: ColourSpec::Spot(Spot::new(c,&Colour(199,208,213)))
    }).unwrap();
            
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    one_offs(&mut c,&p);
    draw_frame(&mut c,AxisSense::Pos,&p);
    draw_frame(&mut c,AxisSense::Neg,&p);
    measure(&mut c,AxisSense::Pos,&p);
    measure(&mut c,AxisSense::Neg,&p);
    for t in 0..TRACKS {
        track(&mut c,&p,t);
    }
    g.with_compo(|co| {
        co.add_component(c);
    });

    let size = g.canvas_size();

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
                
    g.add_events(vec!{ Event::Zoom(2.5) });
}
