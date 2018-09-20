use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use canvasutil;
use composit::{ StateFixed, Component, StateValue, StateAtom };

use debug::testcards::common::{ daft, bio_daft, wiggly };

use shape::{
    fix_rectangle, fix_texture,
    page_texture, pin_texture,  pin_mathsshape,
    stretch_rectangle, stretch_texture, stretch_wiggle,
    Spot, ColourSpec, MathsShape,
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
             TOPLEFT, TOPRIGHT };

use drawing::{ text_texture, bitmap_texture, collage, Mark };

use rand::distributions::Distribution;
use rand::distributions::range::Range;

use controller::Event;

struct Palette {
    white: Spot
}

fn draw_frame(g: &Global, p: &Palette) -> Component {
    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
    c.add_shape(fix_rectangle(&area(cedge(TOPLEFT,cpixel(0,0)),
                                    cedge(TOPRIGHT,cpixel(0,10))),
                        &ColourSpec::Spot(p.white.clone())));
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


    let frame = draw_frame(&g,&p);
    g.with_compo(|co| {
        co.add_component(frame);
    });

    let size = g.canvas_size();

    
    
    
    let mut c_odd = Component::new(Rc::new(StateAtom::new("odd")));
    let mut c_even = Component::new(Rc::new(StateAtom::new("even")));

    let (red_spot, green_spot) = g.with_compo(|c| {
        (Spot::new(c,&Colour(255,100,50)),
         Spot::new(c,&Colour(50,255,150)))
    }).unwrap();
        
    let fc_font = canvasutil::FCFont::new(12,"Lato");

    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));

    let mut middle = size.1 / 120;
    if middle < 5 { middle = 5; }
    
    
    let red = ColourSpec::Spot(red_spot.clone());
    let green = ColourSpec::Spot(green_spot.clone());
    
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
