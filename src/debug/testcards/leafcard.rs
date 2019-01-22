use std::cmp::{ min, max };
use std::collections::HashSet;
use std::f64;
use std::ops::Range;
use std::rc::Rc;

use separator::Separatable;

use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use composit::{ vscale_bp_per_leaf, Source };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, pin_texture, stretch_rectangle, pin_rectangle };
use types::{ Colour, cleaf, cpixel, A_TOP, area, area_size };

const TARGET: i32 = 20;
const MARK_TARGET: i32 = 1000;

const EPSILON : f64 = 0.00000001;

const BY125 : &[f64] = &[0.05,0.1,0.2,0.5,1.,2.,5.,10.,20.];
const BY12 : &[f64] =  &[     0.1,0.2,    1.,   5.,10.    ];
const BY15 : &[f64] =  &[0.05,0.1,    0.5,1.,2.,   10.,20.];
const BY1 : &[f64] =   &[     0.1,        1.,      10.    ];

fn goby(start: f64, bp_leaf: f64, target: i32, by: &[f64]) -> f64 {
    let approx = 10_i64.pow((bp_leaf/5.).log10().round() as u32) as f64;
    for mul in by {
        let step = approx*mul;
        let end = start+bp_leaf;
        let start_round = (start/step).round();
        let end_round = (end/step).round();
        let num = (end_round-start_round+1.).floor();
        if num < target.into() { return step; }
    }
    approx
}

fn range(start: f64, bp_leaf: f64, target: i32, by: &[f64]) -> impl Iterator<Item=i64> {
    let step = goby(start,bp_leaf,target,by);
    let end = start+bp_leaf;
    ((start/step).ceil() as i64 .. (end/step).floor() as i64+1)
        .map(move |x| x*step as i64)
}

fn round_sf(value: f64, sf: i32) -> f64 {
    if value == 0. { return 0.; }
    let mag = 10_f64.powi(value.abs().log10().trunc() as i32+1-sf);
    (value/mag).floor()*mag
}

fn common_sf(a: f64, b: f64) -> i32 {
    for i in 2..50 {
        if round_sf(a,i) != round_sf(b,i) { return i-1; }
    }
    50
}

fn nudge_format(v: f64, mut eps: i64) -> f64 {
    if v == 0.0 { eps = 0 }
    let bits = ((v.to_bits() as i64)+eps) as u64;
    f64::from_bits(bits)
}

fn find_short(mut a: f64, mut b:f64) -> String {
    let mut out = String::new();
    let mut divs: i32 = 0;
    while a >= 1. || b >= 1. {
        divs += 1;
        a /= 10.;
        b /= 10.;
    }
    if divs == 0 { out.push_str("0"); }
    while a != 0.0 && b != 0.0 {
        let ad = (a*10.).floor() as u8;
        let bd = (b*10.).floor() as u8;
        a = (a*10.)-(ad as f64);
        b = (b*10.)-(bd as f64);
        if divs == 0 { out.push_str("."); }
        divs -= 1;
        out.push_str(&format!("{}",max(ad,bd)));
        if ad != bd { break; }
    }
    if divs > 0 { out.push_str(&"0".repeat(divs as usize)); }
    out
}

fn format_str(v: i64, vdiv: f64, delta: f64) -> String {
    let mut out = String::new();
    let mut value = delta+v as f64/vdiv;
    if value < 0.0 {
        out.push_str("-");
        value = -value;
    }
    let mut little = value - EPSILON;
    let mut large = value + EPSILON;

    if little <= 0.0 || large <= 0.0 {
        out.push_str("0");
    } else {
        out.push_str(&find_short(little,large));
    }
    out
}

pub fn leafcard_source(leaf_marks: bool) -> impl Source {
    let font = FCFont::new(16,"Lato",FontVariety::Normal);
    ClosureSource::new(0.2,move |lc,leaf| {
        let i = leaf.get_index();
        let mut mul = vscale_bp_per_leaf(leaf.get_vscale());
        let mut vdiv = 1.;
        let mut delta = 0.;
        let mut start = leaf.get_index() as f64 * mul;
        if mul < 100. {
            delta = round_sf(start,common_sf(start,start+mul));
            start -= delta;
            vdiv = 10_i64.pow((3-mul.log10().round() as i32) as u32) as f64;
            mul *= vdiv;
            start *= vdiv;
        }
        for v in range(start,mul,TARGET,BY12) {
            let offset = (v as f64-start)/mul;
            let tx = text_texture(&format_str(v,vdiv,delta),&font,&Colour(199,208,213),&Colour(255,255,255));
            closure_add(lc,&pin_texture(tx,&cleaf(offset as f32,1),
                        &cpixel(0,40),&cpixel(1,1).anchor(A_TOP)));
        }
        let big_mark : HashSet<i64> = range(start,mul,TARGET,BY1).collect();
        let mid_mark : HashSet<i64> = range(start,mul,TARGET,BY15).collect();
        let small_mark : HashSet<i64> = range(start,mul,TARGET,BY125).collect();
        for v in range(start,mul,MARK_TARGET,BY1) {
            let h = if big_mark.contains(&v) {
                30
            } else if mid_mark.contains(&v) {
                20
            } else if small_mark.contains(&v) {
                15
            } else {
                10
            };
            let offset = (v as f64-start)/mul;
            closure_add(lc,&pin_rectangle(&cleaf(offset as f32,10),
                                          &area_size(cpixel(0,0),cpixel(1,h)),
                                          &ColourSpec::Colour(Colour(199,208,213))));
        }
        let (colour,offset) = if i % 2 == 0 {
            (ColourSpec::Colour(Colour(255,0,0)),0)
        } else {
            (ColourSpec::Colour(Colour(0,255,0)),10)
        };
        if leaf_marks {
            closure_add(lc,&stretch_rectangle(&area(
                            cleaf(0.,70),
                            cleaf(1.,80),
                         ),&colour));
            closure_done(lc,80);
        } else {
            closure_done(lc,60);
        }
    })  
}
