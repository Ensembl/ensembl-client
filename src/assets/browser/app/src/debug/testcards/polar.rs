#![allow(unused)]
use std::cmp::{ min, max };
use std::iter::repeat;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use composit::{
    StateFixed, StateValue, StateAtom, Leaf, Carriage, SourceResponse,
    Stick
};
use controller::global::App;
use debug::support::DebugSourceType;
use debug::testcards::common::{
    track_data, rng_pos, prop, rng_seq
};
use debug::testcards::rulergenerator::RulerGenerator;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{
    mark_rectangle, text_texture, collage, Mark, Artist,
    FCFont, FontVariety
};
use shape::{
    pin_mathsshape,
    stretch_texture, stretch_wiggle,
    ColourSpec, MathsShape, tape_mathsshape,
    PinRectTypeSpec, StretchRectTypeSpec,
    ShapeInstanceData, Facade, TypeToShape,
    TextureTypeSpec
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
    let left = Corner(AxisSense::Max,edge);
    let right = Corner(AxisSense::Min,edge);
    let top = Corner(edge,AxisSense::Max);
    let bottom = Corner(edge,AxisSense::Min);
    
    /* top/bottom */
    let prts = PinRectTypeSpec {
        sea_x: Some((AxisSense::Max,AxisSense::Min)),
        sea_y: Some((edge,edge)),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: Some(false),
        spot: true
    };
    closure_add(lc,&prts.new_shape(&ShapeInstanceData {
        pos_x: 0.,
        pos_y: 1,
        aux_x: 0.,
        aux_y: 18,
        facade: Facade::Colour(Colour(255,255,255))
    }));        

    let prts = PinRectTypeSpec {
        sea_x: Some((AxisSense::Max,AxisSense::Max)),
        sea_y: Some((edge,edge)),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: None,
        spot: true
    };

    closure_add(lc,&prts.new_shape(&ShapeInstanceData {
        pos_x: 0.,
        pos_y: 2,
        aux_x: 36.,
        aux_y: 16,
        facade: Facade::Colour(Colour(255,255,255))
    }));
    closure_add(lc,&prts.new_shape(&ShapeInstanceData {
        pos_x: 36.,
        pos_y: 1,
        aux_x: 1.,
        aux_y: 16,
        facade: Facade::Colour(Colour(199,208,213))
    }));


    let prts = PinRectTypeSpec {
        sea_x: Some((AxisSense::Max,AxisSense::Min)),
        sea_y: Some((edge,edge)),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: None,
        spot: true
    };

    for y in [0,17].iter() {
        closure_add(lc,&prts.new_shape(&ShapeInstanceData {
            pos_x: 0.,
            pos_y: *y,
            aux_x: 0.,
            aux_y: 1,
            facade: Facade::Colour(Colour(199,208,213))
        }));        
    }

    let tx = text_texture("bp",
                          &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));    
    let tts = TextureTypeSpec {
        sea_x: Some(AxisSense::Max),
        sea_y: Some(edge),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (None,0),
        under: None,
        scale_x: 1., scale_y: 1.
    };
    closure_add(lc,&tts.new_shape(&ShapeInstanceData {
        pos_x: 34.,
        pos_y: 10,
        aux_x: 0.,
        aux_y: 0,
        facade: Facade::Drawing(tx)
    }));

    /* left/right */
    let prts = PinRectTypeSpec {
        sea_x: Some((edge,edge)),
        sea_y: Some((AxisSense::Max,AxisSense::Min)),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: Some(true),
        spot: true
    };
    closure_add(lc,&prts.new_shape(&ShapeInstanceData {
        pos_x: 0.,
        pos_y: 18,
        aux_x: 36.,
        aux_y: 0,
        facade: Facade::Colour(Colour(255,255,255))
    }));        
}

fn measure(lc: &mut SourceResponse, leaf: &Leaf, edge: AxisSense, p: &Palette) {
    let mul = leaf.total_bp();
    let start_leaf = (leaf.get_index() as f64 * mul).floor() as i32;
    let end_leaf = (((leaf.get_index()+1) as f64) * mul).floor() as i32;
    

    let rg = RulerGenerator::new_leaf(leaf);
    let ruler = rg.ruler(MARK_TARGET,TICK_TARGET,TARGET,&[10,15,20,30]);
    
    let prts = PinRectTypeSpec {
        sea_x: None,
        sea_y: Some((edge,edge)),
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (Some(AxisSense::Min),0),
        under: None,
        spot: true
    };

    
    for (offset,height,text) in ruler {
        if let Some(text) = text {
            let tx = text_texture(&text,
                      &p.lato_12,&Colour(199,208,213),&Colour(255,255,255));            
            let tts = TextureTypeSpec {
                sea_x: None,
                sea_y: Some(edge),
                ship_x: (Some(AxisSense::Max),0),
                ship_y: (None,0),
                under: None,
                scale_x: 1., scale_y: 1.
            };
            closure_add(lc,&tts.new_shape(&ShapeInstanceData {
                pos_x: offset as f32,
                pos_y: 10,
                aux_x: 4.,
                aux_y: 0,
                facade: Facade::Drawing(tx)
            }));
            closure_add(lc,&prts.new_shape(&ShapeInstanceData {
                pos_x: offset,
                pos_y: 0,
                aux_x: 1.,
                aux_y: 17,
                facade: Facade::Colour(Colour(199,208,213))
            }));
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

fn choose_colour(t: i32, x: f32) -> Colour {
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
    Colour(r,g,b)
}

fn draw_gene_part(lc: &mut SourceResponse, x: f32, y: i32, v: f32) {
    if v > 0. {
        let srts = StretchRectTypeSpec { spot: true, hollow: false };
        closure_add(lc,&srts.new_shape(&ShapeInstanceData {
            pos_x: x,
            pos_y: y-3,
            aux_x: v,
            aux_y: 5,
            facade: Facade::Colour(Colour(75,168,252))
        }));
    }
}

fn draw_varreg_part(lc: &mut SourceResponse, t: i32, x: f32, y: i32, v: f32, col: Colour) {
    if v > 0. {
        let srts = StretchRectTypeSpec { spot: true, hollow: false };
        closure_add(lc,&srts.new_shape(&ShapeInstanceData {
            pos_x: x,
            pos_y: y-3,
            aux_x: v.abs(),
            aux_y: 6,
            facade: Facade::Colour(col)
        }));
    }
}

const BLOCK_TARGET : usize = 200;
const BUCKETS : &[usize] = &[500,1000,5000];

fn try_bucket(leaf: &Leaf,starts_rng: &Vec<[i32;2]>, buckets: usize) -> Vec<(f32,f32,f32,f32)> {
    let mut buc : Vec<(bool,f32,f32,f32)> = 
                    repeat((false,1.0,0.0,0.0)).take(buckets).collect();
    for pos in starts_rng {
        let start_p = prop(leaf,pos[0]);
        let start_b = ((start_p*buckets as f32) as usize).max(0);
        let end_p = prop(leaf,pos[1]);
        let end_b = ((end_p*buckets as f32) as usize).min(buckets-1);
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

fn track_meta(lc: &mut SourceResponse, p: &Palette, t: i32) {
    let name = if t % 7 == 3 { "E" } else { "K" };
    let tx = text_texture(name,&p.lato_18,
                          &Colour(96,96,96),&Colour(255,255,255));
    let tts = TextureTypeSpec {
        sea_x: Some(AxisSense::Max),
        sea_y: None,
        ship_x: (Some(AxisSense::Min),0),
        ship_y: (None,0),
        under: None,
        scale_x: 1., scale_y: 1.
    };
    closure_add(lc,&tts.new_shape(&ShapeInstanceData {
        pos_x: 30 as f32,
        pos_y: t*PITCH+TOP,
        aux_x: 0.,
        aux_y: 0,
        facade: Facade::Drawing(tx)
    }));
}

/* designed to fill most of 100kb scale */
fn track(lc: &mut SourceResponse, leaf: &Leaf, p: &Palette, t: i32, even: bool) {
    let is_gene = (t<4 || t%3 == 0);
    if is_gene == even { return; }
    /* focus track swatch */
    if t == 2 {

        let prts = PinRectTypeSpec {
            sea_x: Some((AxisSense::Max,AxisSense::Max)),
            sea_y: None,
            ship_x: (Some(AxisSense::Min),0),
            ship_y: (Some(AxisSense::Min),0),
            under: None,
            spot: true
        };

        closure_add(lc,&prts.new_shape(&ShapeInstanceData {
            pos_x: 0.,
            pos_y: t*PITCH-PITCH/3+TOP,
            aux_x: 6.,
            aux_y: 2*PITCH/3,
            facade: Facade::Colour(Colour(78,168,252))
        }));
    }
    let mul = leaf.total_bp();
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
    let total_bp = leaf.total_bp();
    if total_bp < 10. {
        // why?
    } else if total_bp < 1000. && is_gene {
        let h = if total_bp < 100. { 12 } else if total_bp < 200. { 6 } else { 4 };
        let t = if total_bp < 100. {  3 } else if total_bp < 200. { 2 } else { 0 };
        for (i,pos) in starts_rng.iter().enumerate() {
            let prop_start = prop(leaf,pos[0]);
            let prop_end = prop(leaf,pos[1]);
            if prop_end < 0. || prop_start > 1. { continue; }
            let seq = if total_bp < 200. {
                rng_seq([0,0,0,0,0,0,0,0],pos[0],pos[1])
            } else {
                "".to_string()
            };
            let data_len = d.iter().fold(-d[d.len()-1],|a,v| a+v.abs());
            let scale : f32 = (pos[1]-pos[0]) as f32/data_len as f32;
            for (i,bp) in (pos[0]..pos[1]).enumerate() {
                let cur_bp = prop(leaf,bp);
                let size_bp = prop(leaf,bp+1) - cur_bp;
                let prop_start = cur_bp - 0.45*size_bp;
                let prop_end = cur_bp + 0.45*size_bp;
                if prop_start < 1. && prop_end > 0. {                    
                    let mut exonic = false;
                    let mut x = 0.;
                    for v in &d {
                        let x_start = pos[0] as f32+x as f32;
                        let x_end = x_start+*v*scale;
                        if bp as f32 >= x_start && bp as f32 <= x_end {
                            exonic = true;
                        }
                        x += v.abs() * scale;
                    }
                    if exonic {
                        let srts = StretchRectTypeSpec { spot: true, hollow: false };
                        closure_add(lc,&srts.new_shape(&ShapeInstanceData {
                            pos_x: prop_start,
                            pos_y: y-h,
                            aux_x: prop_end-prop_start,
                            aux_y: 2*h,
                            facade: Facade::Colour(Colour(75,168,252))
                        }));
                    } else {
                        let mut col = Colour(75,168,252);
                        if t == 0 { col = Colour(205,231,254); }
                        let srts = StretchRectTypeSpec { spot: true, hollow: true };
                        closure_add(lc,&srts.new_shape(&ShapeInstanceData {
                            pos_x: prop_start,
                            pos_y: y-h,
                            aux_x: prop_end-prop_start,
                            aux_y: 2*h,
                            facade: Facade::Colour(col)
                        }));
                    }
                    if t > 0 {
                        let mut blue = Colour(75,168,252);
                        let mut white = Colour(255,255,255);
                        let (fgd,bgd) = if exonic { (white,blue) } else { (blue,white) };                        
                        let tx = text_texture(&seq[i..i+1],&p.lato_18,&fgd,&bgd);
                        let tts = TextureTypeSpec {
                            sea_x: None,
                            sea_y: None,
                            ship_x: (None,0),
                            ship_y: (None,0),
                            under: None,
                            scale_x: 1., scale_y: 1.
                        };
                        closure_add(lc,&tts.new_shape(&ShapeInstanceData {
                            pos_x: (prop_start+prop_end)/2.,
                            pos_y: y+t,
                            aux_x: 0.,
                            aux_y: 0,
                            facade: Facade::Drawing(tx)
                        }));
                    }
                }
            }
        }  
    } else if total_bp < 2000000. {
        for (i,pos) in starts_rng.iter().enumerate() {
            let prop_start = prop(leaf,pos[0]);
            let prop_end = prop(leaf,pos[1]);
            if prop_end < 0. || prop_start > 1. { continue; }
            let data_len = d.iter().fold(-d[d.len()-1],|a,v| a+v.abs());
            let mut x = 0.;
            let scale : f32 = (pos[1]-pos[0]) as f32/data_len as f32;
            if prop_end-prop_start > 0.1 {
                for v in &d {
                    let x_genome = pos[0] as f32+x as f32;
                    let x_start = prop(leaf,x_genome as i32);
                    let x_end = prop(leaf,(x_genome+*v*scale) as i32);
                    if is_gene {
                        if x == 0. {
                            let x_all_end = prop(leaf,pos[1]);
                            let srts = StretchRectTypeSpec { spot: true, hollow: false };
                            closure_add(lc,&srts.new_shape(&ShapeInstanceData {
                                pos_x: x_start,
                                pos_y: y-1,
                                aux_x: x_all_end-x_start,
                                aux_y: 2,
                                facade: Facade::Colour(Colour(75,168,252))
                            }));
                        }
                        draw_gene_part(lc,x_start,y,x_end-x_start);
                    } else {
                        let col = choose_colour(t,x_genome);
                        draw_varreg_part(lc,t,x_start,y,x_end-x_start,col);
                    }
                    x += v.abs() * scale;
                }
            } else if prop_end-prop_start > 0.0002 {
                let mut colour = if is_gene {
                    Colour(75,168,252)
                } else if t == 4 {
                    Colour(190,219,213)
                } else if t%3 == 1 {
                    Colour(255,64,64)
                } else {
                    Colour(192,192,192)
                };
                let srts = StretchRectTypeSpec { spot: true, hollow: false };
                closure_add(lc,&srts.new_shape(&ShapeInstanceData {
                    pos_x: prop_start,
                    pos_y: y-3,
                    aux_x: prop_end-prop_start,
                    aux_y: 6,
                    facade: Facade::Colour(colour)
                }));                
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
            let srts = StretchRectTypeSpec { spot: false, hollow: false };
            closure_add(lc,&srts.new_shape(&ShapeInstanceData {
                pos_x: *m,
                pos_y: y-3,
                aux_x: *n-*m,
                aux_y: 6,
                facade: Facade::Colour(colour)
            }));            
        }
    }
}

pub fn polar_source(type_: &DebugSourceType) -> ClosureSource {
    let type_ = type_.clone();
    let p = Palette {
        lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
        lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
        white: ColourSpec::Spot(Colour(255,255,255)),
        grey: ColourSpec::Spot(Colour(199,208,213))
    };
    ClosureSource::new(0.,move |ref mut lc,leaf| {
        match type_ {
            DebugSourceType::Contig => {
                one_offs(lc,&p);
                draw_frame(lc,&leaf,AxisSense::Max,&p);
                draw_frame(lc,&leaf,AxisSense::Min,&p);
                measure(lc,&leaf,AxisSense::Max,&p);
                measure(lc,&leaf,AxisSense::Min,&p);
                for t in 0..TRACKS {
                    track_meta(lc,&p,t);
                }
            },
            DebugSourceType::Variant => {
                for t in 0..TRACKS {
                    track(lc,&leaf,&p,t,true);
                }
            },
            DebugSourceType::GC => {
                for t in 0..TRACKS {
                    track(lc,&leaf,&p,t,false);
                }
            },
            _ => ()
        }
        closure_done(lc,TRACKS*PITCH+TOP);
    })
}
