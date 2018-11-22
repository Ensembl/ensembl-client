use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ StateFixed, Component, StateValue, Stick, Source };
use controller::global::Global;
use controller::input::Event;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_rectangle, tape_texture };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

pub fn text_source() -> impl Source {
    let font = FCFont::new(120,"Lato",FontVariety::Normal);
    ClosureSource::new(0.,move |lc,leaf| {
        let tx = text_texture("hello",&font,&Colour(199,208,213),&Colour(0,0,0));
        closure_add(lc,&tape_rectangle(
            &cleaf(0.,0),
            &area_size(cpixel(-50,1),cpixel(400,400)).y_edge(AxisSense::Pos,AxisSense::Pos),
            &ColourSpec::Colour(Colour(150,0,0))));

        closure_add(lc,&tape_texture(tx,&cleaf(0.,100).y_edge(AxisSense::Pos),
                    &cpixel(0,0),&cpixel(1,1).anchor(A_TOPLEFT)));
        closure_done(lc,200);
    })
}
