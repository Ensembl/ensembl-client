use std::collections::hash_map::DefaultHasher;
use std::hash::Hasher;
use std::sync::{ Mutex, Arc };

use rand::{ Rng, seq };
use rand::distributions::Distribution;
use rand::prelude::SliceRandom;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use stdweb::web::{ Element };

use controller::global::{ Global, AppRunner };
use debug::testcards::base::testcard_base;
use debug::testcards::polar::testcard_polar;
use types::{ CLeaf, cleaf, Colour };

fn bytes_of_u32(v: u32) -> [u8;4] {
    [
        ((v>>24)&0xff) as u8,
        ((v>>16)&0xff) as u8,
        ((v>> 8)&0xff) as u8,
        ((v    )&0xff) as u8
    ]
}

fn bytes_of_u64(v: u64) -> [u8;8] {
    [
        ((v>>56)&0xff) as u8,
        ((v>>48)&0xff) as u8,
        ((v>>40)&0xff) as u8,
        ((v>>32)&0xff) as u8,
        ((v>>24)&0xff) as u8,
        ((v>>16)&0xff) as u8,
        ((v>> 8)&0xff) as u8,
        ((v    )&0xff) as u8
    ]
}

const RNG_BLOCK_SIZE : i32 = 1000000;

pub fn rng_pos(kind: [u8;8], start: i32, end: i32, sep: i32, size: i32) -> Vec<[i32;2]> {
    let mut out = Vec::<[i32;2]>::new();
    let start_block = start/RNG_BLOCK_SIZE;
    let end_block = end/RNG_BLOCK_SIZE;
    for block in start_block..(end_block+1) {
        let block_start = block * RNG_BLOCK_SIZE;
        let seed = [kind[0],kind[1],kind[2],kind[3],
                    kind[4],kind[5],kind[6],kind[7],
                    0,0,0,0,
                    ((block>>24)&0xff) as u8,
                    ((block>>16)&0xff) as u8,
                    ((block>> 8)&0xff) as u8,
                    ((block    )&0xff) as u8];
        let mut rng = SmallRng::from_seed(seed);
        let mut min_start = 0;
        while min_start < RNG_BLOCK_SIZE {
            let rnd_start = min_start + rng.gen_range(sep/2,sep);
            let rnd_end = rng.gen_range(0,size) + rnd_start;
            let obj_start = rnd_start + block_start;
            let obj_end = rnd_end + block_start;
            if obj_end >= start && obj_start <= end {
                out.push([obj_start,obj_end]);
            }
            min_start = rnd_end + rng.gen_range(size/2,size);
        }
    }
    out.sort();
    out
}

fn start_hash(kind: [u8;8], start: &[i32;2]) -> u64 {
    let mut h = DefaultHasher::new();
    h.write(&kind);
    h.write_i32(start[0]);
    h.write_i32(start[1]);
    h.finish()
}

fn start_rng(kind: [u8;8], start: &[i32;2]) -> SmallRng {
    let b = bytes_of_u64(start_hash(kind,start));
    let seed = [b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],
                kind[0],kind[1],kind[2],kind[3],
                kind[4],kind[5],kind[6],kind[7]];
    SmallRng::from_seed(seed)
}

pub fn rng_colour(kind: [u8;8], start: &[i32;2]) -> Colour {
    let b = bytes_of_u64(start_hash(kind,start));
    Colour(b[0] as u32,b[1] as u32,b[2] as u32)
}

const MANY : u64 = 1000000000;
pub fn rng_prob(kind: [u8;8], start: &[i32;2], prob: f32) -> bool {
    let b = start_hash(kind,start);
    (b%MANY) < (prob * MANY as f32) as u64
}

pub fn rng_choose(kind: [u8;8], start: &[i32;2], vals: &[&[&str]]) -> String {
    let mut rng = start_rng(kind,start);
    let mut out = String::new();
    for val in vals {
        out += val[..].choose(&mut rng).unwrap();
    }
    out
}

pub fn rng_subdivide(kind: [u8;8], extent: &[i32;2], parts: u32) -> Vec<[i32;2]> {
    let mut rng = start_rng(kind,extent);
    let mut breaks = Vec::<i32>::new();
    for i in 0..parts {
        breaks.push(rng.gen_range(extent[0],extent[1]));
    }
    breaks.push(extent[0]);
    breaks.push(extent[1]);
    breaks.sort();
    let mut out = Vec::<[i32;2]>::new();
    for i in 0..breaks.len()-1 {
        out.push([breaks[i],breaks[i+1]]);
    }
    out
}

fn choose<R>(rng: &mut R, vals: &[&[&str]]) -> String
                    where R: Rng {
    let mut out = String::new();
    for val in vals {
        out += val[..].choose(rng).unwrap();
    }
    out
}

pub fn bio_mark(kind: [u8;8], start: &[i32;2]) -> String {
    let vals = [ "5'","3'","snp","ins","del",
                 "5'","3'","snp","ins","del",
                 "5'","3'","snp","ins","del",
                 "C","G","A","T" ];
    rng_choose(kind,start,&[&vals[..]])
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
