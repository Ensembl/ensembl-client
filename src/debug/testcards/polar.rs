use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{ StateFixed, Component, StateValue, StateAtom };
use controller::global::Global;
use controller::input::Event;
use debug::testcards::common::track_data;
use drawing::{
    mark_rectangle, text_texture, collage, Mark, Artist,
    FCFont, FontVariety
};
use separator::Separatable;
use shape::{
    fix_rectangle, fix_texture, page_rectangle,
    fixundertape_rectangle, fixundertape_texture,
    fixunderpage_rectangle, fixunderpage_texture,
    page_texture, pin_texture,  pin_mathsshape,
    stretch_rectangle, stretch_texture, stretch_wiggle,
    Spot, ColourSpec, MathsShape, tape_mathsshape,
    tape_rectangle, tape_texture
};
use types::{ 
    Colour, cleaf, cpixel, area_size, area, cedge,
    TOPLEFT, TOPRIGHT, Dot, AxisSense, Corner, 
    A_MIDDLE, A_LEFT, A_TOPLEFT, A_RIGHT,
};

const TRACKS: i32 = 20;
const PITCH : i32 = 63;
const TOP   : i32 = 50;

struct Palette {
    lato_12: FCFont,
    lato_18: FCFont,
    white: ColourSpec,
    grey: ColourSpec
}

fn one_offs(_c: &mut Component, _p: &Palette) {    
}

fn draw_frame(c: &mut Component,edge: AxisSense, p: &Palette) {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    let top = Corner(edge,AxisSense::Pos);
    let bottom = Corner(edge,AxisSense::Neg);
    
    /* top/bottom */
    c.add_shape(fixundertape_rectangle(&area(cedge(left,cpixel(0,1)),
                                    cedge(right,cpixel(0,18))),
                        &p.white).create());
    c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,2)),
                                    cedge(left,cpixel(36,16))),
                                &p.white).create());
    c.add_shape(fix_rectangle(&area(cedge(left,cpixel(36,1)),
                                    cedge(left,cpixel(37,17))),
                                &p.grey).create());
    let tx = text_texture("bp",
                          &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
    c.add_shape(fix_texture(tx,&cedge(left,cpixel(34,9)),
                            &cpixel(1,1).anchor(A_RIGHT)));
    for y in [0,17].iter() {
        c.add_shape(fix_rectangle(&area(cedge(left,cpixel(0,*y)),
                                        cedge(right,cpixel(0,*y+1))),
                            &p.grey).create());
    }

    /* left/right */
    c.add_shape(fixunderpage_rectangle(&area(cedge(top,cpixel(0,18)),
                                    cedge(bottom,cpixel(36,18))),
                        &p.white).create());
}

fn measure(c: &mut Component,edge: AxisSense, p: &Palette) {
    for x in -10..10 {
        c.add_shape(tape_rectangle(
            &cleaf(x as f32*100.,0),
            &area_size(cpixel(0,1),cpixel(1,18)).y_edge(edge,edge),
            &p.grey).create());
        let tx = text_texture(&format!("{}",((x+20)*100000).separated_string()),
                              &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
        c.add_shape(tape_texture(tx,&cleaf(x as f32*100.,4).y_edge(edge),
                                 &cpixel(4,6),&cpixel(1,1).anchor(A_LEFT)));
    }
}

fn data(t: i32) -> Vec<f32> {
    track_data(match t % 4 {
        0 => "rosabelle believe",
        1 => "england expects",
        2 => "hello world",
        _ => "hwat we gardena in geardagum"
    })
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
                                   &ColourSpec::Colour(Colour(75,168,252))).create());
    }
    let d = data(t);
    let st = (t as f32).cos() * -10. - 100.;
    let mut x = st;
    let y = t*PITCH+TOP;
    for v in &d {
        if t < 4 || t % 3 == 0 { // gene
            if *v > 0. {
                c.add_shape(stretch_rectangle(
                        &area_size(cleaf(x,y-3),
                                   cleaf(*v,6)),
                        &ColourSpec::Colour(Colour(75,168,252))).create());
            }
            x += v.abs();
        } else {
            let w = ((x as f32)*10.).cos();
            let col = ColourSpec::Colour(if t == 4 {
                if *v > 0. {
                    if w > 0.3 {
                        Colour(244,228,55)
                    } else if w < -0.3 {
                        Colour(55,244,228)
                    } else {
                        Colour(228,55,244)
                    }
                } else {
                    Colour(190,219,213)
                }
            } else if t % 3 == 1 {
                if *v > 0. {
                    if w > 0. {
                        Colour(255,192,192)
                    } else {
                        Colour(255,64,64)
                    }
                } else {
                    Colour(255,255,255)
                }
            } else {
                if *v > 0. {
                    Colour(192,192,192)
                } else {
                    Colour(220,220,220)
                }
            });
            c.add_shape(stretch_rectangle(
                    &area_size(cleaf(x,y-3),
                               cleaf(v.abs(),6)),
                    &col).create());
            x += v.abs();            
        }
    }
    if t < 4 || t % 3 == 0 { // gene
        c.add_shape(stretch_rectangle(
                        &area_size(cleaf(st,y-1),cleaf(x-st,2)),
                        &ColourSpec::Colour(Colour(75,168,252))).create());
    }
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let p = g.with_state(|s| {
        s.with_compo(|c| Palette {
            lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
            lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
            white: ColourSpec::Spot(Spot::new(c,&Colour(255,255,255))),
            grey: ColourSpec::Spot(Spot::new(c,&Colour(199,208,213)))
        })
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
    g.with_state(|s| {
        s.with_compo(|co| { co.add_component(c); });
        s.run_events(vec!{ Event::Zoom(2.5) });
    });
}
