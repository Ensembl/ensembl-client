use std::sync::{ Mutex, Arc };

use rand::{ Rng, seq };
use rand::prelude::SliceRandom;
use rand::distributions::Distribution;

use controller::global::Global;
use debug::DebugPanel;
use debug::testcards::base::testcard_base;
use debug::testcards::visual::testcard_visual;
use debug::testcards::button::testcard_button;
use debug::testcards::polar::testcard_polar;
use types::{ CLeaf, cleaf };
use stdweb::web::{ Element };

pub fn testcard(po: &DebugPanel, cont_el: &Element, g: Arc<Mutex<Global>>, name: &str) {
    debug!("global","starting testcard {}",name);
    g.lock().unwrap().with_apprunner(|ar| {
        let mut a = ar.state();
        let mut a = a.lock().unwrap();
        match name {
            "draw" => testcard_visual(ar,false),
            "onoff" => testcard_visual(ar,true),
            "button" => testcard_button(po,cont_el,&mut a),
            "polar" => testcard_polar(&mut a),
            "text" => testcard_base(&mut a,"text"),
            "ruler" => testcard_base(&mut a,"ruler"),
            "leaf" => testcard_base(&mut a,"leaf"),
            _ => ()
        };
    });
}

fn choose<R>(rng: &mut R, vals: &[&[&str]]) -> String
                    where R: Rng {
    let mut out = String::new();
    for val in vals {
        out += val[..].choose(rng).unwrap();
    }
    out
}

pub fn bio_daft<R>(rng: &mut R) -> String where R: Rng {
    let vals = [ "5'","3'","snp","ins","del",
                 "5'","3'","snp","ins","del",
                 "5'","3'","snp","ins","del",
                 "C","G","A","T" ];
    choose(rng,&[&vals[..]])
}

pub fn daft<R>(rng: &mut R) -> String where R: Rng {    
    let onset = [ "bl", "br", "ch", "cl", "cr", "dr", "fl",
                       "fr", "gh", "gl", "gr", "ph", "pl", "pr",
                       "qu", "sc", "sh", "sk", "sl", "sm", "sn", "sp",
                       "st", "sw", "th", "tr", "tw", "wh", "wr",
                       "sch", "scr", "shr", "spl", "spr", "squ",
                       "str", "thr", "b", "c", "d", "f", "g", "h", "j",
                       "k", "l", "m", "n", "p", "r", "s", "t", "u", "v",
                       "w", "x", "y", "z" ];
    let nuc = [ "ai", "au", "aw", "ay", "ea", "ee", "ei", "eu",
                    "ew", "ey", "ie", "oi", "oo", "ou", "ow", "oy",
                    "a", "e", "i", "o", "u" ];
    let coda = [  "ch", "ck", "gh", "ng", "ph", "sh", "sm", "sp",
                       "st", "th",  "nth", 
                       "b", "c", "d", "f", "g", "h", "j",
                       "k", "l", "m", "n", "p", "r", "s", "t", "u", "v",
                       "w", "x", "y", "z" ];
    let mut out = String::new();
    let num : i32 = rng.gen_range(1,8);
    for _i in 0..num {
        out += &choose(rng,&[&onset[..],&nuc[..],&coda[..]])[..];
        let sp: bool = rng.gen();
        if sp { out += " "; }
    }
    out
}

pub fn wiggly<R>(rng: &mut R, num: u32, origin: CLeaf, sep: f32, h: i32) 
                -> Vec<CLeaf> where R: Rng {
    let mut out = Vec::<CLeaf>::new();
    for i in 0..num {
        let v : i32 = rng.gen_range(0,h);
        out.push(origin + cleaf(i as f32*sep,v));
    }
    out
}

const MORSE_AL : &str = "abcdefghijklmnopqrstuvwxyz ";
const MORSE_DD : [&str;27] = [
    ".-", "-...", "-.-.", "-..", ".",
    "..-.", "--.", "....", "..", ".---",
    "-.-", ".-..", "--", "-.", "---",
    ".--.", "--.-", ".-.", "...", "-",
    "..-", "...-", ".--", "-..-", "-.--",
    "--..", " "
];

pub fn track_data(s: &str) -> Vec<f32> {
    let mut out = Vec::<f32>::new();
    for c in s.to_lowercase().chars() {
        if let Some(idx) = MORSE_AL.find(c) {
            for d in MORSE_DD[idx].chars() {
                out.push(match d {
                    '-' => 3.,
                    '.' => 1.,
                    _ => -9.
                });
                out.push(-1.);
            }
            out.push(-9.);
        }
    }
    out
}
