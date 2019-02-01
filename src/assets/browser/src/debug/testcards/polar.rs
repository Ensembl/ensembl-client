#![allow(unused)]
use std::cmp::{ min, max };
use std::iter::repeat;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::vscale_bp_per_leaf;
use composit::{
    StateFixed, StateValue, StateAtom, Leaf, Carriage, SourceResponse,
    Stick
};
use controller::global::App;
use controller::input::Event;
use debug::testcards::common::{
    track_data, rng_pos, prop, rng_seq
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
    ColourSpec::Spot(Colour(r,g,b))
}

fn draw_gene_part(lc: &mut SourceResponse, x: f32, y: i32, v: f32) {
    if v > 0. {
        closure_add(lc,&stretch_rectangle(
                &area_size(cleaf(x,y-3),
                           cleaf(v,6)),
                &ColourSpec::Spot(Colour(75,168,252))));
    }
}

fn draw_varreg_part(lc: &mut SourceResponse, t: i32, x: f32, y: i32, v: f32, col: ColourSpec) {
    closure_add(lc,&stretch_rectangle(
            &area_size(cleaf(x,y-3),
                       cleaf(v.abs(),6)),
            &col));
}

const BLOCK_TARGET : usize = 400;
const BUCKETS : &[usize] = &[500,1000,5000];

fn try_bucket(leaf: &Leaf,starts_rng: &Vec<[i32;2]>, buckets: usize) -> Vec<(f32,f32,f32,f32)> {
    let mut buc : Vec<(bool,f32,f32,f32)> = 
                    repeat((false,1.0,0.0,0.0)).take(buckets).collect();
    for pos in starts_rng {
        let start_p = prop(leaf,pos[0]);
        let start_b = max((start_p*buckets as f32) as usize,0);
        let end_p = prop(leaf,pos[1]);
        let end_b = min((end_p*buckets as f32) as usize,buckets-1);
        for i in start_b..end_b+1 {
            let start = buc[i].1.min(start_p);
            let end = buc[i].2.max(end_p);
            let density = buc[i].3 + end_p - start_p;
            buc[i] = (true,start,end,density);
        }
    }
    let mut blocks = Vec::<(f32,f32,f32,f32)>::new();
    let mut prev = false;
    for v in buc {
        if v.0 {
            if prev { 
                let e = blocks.len()-1;
                blocks[e].0 = blocks[e].0.min(v.1).max(0.);
                blocks[e].1 = blocks[e].1.max(v.2).min(1.);
                blocks[e].2 = blocks[e].2 + v.3;
                blocks[e].3 += 1.;
            } else {
                blocks.push((v.1.max(0.),v.2.min(1.),v.3,1.));
            }
        }
        prev = v.0;
    }
    blocks
}

fn get_blocks(leaf: &Leaf,starts_rng: &Vec<[i32;2]>) -> Vec<(f32,f32,f32,f32)> {
    let mut out = None;
    for buckets in BUCKETS {
        out = Some(try_bucket(leaf,&starts_rng,*buckets));
        if out.as_ref().unwrap().len() > BLOCK_TARGET { break; }
    }
    out.unwrap()
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
                             end_leaf+wiggle,100000,(100000.*pr) as i32);
    let d = data(t);
    let st = (t as f32).cos() * -10. - 100.;
    let mut x = st;
    let y = t*PITCH+TOP;
    let scale = leaf.get_vscale();
    if scale > 5 {
        // why?
    } else if scale > 1 {
        let h = if scale > 3 { 12 } else if scale > 2 { 6 } else { 4 };
        let t = if scale > 3 { 3 } else if scale > 2 { 2 } else { 0 };
        for (i,pos) in starts_rng.iter().enumerate() {
            let prop_start = prop(leaf,pos[0]);
            let prop_end = prop(leaf,pos[1]);
            if prop_end < 0. || prop_start > 1. { continue; }
            let seq = if scale > 2 {
                rng_seq([0,0,0,0,0,0,0,0],pos[0],pos[1])
            } else {
                "".to_string()
            };
            for (i,bp) in (pos[0]..pos[1]).enumerate() {
                let cur_bp = prop(leaf,bp);
                let size_bp = prop(leaf,bp+1) - cur_bp;
                let prop_start = cur_bp - 0.45*size_bp;
                let prop_end = cur_bp + 0.45*size_bp;
                if prop_start < 1. && prop_end > 0. {
                    closure_add(lc,&stretch_rectangle(
                                &area(cleaf(prop_start,y-h),
                                      cleaf(prop_end,y+h)),
                                &ColourSpec::Spot(Colour(75,168,252))));
                    if t > 0 {
                        let tx = text_texture(&seq[i..i+1],&p.lato_18,&Colour(255,255,255),&Colour(72,168,252));
                        closure_add(lc,&pin_texture(tx, &cleaf((prop_start+prop_end)/2.,y), &cpixel(0,t), &cpixel(1,1).anchor(A_MIDDLE)));
                    }
                }
            }
        }  
    } else if leaf.get_vscale() > -6 {
        for (i,pos) in starts_rng.iter().enumerate() {
            let prop_start = prop(leaf,pos[0]);
            let prop_end = prop(leaf,pos[1]);
            let data_len = d.iter().fold(-d[d.len()-1],|a,v| a+v.abs());
            let mut x = 0.;
            let scale : f32 = (pos[1]-pos[0]) as f32/data_len as f32;
            for v in &d {
                if prop_end-prop_start > 0.02 {
                    let x_genome = pos[0] as f32+x as f32;
                    let x_start = prop(leaf,x_genome as i32);
                    let x_end = prop(leaf,(x_genome+*v*scale) as i32);
                    if is_gene {
                        if x == 0. {
                            let x_all_end = prop(leaf,pos[1]);
                            closure_add(lc,&stretch_rectangle(
                                            &area(cleaf(x_start,y-1),cleaf(x_all_end,y+1)),
                                            &ColourSpec::Spot(Colour(75,168,252))));
                        }
                        draw_gene_part(lc,x_start,y,x_end-x_start);
                    } else {
                        let col = choose_colour(t,x_genome);
                        draw_varreg_part(lc,t,x_start,y,x_end-x_start,col);
                    }
                    x += v.abs() * scale;
                } else if prop_end-prop_start > 0.0001 {
                    let mut colour = if is_gene {
                        Colour(75,168,252)
                    } else if t == 4 {
                        Colour(190,219,213)
                    } else if t%3 == 1 {
                        Colour(255,64,64)
                    } else {
                        Colour(192,192,192)
                    };
                    closure_add(lc,&stretch_rectangle(
                        &area(cleaf(prop_start,y-3),cleaf(prop_end,y+3)),
                        &ColourSpec::Colour(colour)));
                }
            }
        }
    } else {
        let blocks = get_blocks(leaf,&starts_rng);
        let mut max_density = 0.0_f32;
        for (m,n,dn,dd) in blocks.iter() {
            let density = (dn/ (n-m)).min(1.);
            max_density = max_density.min(density);
        }
        for (m,n,dn,dd) in blocks.iter() {
            let mut col_hsl = if is_gene {
                Colour(75,168,252)
            } else if t == 4 {
                Colour(190,219,213)
            } else if t%3 == 1 {
                Colour(255,64,64)
            } else {
                Colour(192,192,192)
            }.to_hsl();
            let mul = if max_density < 0.5 { 1.5 } else { 1.0 };
            let mut density = ((dn/ (n-m))*mul).min(1.);
            if density < 0.95 { density = density.min(0.8); }
            if col_hsl[1] > 0.5 {
                col_hsl[1] = 0.5 + col_hsl[1] * 0.5 * (1.0 - density) as f64;
            }
            col_hsl[2] = col_hsl[2] + (1.-col_hsl[2]) * (1.0 - density) as f64;
            let colour = Colour::from_hsl(col_hsl);
            closure_add(lc,&stretch_rectangle(
                &area(cleaf(*m,y-3),cleaf(*n,y+3)),
                &ColourSpec::Colour(colour)));
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
    ClosureSource::new(0.,move |ref mut lc,leaf| {
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
