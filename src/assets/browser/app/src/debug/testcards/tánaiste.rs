#![allow(unused)]
use std::cmp::{ min, max };
use std::iter::repeat;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use tánaiste::Value;

use composit::{
    StateFixed, StateValue, StateAtom, Leaf, Carriage, SourceResponse,
    Stick, Source
};
use controller::global::App;
use data::{ XferRequest, XferResponse };
use debug::support::{ DebugSourceType, DebugXferClerk, DebugXferResponder };
use debug::testcards::common::{
    track_data, rng_pos, prop, rng_seq, rng_flip
};
use debug::testcards::rulergenerator::RulerGenerator;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{
    mark_rectangle, text_texture, collage, Mark, Artist,
    FCFont, FontVariety
};
use shape::{
    pin_mathsshape, TypeToShape, ShapeInstanceData, Facade,
    stretch_texture, stretch_wiggle,
    ColourSpec, MathsShape, tape_mathsshape,
    PinRectTypeSpec, TextureTypeSpec
};
use tácode::{ Tácode, TáSource };
use types::{ 
    Colour, cleaf, cpixel, area_size, area, cedge,
    TOPLEFT, TOPRIGHT, Dot, AxisSense, Corner, 
    A_MIDDLE, A_LEFT, A_TOPLEFT, A_RIGHT,
};

const TRACKS: i32 = 8;
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
                pos_x: offset,
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

const SCALE : f32 = 400.;

const BLOCK_TARGET : usize = 200;
const BUCKETS : &[usize] = &[500,1000,5000];

fn track_meta(lc: &mut SourceResponse, p: &Palette, t: i32) {
    let name = if t == 7 { "V" } else { "G" };
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
        pos_x: 30.,
        pos_y: t*PITCH+TOP,
        aux_x: 0.,
        aux_y: 0,
        facade: Facade::Drawing(tx)
    }));
    if t == 0 {
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
}

pub struct TáCardData {
}

impl TáCardData {
    pub fn new() -> TáCardData {
        TáCardData {
        }
    }
}

pub fn tá_source_cs(type_: &DebugSourceType) -> impl Source {
    let type_ = type_.clone();
    let p = Palette {
        lato_12: FCFont::new(12,"Lato",FontVariety::Normal),
        lato_18: FCFont::new(12,"Lato",FontVariety::Bold),
        white: ColourSpec::Spot(Colour(255,255,255)),
        grey: ColourSpec::Spot(Colour(199,208,213))
    };
    match type_ {
        DebugSourceType::Framework => {
            ClosureSource::new(0.,move |ref mut lc,leaf| {
                one_offs(lc,&p);
                draw_frame(lc,&leaf,AxisSense::Max,&p);
                draw_frame(lc,&leaf,AxisSense::Min,&p);
                measure(lc,&leaf,AxisSense::Max,&p);
                measure(lc,&leaf,AxisSense::Min,&p);
                for t in 0..TRACKS {
                    track_meta(lc,&p,t);
                }
                closure_done(lc,TRACKS*PITCH+TOP);
            })
        },
        _ => {
            ClosureSource::new(0.,move |ref mut lc,leaf| {
                closure_done(lc,TRACKS*PITCH+TOP);
            })
        },
    }
}
