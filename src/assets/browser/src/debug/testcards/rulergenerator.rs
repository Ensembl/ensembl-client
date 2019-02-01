use std::cmp::max;
use std::collections::HashSet;
use std::iter::FromIterator;

use composit::{ Leaf, vscale_bp_per_leaf };

const BY125 : &[f64] = &[0.05,0.1,0.2,0.5,1.,2.,5.,10.,20.];
const BY12 : &[f64] =  &[     0.1,0.2,    1.,   5.,10.    ];
const BY15 : &[f64] =  &[0.05,0.1,    0.5,1.,2.,   10.,20.];
const BY1 : &[f64] =   &[     0.1,        1.,      10.    ];

const EPSILON : f64 = 0.00000001;

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
        if divs > 0 && divs % 3 == 0 { out.push_str(","); }
    }
    if divs > 0 {
        while divs > 0 {
            if divs % 3 == 0 { out.push_str(","); }
            out.push_str("0");
            divs -= 1;
        }
    }
    out
}

fn format_str(mut value: f64) -> String {
    let mut out = String::new();
    if value < 0.0 {
        out.push_str("-");
        value = -value;
    }
    let little = value - EPSILON;
    let large = value + EPSILON;

    if little <= 0.0 || large <= 0.0 {
        out.push_str("0");
    } else {
        out.push_str(&find_short(little,large));
    }
    out
}

fn goby(start: f64, bp_leaf: f64, target: i32, by: &[f64]) -> f64 {
    let approx = 10_i64.pow((bp_leaf/20.).log10().round() as u32) as f64;
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

fn common_sf(a: f64, b: f64) -> i32 {
    for i in 2..50 {
        if round_sf(a,i) != round_sf(b,i) { return i-1; }
    }
    50
}

fn round_sf(value: f64, sf: i32) -> f64 {
    if value == 0. { return 0.; }
    let mag = 10_f64.powi(value.abs().log10().trunc() as i32+1-sf);
    (value/mag).floor()*mag
}

fn make_set(in_: Vec<(i64,f64,f64)>) -> HashSet<i64> {
    HashSet::from_iter(
        in_.iter().map(|x| x.0)
    )
}

pub struct RulerGenerator {
    vdiv: f64,
    start: f64,
    mul: f64,
    delta: f64
}

impl RulerGenerator {
    pub fn new_leaf(leaf: &Leaf) -> RulerGenerator {
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
        RulerGenerator { start, mul, vdiv, delta }
    }
    
    fn _range(&self, target: i32, by: &[f64]) -> Vec<(i64,f64,f64)> {
        let mut out = Vec::<(i64,f64,f64)>::new();
        let step = goby(self.start,self.mul,target,by);
        let end = self.start+self.mul;
        let loop_start = (self.start/step).ceil() as i64;
        let loop_end = (end/step).floor() as i64+1;
        for i in loop_start..loop_end {
            let offset = i*step as i64;
            let value = self.delta + offset as f64/self.vdiv;
            out.push((offset,(offset as f64-self.start)/self.mul,value));
        }
        out
    }
    
    #[allow(unused)]
    pub fn range_1(&self, target: i32) -> Vec<(i64,f64,f64)> {
        self._range(target,BY1)
    }

    #[allow(unused)]
    pub fn range_12(&self, target: i32) -> Vec<(i64,f64,f64)> {
        self._range(target,BY12)
    }

    #[allow(unused)]
    pub fn range_15(&self, target: i32) -> Vec<(i64,f64,f64)> {
        self._range(target,BY15)
    }

    #[allow(unused)]
    pub fn range_125(&self, target: i32) -> Vec<(i64,f64,f64)> {
        self._range(target,BY125)
    }
    
    #[allow(unused)]
    pub fn ruler(&self, mark_tg: i32, tick_tg: i32, num_tg: i32,
                 heights: &[i32;4]) -> Vec<(f32,i32,Option<String>)> {
        let mut out = Vec::<(f32,i32,Option<String>)>::new();
        let numbered = make_set(self.range_12(num_tg));
        let big_mark = make_set(self.range_1(tick_tg));
        let mid_mark = make_set(self.range_12(tick_tg));
        let small_mark = make_set(self.range_125(tick_tg));
        for (idx,offset,value) in self.range_12(mark_tg) {
            let h = if big_mark.contains(&idx) {
                3
            } else if mid_mark.contains(&idx) {
                2
            } else if small_mark.contains(&idx) {
                1
            } else {
                0
            };
            let tx = if numbered.contains(&idx) {
                Some(format_str(value))
            } else {
                None
            };
            out.push((offset as f32,heights[h],tx));
        }
        out
    }
}
