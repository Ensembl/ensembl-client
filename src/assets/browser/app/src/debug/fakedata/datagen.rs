use std::iter::repeat;
use std::panic;

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;
use rand::seq::SliceRandom;

use composit::Leaf;
use tánaiste::Value;
use super::fakedata::FakeDataGenerator;

const RNG_BLOCK_SIZE : i32 = 1000000;

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
        while pos < start && pos < block_end_pos {
            ["A","C","G","T"].choose(&mut rng);
            pos += 1;
        }
        if pos >= start {
            while pos < end && pos < block_end_pos {
                out.push_str(&["A","C","G","T"].choose(&mut rng).unwrap());
                pos += 1;
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

pub struct RngGene {
    kind: [u8;8],
    pad: i32,
    sep: i32,
    size: i32,
    parts: u32,
    seq: bool
}

impl RngGene {
    pub fn new(kind: [u8;8], pad: i32, sep: i32, size: i32, parts: u32, seq: bool) -> RngGene {
        RngGene { kind, sep, size, parts, pad, seq }
    }

    fn generate_whole(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32;
        let end = leaf.get_end() as i32;
        let mut starts = Vec::<f64>::new();
        let mut lens = Vec::<f64>::new();
        let genes = rng_pos(self.kind,start-self.pad,end+self.pad,
                          self.sep,self.size,0);
        for (start,len) in genes {
            if start < 0 { continue; }
            starts.push(start as f64);
            lens.push(len as f64);
        }
        vec! {
            Value::new_from_float(starts),
            Value::new_from_float(lens)
        }
    }

    fn generate_parts(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32;
        let end = leaf.get_end() as i32;
        let genes = rng_pos(self.kind,start-self.pad,end+self.pad,
                          self.sep,self.size,0);
        let mut starts = Vec::<f64>::new();
        let mut pattern = Vec::<f64>::new();
        let mut nump = Vec::<f64>::new();
        let mut utrs = Vec::<f64>::new();
        let mut exons = Vec::<f64>::new();
        let mut introns = Vec::<f64>::new();
        let mut seq_text = String::new();
        let mut seq_start = Vec::<f64>::new();
        let mut seq_len = Vec::<f64>::new();
        for (start,len) in genes {
            if start < 0 { continue; }
            let subs = rng_subdivide(self.kind,&(start,len),self.parts,1);
            if subs.len() == 0 { continue; }
            let mut type_ = 0.;
            let mut num = 0;
            let mut first_pos = None;
            let mut prev_pos = 0;
            let mut pattern_here = Vec::<f64>::new();
            let start_pos = (leaf.get_start() as i32-start).max(0);
            for (i,delta) in subs.iter().enumerate() {
                let next_pos = prev_pos + delta;
                if i == subs.len()-1 {
                    type_ = 0.;
                }
                if next_pos > start_pos &&
                   start+prev_pos < leaf.get_end() as i32 &&
                   start+next_pos > leaf.get_start() as i32 {
                    let mut delta = next_pos - prev_pos;
                    if first_pos.is_none() { 
                        first_pos = Some(prev_pos as i32);
                        if prev_pos < start_pos {
                            first_pos = Some(start_pos);
                            delta = next_pos - start_pos;
                        }
                    }
                    pattern_here.push(type_);
                    if type_ == 2. {
                        introns.push(delta as f64);
                    } else if type_ == 1. {
                        exons.push(delta as f64);
                    } else {
                        utrs.push(delta as f64);
                    }
                    num += 1;
                }
                if type_ != 1. {
                    type_ = 1.;
                } else {
                    type_ = 2.;
                }
                prev_pos = next_pos;
            }
            if num == 0 { continue; }
            pattern.append(&mut pattern_here);
            let start = start + first_pos.unwrap_or(0);
            starts.push(start as f64);
            nump.push(num as f64);
            if self.seq {
                let mut our_start = start;
                let mut seq = rng_seq(self.kind,leaf.get_start() as i32,leaf.get_end() as i32,2);
                seq_text.push_str(&seq);
                seq_start.push(leaf.get_start() as f64);
                seq_len.push((leaf.get_end()-leaf.get_start()) as f64);
            }
        }
        let mut out = vec! {
            Value::new_from_float(starts),
            Value::new_from_float(nump),
            Value::new_from_float(pattern),
            Value::new_from_float(utrs),
            Value::new_from_float(exons),
            Value::new_from_float(introns),
        };
        if self.seq {
            out.push(Value::new_from_string(seq_text));
            out.push(Value::new_from_float(seq_start));
            out.push(Value::new_from_float(seq_len));
        }
        out
    }
}

impl FakeDataGenerator for RngGene {
    fn generate(&self, leaf: &Leaf) -> Vec<Value> {
        if self.parts != 0 {
            self.generate_parts(leaf)
        } else {
            self.generate_whole(leaf)
        }
    }
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
    fn generate(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32;
        let end = leaf.get_end() as i32;
        let out = rng_contig(self.kind,start-self.pad,end+self.pad,self.rnd_size,self.prop_fill);
        if self.shimmer {
            let out = shimmer(&out,leaf);
            let starts : Vec<f64> = out.iter().map(|x| x.0 as f64).collect();
            let lens : Vec<f64> = out.iter().map(|x| x.1 as f64).collect();
            let senses = out.iter().map(|x| floatify(x.2)).collect();
            vec! {
                Value::new_from_float(starts),
                Value::new_from_float(lens),
                Value::new_from_float(senses),
            }
        } else {
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
                vec! {
                    Value::new_from_string(out_seq),
                    Value::new_from_float(starts_out),
                    Value::new_from_float(lens_out),
                }
            } else {
                let senses = out.iter().map(|x| floatify(x.2)).collect();
                vec! {
                    Value::new_from_float(starts),
                    Value::new_from_float(lens),
                    Value::new_from_float(senses),
                }
            }
        }
    }
}

const STEPS : usize = 1000;

fn shimmer(in_: &Vec<(i32,i32,bool)>, leaf: &Leaf) -> Vec<(i32,i32,bool)> {
    let mut out = Vec::<(i32,i32,bool)>::new();
    let step_bp = leaf.total_bp() / STEPS as f64;
    /* make buckets */
    let mut buckets_end : Vec<bool> = repeat(false).take(STEPS).collect();
    let mut buckets_num : Vec<usize> = repeat(0).take(STEPS).collect();
    /* populate buckets */
    for (pos,len,sense) in in_.iter() {
        let b_start = (leaf.prop(*pos as f64) * STEPS as f32).floor().max(0.) as usize;
        let b_end = (leaf.prop((*pos+len) as f64) * STEPS as f32).ceil().min(STEPS as f32-1.) as usize;
        for b in b_start..b_end {
            buckets_end[b] = *sense;
            buckets_num[b] += 1;
        }
    }
    /* turn into shimmer track */
    let leaf_start = leaf.get_start();
    for b in 0..STEPS {
        /* calc blocks neeed in step */
        let sense = buckets_end[b];
        let ops = if buckets_num[b] > 1 {
            vec! { (0.,0.5,!sense),(0.5,1.,sense) }
        } else if buckets_num[b] == 1 {
            vec! { (0.,1.,sense) }
        } else {
            vec! {}
        };
        /* set down those blocks */
        for (start_p,end_p,sense) in ops.iter() {
            let b_start = leaf_start + ((b as f64+start_p)*step_bp);
            let b_len = (end_p-start_p) * step_bp;
            out.push((b_start as i32,b_len as i32,*sense));
        }
    }
    out
}

