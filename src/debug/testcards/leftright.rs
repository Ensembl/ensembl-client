use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ StateFixed, Component, StateValue, FixedSource, Leaf };
use controller::global::Global;
use controller::input::Event;
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_rectangle, pin_texture, stretch_rectangle };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT, area };

pub fn testcard_leftright(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let mut fs = FixedSource::new();
    let font = FCFont::new(120,"Lato",FontVariety::Normal);
    for i in 0..10 {
        let leaf = Leaf::new(i);
        let (colour,offset) = if i % 2 == 0 {
            (ColourSpec::Colour(Colour(255,0,0)),0)
        } else {
            (ColourSpec::Colour(Colour(0,255,0)),10)
        };
        let tx = text_texture(&format!("{}",i),&font,&Colour(199,208,213),&Colour(255,255,255));
        fs.add_shape(&leaf,pin_texture(tx,&cleaf(0.,1),
                    &cpixel(0,10),&cpixel(1,1).anchor(A_TOPLEFT)));
        fs.add_shape(&leaf,stretch_rectangle(&area(
                        cleaf(0.,offset),
                        cleaf(1.,offset+10),
                     ),&colour));
        g.with_state(|s| {
            s.with_compo(|co| {
                co.add_leaf(leaf);
            });
        });
    }
    let c = Component::new(Box::new(fs.clone()),Rc::new(StateFixed(StateValue::On())));

    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
        });
        //s.run_events(vec!{ Event::Zoom(0.) });
    });
}
