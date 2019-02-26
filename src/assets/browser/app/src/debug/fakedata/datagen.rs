use std::iter::repeat;
use std::panic;

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;
use rand::seq::SliceRandom;
use stdweb::unstable::TryInto;
use stdweb::web::{ ArrayBuffer, TypedArray, XmlHttpRequest, XhrResponseType };
use stdweb::Value as StdwebValue;
use tánaiste::Value;

use composit::Leaf;
use data::{ HttpManager, HttpResponseConsumer, xfer_marshal };
use super::fakedata::FakeDataGenerator;
use super::fakedatareceiver::FakeDataReceiver;

const RNG_BLOCK_SIZE : i32 = 100000;

fn burst_u32(data: u32) -> [u8;4] {
    [
        ((data>>24)&0xff) as u8,
        ((data>>16)&0xff) as u8,
        ((data>> 8)&0xff) as u8,
        ((data    )&0xff) as u8
    ]
}

fn floatify(val: bool) -> f64 {
    if val { 1. } else { 0. }
}

fn generator(kind: [u8;8], subtype: u32, block: i32) -> SmallRng {
    let subtype = burst_u32(subtype);
    let block = burst_u32(block as u32);
    SmallRng::from_seed([
        kind[0],kind[1],kind[2],kind[3],
        kind[4],kind[5],kind[6],kind[7],
        subtype[0],subtype[1],subtype[2],subtype[3],
        block[0],block[1],block[2],block[3]
    ])
}

pub fn rng_at<F,G>(kind: [u8;8], start: i32, end: i32, rnd_size: i32,
                   subtype: u32, mut cb: F) -> Vec<G>
            where F: FnMut(&mut Vec<G>,&mut SmallRng,i32) {
    let mut out = Vec::<G>::new();
    let start_block = (start as f32/RNG_BLOCK_SIZE as f32).floor() as i32;
    let end_block = (end as f32/RNG_BLOCK_SIZE as f32).ceil() as i32;
    for block in start_block..(end_block+1) {
        let block_start = block * RNG_BLOCK_SIZE;
        let mut rng = generator(kind,subtype,block);
        let mut rng_aux = generator(kind,1,block);
        let mut prev_pos = 0;
        let mut odd = false;
        cb(&mut out, &mut rng_aux,block_start);
        while prev_pos < RNG_BLOCK_SIZE {
            let rnd_size = rng.gen_range(rnd_size/2,rnd_size);
            let rnd_start = prev_pos + rnd_size;
            let obj_start = rnd_start + block_start;
            cb(&mut out,&mut rng_aux,obj_start);
            prev_pos = rnd_start;
            odd = !odd;
        }
        if odd {
            cb(&mut out,&mut rng_aux,block_start+RNG_BLOCK_SIZE);
        }
    }
    out
}

pub fn rng_pos(kind: [u8;8], start: i32, end: i32, sep: i32, size: i32, subtype: u32) -> Vec<(i32,i32)> {
    let mut out = Vec::<(i32,i32)>::new();
    let start_block = (start as f32/RNG_BLOCK_SIZE as f32).floor() as i32;
    let end_block = (end as f32/RNG_BLOCK_SIZE as f32).ceil() as i32;
    for block in start_block..(end_block+1) {
        let block_start = block * RNG_BLOCK_SIZE;
        let mut rng = generator(kind,subtype,block);
        let mut min_start = 0;
        while min_start < RNG_BLOCK_SIZE {
            let rnd_start = min_start + rng.gen_range(sep/2,sep);
            let rnd_end = rng.gen_range(0,size) + rnd_start;
            let obj_start = rnd_start + block_start;
            let obj_end = rnd_end + block_start;
            if obj_end >= start && obj_start <= end {
                out.push((obj_start,obj_end-obj_start));
            }
            min_start = rnd_end + rng.gen_range(size/2,size);
        }
    }
    out.sort();
    out
}

pub fn rng_subdivide(kind: [u8;8], extent: &(i32,i32), parts: u32, subtype: u32) -> Vec<i32> {
    let mut rng = generator(kind,subtype,extent.0);
    let mut breaks = Vec::<i32>::new();
    let parts = rng.gen_range(parts/2,parts*2);
    for _ in 0..parts {
        breaks.push(rng.gen_range(0,extent.1));
    }
    breaks.push(0);
    breaks.push(extent.1);
    breaks.sort();
    let mut out = Vec::<i32>::new();
    for i in 0..breaks.len()-1 {
        if breaks[i+1] > breaks[i] {
            out.push(breaks[i+1]-breaks[i]);
        }
    }
    out
}

pub fn rng_seq(kind: [u8;8], start: i32, end: i32, subtype: u32) -> String {
    let mut out = String::new();
    let start_block = (start as f32/RNG_BLOCK_SIZE as f32).floor() as i32;
    let end_block = (end as f32/RNG_BLOCK_SIZE as f32).ceil() as i32;
    for block in start_block..(end_block+1) {
        let mut rng = generator(kind,subtype,block);
        let mut pos = block * RNG_BLOCK_SIZE;
        let mut block_end_pos = (block+1) * RNG_BLOCK_SIZE;
        for idx in 0..RNG_BLOCK_SIZE {
            if pos+idx >= end { break; }
            let letter = ["A","C","G","T"].choose(&mut rng).unwrap();
            if pos+idx >= start {
                out.push_str(letter);
            }
        }
    }
    out
}

pub fn rng_contig(kind: [u8;8], start: i32, end: i32, rnd_size: i32, end_p: f64) -> Vec<(i32,i32,bool)> {
    let mut prev_val = None;
    let mut sense = false;
    let start = start.max(0);
    let out = rng_at(kind,start,end,rnd_size,0,|out,rng,in_| {
        if let Some(prev) = prev_val {
            if in_ > prev && prev > 0 {
                let delta = ((in_-prev) as f64 *end_p) as i32;
                let omdelta = ((in_-prev) as f64 *(1.-end_p)) as i32;            
                let prop = rng.gen_range(0,delta)+omdelta;
                if prev < end && prev+prop > start && prop > 0 {
                    out.push((prev,prop,sense));
                }
                sense = !sense;
            }
        }
        prev_val = Some(in_);
    });
    out
}

pub struct RngContig {
    kind: [u8;8],
    rnd_size: i32,
    pad: i32,
    prop_fill: f64,
    seq: bool,
    shimmer: bool
}

impl RngContig {
    pub fn new(kind: [u8;8], pad: i32, rnd_size: i32, prop_fill: f64, seq: bool, shimmer: bool) -> RngContig {
        RngContig { kind, rnd_size, prop_fill, seq, pad, shimmer }
    }
}

impl FakeDataGenerator for RngContig {
    fn generate(&self, leaf: &Leaf, fdr: &mut FakeDataReceiver) {
        let start = leaf.get_start() as i32;
        let end = leaf.get_end() as i32;
        let out = rng_contig(self.kind,start-self.pad,end+self.pad,self.rnd_size,self.prop_fill);
        let starts : Vec<f64> = out.iter().map(|x| x.0 as f64).collect();
        let lens : Vec<f64> = out.iter().map(|x| x.1 as f64).collect();
        if self.seq {
            let mut starts_out = Vec::<f64>::new();
            let mut lens_out = Vec::<f64>::new();
            let out_seq = {
                let seq = rng_seq(self.kind,start,end,2);
                let mut out_seq = String::new();
                let mut len_iter = lens.iter();
                for s in &starts {
                    let mut part_start = *s as i32-start;
                    let mut part_len = *len_iter.next().unwrap() as i32;
                    if part_start < 0 {
                        part_len += part_start;
                        part_start = 0;
                    }
                    let part_len = part_len.min(seq.len() as i32-part_start);
                    if part_len > 0 {
                        let (a,b) = (part_start as usize,part_len as usize);                
                        out_seq.push_str(&seq[a..a+b]);
                        starts_out.push((start+part_start) as f64);
                        lens_out.push(b as f64);
                    }
                }
                out_seq
            };
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_string(out_seq));
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_float(starts_out));
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_float(lens_out));
        } else {
            let senses = out.iter().map(|x| floatify(x.2)).collect();
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_float(starts));
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_float(lens));
            let idx = fdr.allocate();
            fdr.set(idx,Value::new_from_float(senses));
        }
    }
}
