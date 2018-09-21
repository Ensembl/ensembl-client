use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use drawing::FCFont;
use composit::{ StateFixed, Component, StateValue, StateAtom };

use separator::Separatable;

use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture,
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

use types::{ Colour, cleaf, cpixel, area_size, area, cedge,
             TOPLEFT, TOPRIGHT, Dot, AxisSense, Corner, A_MIDDLE, A_LEFT, A_TOPLEFT };

use drawing::{ text_texture, bitmap_texture, collage, Mark, Artist };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

use controller::Event;

struct Palette {
    lato_12: FCFont,
    white: ColourSpec,
    grey: ColourSpec
}

fn draw_frame(edge: AxisSense, p: &Palette) -> Component {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,1)),
                                    cedge(right,cpixel(0,18))),
                        &p.white));
    for y in [1,18].iter() {
        c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,*y)),
                                        cedge(right,cpixel(0,*y+1))),
                            &p.grey));
    }
    c
}

fn measure(edge: AxisSense, p: &Palette) -> Component {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    for x in -10..10 {
        c.add_shape(tape_rectangle(
            &cleaf(x as f32*100.,0),
            &area_size(cpixel(0,1),cpixel(1,18)).y_edge(edge,edge),
            &p.grey));
        let tx = text_texture(&format!("{}",((x+20)*100000).separated_string()),
                              &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
        c.add_shape(tape_texture(tx,&cleaf(x as f32*100.,4).y_edge(edge),
                                 &cpixel(4,6).anchor(A_LEFT),&cpixel(1,1)));
    }
    c
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let p = g.with_compo(|c| Palette {
        lato_12: FCFont::new(12,"Lato"),
        white: ColourSpec::Spot(Spot::new(c,&Colour(255,255,255))),
        grey: ColourSpec::Spot(Spot::new(c,&Colour(199,208,213)))
    }).unwrap();
            
    let top_f = draw_frame(AxisSense::Pos,&p);
    let bot_f = draw_frame(AxisSense::Neg,&p);
    let top_m = measure(AxisSense::Pos,&p);
    let bot_m = measure(AxisSense::Neg,&p);
    g.with_compo(|co| {
        co.add_component(top_f);
        co.add_component(bot_f);
        co.add_component(top_m);
        co.add_component(bot_m);
    });

    let size = g.canvas_size();

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
                
    g.add_events(vec!{ Event::Zoom(2.5) });
}
