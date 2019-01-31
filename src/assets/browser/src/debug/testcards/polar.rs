#![allow(unused)]
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::vscale_bp_per_leaf;
use composit::{
    StateFixed, StateValue, StateAtom, Leaf,
    Carriage, SourceResponse, Stick
};
use controller::global::App;
use controller::input::Event;
use debug::testcards::common::{
    track_data, rng_pos, prop
};
use debug::testcards::rulergenerator::RulerGenerator;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
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

const TARGET: i32 = 20;
const TICK_TARGET: i32 = 20;
const MARK_TARGET: i32 = 20;

struct Palette {
    lato_12: FCFont,
    lato_18: FCFont,
    white: ColourSpec,
    grey: ColourSpec
}

fn one_offs(_lc: &mut SourceResponse, _p: &Palette) {    
}

fn draw_frame(lc: &mut SourceResponse, leaf: &Leaf, edge: AxisSense, p: &Palette) {
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

fn measure(lc: &mut SourceResponse, leaf: &Leaf, edge: AxisSense, p: &Palette) {
    let mul = vscale_bp_per_leaf(leaf.get_vscale());
    let start_leaf = (leaf.get_index() as f64 * mul).floor() as i32;
    let end_leaf = (((leaf.get_index()+1) as f64) * mul).floor() as i32;
    

    let rg = RulerGenerator::new_leaf(leaf);
    let ruler = rg.ruler(MARK_TARGET,TICK_TARGET,TARGET,&[10,15,20,30]);
    for (offset,height,text) in ruler {
        if let Some(text) = text {
            let tx = text_texture(&text,
                      &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));
            closure_add(lc,&tape_texture(tx,&cleaf(offset as f32,9).y_edge(edge),
                 &cpixel(4,1),&cpixel(1,1).anchor(A_LEFT)));
            closure_add(lc,&tape_rectangle(
                &cleaf(offset as f32,0),
                &area_size(cpixel(0,1),cpixel(1,17)).y_edge(edge,edge),
                &p.grey));
        }
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

const SCALE : f32 = 400.;

fn choose_colour(t: i32, x: f32) -> ColourSpec {
    let v = x.cos();
    let w = x.sin();
    let (r,g,b) = (if t == 4 {
        /* coloured variant track */
        if v > 0. {
            if w > 0.3 {
                (244,228,55)
            } else if w < -0.3 {
                (55,244,228)
            } else {
                (228,55,244)
            }
        } else {
            (190,219,213)
        }
    } else if t % 3 == 1 {
        /* regulation track */
        if v > 0. {
            if w > 0. { (255,192,192) } else { (255,64,64) }
        } else {
            (255,255,255)
        }
    } else {
        /* monochrome variant track */
        if v > 0. { (192,192,192) } else { (220,220,220) }
    });
    ColourSpec::Colour(Colour(r,g,b))
}

fn draw_gene_part(lc: &mut SourceResponse, x: f32, y: i32, v: f32) {
    if v > 0. {
        closure_add(lc,&stretch_rectangle(
                &area_size(cleaf(x,y-3),
                           cleaf(v,6)),
                &ColourSpec::Colour(Colour(75,168,252))));
    }
}

fn draw_varreg_part(lc: &mut SourceResponse, t: i32, x: f32, y: i32, v: f32, col: ColourSpec) {
    closure_add(lc,&stretch_rectangle(
            &area_size(cleaf(x,y-3),
                       cleaf(v.abs(),6)),
            &col));
}

/* designed to fill most of 100kb scale */
fn track(lc: &mut SourceResponse, leaf: &Leaf, p: &Palette, t: i32) {
    let is_gene = (t<4 || t%3 == 0);
    let name = if t % 7 == 3 { "E" } else { "K" };
    let tx = text_texture(name,&p.lato_18,
                          &Colour(96,96,96),&Colour(255,255,255));
    closure_add(lc,&page_texture(tx,&cedge(TOPLEFT,cpixel(30,t*PITCH+TOP)),
                                &cpixel(0,0),
                                &cpixel(1,1).anchor(A_RIGHT)));
    /* focus track swatch */
    if t == 2 {
        closure_add(lc,&page_rectangle(&area(cpixel(0,t*PITCH-PITCH/3+TOP).x_edge(AxisSense::Pos),
                                         cpixel(6,t*PITCH+PITCH/3+TOP).x_edge(AxisSense::Pos)),
                                   &ColourSpec::Colour(Colour(75,168,252))));
    }
    let mul = vscale_bp_per_leaf(leaf.get_vscale());
    let start_leaf = (leaf.get_index() as f64 * mul).floor() as i32;
    let end_leaf = ((leaf.get_index()+1) as f64 * mul).ceil() as i32;
    let wiggle = 1000000;
    let pr = if is_gene { 0.1 } else { 0.5 };
    let starts_rng = rng_pos([t as u8,0,0,0,0,0,0,8],start_leaf-wiggle,
                             end_leaf,100000,(100000.*pr) as i32);
    let d = data(t);
    let st = (t as f32).cos() * -10. - 100.;
    let mut x = st;
    let y = t*PITCH+TOP;
    for (i,pos) in starts_rng.iter().enumerate() {
        let prop_start = prop(leaf,pos[0]);
        let prop_end = prop(leaf,pos[1]);
        let data_len = d.iter().fold(-d[d.len()-1],|a,v| a+v.abs());
        let mut x = 0.;
        let scale : f32 = (pos[1]-pos[0]) as f32/data_len as f32;
        for v in &d {
            if prop_end-prop_start > 0.01 {
                let x_genome = pos[0] as f32+x as f32;
                let x_start = prop(leaf,x_genome as i32);
                let x_end = prop(leaf,(x_genome+*v*scale) as i32);
                if is_gene {
                    if x == 0. {
                        let x_all_end = prop(leaf,pos[1]);
                        closure_add(lc,&stretch_rectangle(
                                        &area(cleaf(x_start,y-1),cleaf(x_all_end,y+1)),
                                        &ColourSpec::Colour(Colour(75,168,252))));
                    }
                    draw_gene_part(lc,x_start,y,x_end-x_start);
                } else {
                    let col = choose_colour(t,x_genome);
                    draw_varreg_part(lc,t,x_start,y,x_end-x_start,col);
                }
                x += v.abs() * scale;
            } else {
                if is_gene {
                    draw_gene_part(lc,prop_start,y,prop_end-prop_start);
                } else {
                    let col = choose_colour(t,prop_start);
                    draw_varreg_part(lc,t,prop_start,y,prop_end-prop_start,col);
                }
            }
        }
    }
}

pub fn polar_source() -> ClosureSource {
    let p = Palette {
        lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
        lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
        white: ColourSpec::Spot(Colour(255,255,255)),
        grey: ColourSpec::Spot(Colour(199,208,213))
    };
    ClosureSource::new(0.5,move |ref mut lc,leaf| {
        one_offs(lc,&p);
        draw_frame(lc,&leaf,AxisSense::Pos,&p);
        draw_frame(lc,&leaf,AxisSense::Neg,&p);
        measure(lc,&leaf,AxisSense::Pos,&p);
        measure(lc,&leaf,AxisSense::Neg,&p);
        for t in 0..TRACKS {
            track(lc,&leaf,&p,t);
        }
        closure_done(lc,TRACKS*PITCH+TOP);
    })
}
