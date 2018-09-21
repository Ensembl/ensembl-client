use std::sync::{ Arc, Mutex };
use std::clone::Clone;
use drawing::FCFont;
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

pub fn testcard_text(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let mut c = Component::new(Rc::new(StateFixed(StateValue::On())));
 
    let font = FCFont::new(120,"Lato");
    let tx = text_texture("hello",&font,&Colour(199,208,213));
    c.add_shape(tape_rectangle(
        &cleaf(0.,0),
        &area_size(cpixel(-50,1),cpixel(400,400)).y_edge(AxisSense::Pos,AxisSense::Pos),
        &ColourSpec::Colour(Colour(50,0,0))));

    c.add_shape(tape_texture(tx,&cleaf(0.,100).y_edge(AxisSense::Pos),&cpixel(1,1)));


    g.with_compo(|co| {
        co.add_component(c);
    });

    g.add_events(vec!{ Event::Zoom(2.5) });
}
