use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use canvasutil;
use composit::{ StateFixed, Component, StateValue, StateAtom };

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
             TOPLEFT, TOPRIGHT, Dot, AxisSense, Corner };

use drawing::{ text_texture, bitmap_texture, collage, Mark, Artist };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

use controller::Event;

struct Palette {
    white: Spot
}

fn draw_frame(edge: AxisSense, p: &Palette) -> Component {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,0)),
                                    cedge(right,cpixel(0,20))),
                        &ColourSpec::Spot(p.white.clone())));
    c
}

fn battenberg() -> Rc<Artist> {
    bitmap_texture(vec! { 0,0,255,255,
                          255,0,0,255,
                          0,255,0,255,
                          255,255,0,255 },cpixel(2,2))
}

fn measure(edge: AxisSense, cs: &ColourSpec, cs2: &ColourSpec) -> Component {
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    for x in -10..10 {
        c.add_shape(tape_rectangle(
            &cleaf(x as f32*100.,0),
            &area_size(cpixel(0,0),cpixel(20,20)).y_edge(edge,edge),
            cs));
        c.add_shape(tape_mathsshape(
            &cleaf(x as f32*100.+25.,0).y_edge(edge),
            Dot(None,Some(AxisSense::Pos)),
            10., None, MathsShape::Polygon(5,0.05),
            cs2));
        c.add_shape(tape_texture(battenberg(),
            &cleaf(x as f32*100.+50.,0).y_edge(edge),
            &cpixel(10,10)));
        c.add_shape(tape_mathsshape(
            &cleaf(x as f32*100.+75.,0).y_edge(edge),
            Dot(None,Some(AxisSense::Pos)),
            10., Some(2.), MathsShape::Circle,
            cs));
    }
    c
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();
    let seed = 12345678;
    let s = seed as u8;
    let t = (seed/256) as u8;
    let mut rng = SmallRng::from_seed([s,s,s,s,s,s,s,s,t,t,t,t,t,t,t,t]);

    let p = g.with_compo(|c| Palette {
        white: Spot::new(c,&Colour(255,255,25))
    }).unwrap();


    let (red_spot, green_spot) = g.with_compo(|c| {
        (Spot::new(c,&Colour(255,100,50)),
         Spot::new(c,&Colour(50,255,150)))
    }).unwrap();
            
    let red = ColourSpec::Spot(red_spot.clone());
    let green = ColourSpec::Spot(green_spot.clone());

    let top_f = draw_frame(AxisSense::Pos,&p);
    let bot_f = draw_frame(AxisSense::Neg,&p);
    let top_m = measure(AxisSense::Pos,&red,&green);
    let bot_m = measure(AxisSense::Neg,&red,&green);
    g.with_compo(|co| {
        co.add_component(top_f);
        co.add_component(bot_f);
        co.add_component(top_m);
        co.add_component(bot_m);
    });

    let size = g.canvas_size();

    
    
    
    let mut c_odd = Component::new(Rc::new(StateAtom::new("odd")));
    let mut c_even = Component::new(Rc::new(StateAtom::new("even")));
        
    let fc_font = canvasutil::FCFont::new(12,"Lato");

    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
        
    let len_gen = Range::new(0.,0.2);
    let thick_gen = Range::new(0,13);
    let showtext_gen = Range::new(0,10);
    let (sw,sh);
    {
        sw = size.0;
        sh = size.1;
    }
    let col = Colour(200,200,200);
        
    //c.add_shape(fix_rectangle(&rpixel(cpixel(sw/2,0),cpixel(1,sh)),
    //                    &ColourSpec::Colour(Colour(0,0,0))));
    //c.add_shape(fix_rectangle(&rpixel(cpixel(sw/2+5,0),cpixel(3,sh)),
    //                    &red));
    let tx = bitmap_texture(vec! { 0,0,255,255,
                                 255,0,0,255,
                                 0,255,0,255,
                                 255,255,0,255 },cpixel(1,4));
    //c.add_shape(fix_texture(tx, &cpixel(sw/2-5,0),&cpixel(1,sh)));
    g.with_compo(|co| {
        co.add_component(c);
        co.add_component(c_odd);
        co.add_component(c_even);
    });
    g.add_events(vec!{ Event::Zoom(2.5) });
}
