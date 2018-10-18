use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use debug::testcards::closuresource::{ ClosureSource, closure_add };
use composit::{ StateFixed, Component, StateValue };
use controller::global::Global;
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, pin_texture, stretch_rectangle };
use types::{ Colour, cleaf, cpixel, A_TOPLEFT, area };

pub fn testcard_leftright(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();
    let font = FCFont::new(60,"Lato",FontVariety::Normal);
    let cs = ClosureSource::new(move |lc,leaf| {
        let i = leaf.get_index();
        let (colour,offset) = if i % 2 == 0 {
            (ColourSpec::Colour(Colour(255,0,0)),0)
        } else {
            (ColourSpec::Colour(Colour(0,255,0)),10)
        };
        let tx = text_texture(&format!("{}",i),&font,&Colour(199,208,213),&Colour(255,255,255));
        closure_add(lc,&pin_texture(tx,&cleaf(0.,1),
                    &cpixel(0,10),&cpixel(1,1).anchor(A_TOPLEFT)));
        closure_add(lc,&stretch_rectangle(&area(
                        cleaf(0.,offset),
                        cleaf(1.,offset+10),
                     ),&colour));        
    });

    let c = Component::new(Box::new(cs.clone()),Rc::new(StateFixed(StateValue::On())));

    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
        });
    });
}
