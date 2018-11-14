#![allow(unused)]
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{
    StateFixed, Component, StateValue, StateAtom, Leaf,
    LeafComponent
};
use controller::global::Global;
use controller::input::Event;
use debug::testcards::common::track_data;
use debug::testcards::closuresource::{ ClosureSource, closure_add };
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
    ColourSpec, MathsShape, tape_mathsshape,
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

fn one_offs(_lc: &mut LeafComponent, _p: &Palette) {    
}

fn draw_frame(lc: &mut LeafComponent, leaf: &Leaf, edge: AxisSense, p: &Palette) {
    let left = Corner(AxisSense::Pos,edge);
    let right = Corner(AxisSense::Neg,edge);
    let top = Corner(edge,AxisSense::Pos);
    let bottom = Corner(edge,AxisSense::Neg);
    
    /* top/bottom */
    closure_add(lc,&fixundertape_rectangle(&area(cedge(left,cpixel(0,1)),
                                    cedge(right,cpixel(0,18))),
                        &p.white));
    closure_add(lc,&fix_rectangle(&area(cedge(left,cpixel(0,2)),
                                    cedge(left,cpixel(36,16))),
                                &p.white));
    closure_add(lc,&fix_rectangle(&area(cedge(left,cpixel(36,1)),
                                    cedge(left,cpixel(37,17))),
                                &p.grey));
    let tx = text_texture("bp",
                          &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
    closure_add(lc,&fix_texture(tx,&cedge(left,cpixel(34,10)),
                            &cpixel(0,0),
                            &cpixel(1,1).anchor(A_RIGHT)));
    for y in [0,17].iter() {
        closure_add(lc,&fix_rectangle(&area(cedge(left,cpixel(0,*y)),
                                        cedge(right,cpixel(0,*y+1))),
                            &p.grey));
    }

    /* left/right */
    closure_add(lc,&fixunderpage_rectangle(&area(cedge(top,cpixel(0,18)),
                                    cedge(bottom,cpixel(36,18))),
                        &p.white));
}

fn measure(lc: &mut LeafComponent, leaf: &Leaf, edge: AxisSense, p: &Palette) {
    let b = leaf.get_index();
    for x in 0..10 {
        closure_add(lc,&tape_rectangle(
            &cleaf(x as f32/10.,0),
            &area_size(cpixel(0,1),cpixel(1,17)).y_edge(edge,edge),
            &p.grey));
        let tx = text_texture(&format!("{}",((10*b+x+20)*100000).separated_string()),
                              &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
        closure_add(lc,&tape_texture(tx,&cleaf(x as f32/10.,9).y_edge(edge),
                                 &cpixel(4,1),&cpixel(1,1).anchor(A_LEFT)));
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

fn track(lc: &mut LeafComponent, leaf: &Leaf, p: &Palette, t: i32) {
    let name = if t % 7 == 3 { "E" } else { "K" };
    let tx = text_texture(name,&p.lato_18,
                          &Colour(96,96,96),&Colour(255,255,255));
    closure_add(lc,&page_texture(tx,&cedge(TOPLEFT,cpixel(30,t*PITCH+TOP)),
                                &cpixel(0,0),
                                &cpixel(1,1).anchor(A_RIGHT)));
    if t == 2 {
        closure_add(lc,&page_rectangle(&area(cpixel(0,t*PITCH-PITCH/3+TOP).x_edge(AxisSense::Pos),
                                         cpixel(6,t*PITCH+PITCH/3+TOP).x_edge(AxisSense::Pos)),
                                   &ColourSpec::Colour(Colour(75,168,252))));
    }
    let d = data(t);
    let st = (t as f32).cos() * -10. - 100.;
    let mut x = st;
    let y = t*PITCH+TOP;
    for v in &d {
        if t < 4 || t % 3 == 0 { // gene
            if *v > 0. {
                closure_add(lc,&stretch_rectangle(
                        &area_size(cleaf(x/1000.,y-3),
                                   cleaf(*v/1000.,6)),
                        &ColourSpec::Colour(Colour(75,168,252))));
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
            closure_add(lc,&stretch_rectangle(
                    &area_size(cleaf(x/1000.,y-3),
                               cleaf(v.abs()/1000.,6)),
                    &col));
            x += v.abs();            
        }
    }
    if t < 4 || t % 3 == 0 { // gene
        closure_add(lc,&stretch_rectangle(
                        &area_size(cleaf(st/1000.,y-1),cleaf((x-st)/1000.,2)),
                        &ColourSpec::Colour(Colour(75,168,252))));
    }
}

pub fn testcard_polar(g: Arc<Mutex<Global>>) {
    let g = &mut g.lock().unwrap();

    let leaf = Leaf::new(0,0);
    let p = Palette {
        lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
        lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
        white: ColourSpec::Spot(Colour(255,255,255)),
        grey: ColourSpec::Spot(Colour(199,208,213))
    };
    
    let cs = ClosureSource::new(move |ref mut lc,leaf| {
        one_offs(lc,&p);
        draw_frame(lc,&leaf,AxisSense::Pos,&p);
        draw_frame(lc,&leaf,AxisSense::Neg,&p);
        measure(lc,&leaf,AxisSense::Pos,&p);
        measure(lc,&leaf,AxisSense::Neg,&p);
        for t in 0..TRACKS {
            track(lc,&leaf,&p,t);
        }
    });
    let c = Component::new(Box::new(cs.clone()),Rc::new(StateFixed(StateValue::On())));
    g.with_state(|s| {
        s.with_compo(|co| {
            co.add_component(c);
        });
        s.run_events(vec!{ Event::Zoom(0.) });
    });
}
