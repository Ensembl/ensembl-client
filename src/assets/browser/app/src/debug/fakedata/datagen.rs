use std::iter::repeat;

use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use composit::Leaf;
use tánaiste::Value;
use super::fakedata::FakeDataGenerator;

const RNG_BLOCK_SIZE : i32 = 1000000;
const MAX_LEN : usize = 10000;

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

pub fn rng_prob(kind: [u8;8], start: i32, end: i32, rnd_size: i32, p: f64) -> Vec<(i32,bool)> {
    rng_at(kind,start,end,rnd_size,0,|out,rng,in_| {
        out.push((in_,rng.gen_bool(p)))
    })
}

pub fn rng_flip(kind: [u8;8], start: i32, end: i32, rnd_size: i32) -> Vec<i32> {
    rng_at(kind,start,end,rnd_size,0,|out,_,in_| {
        out.push(in_)
    })
}

pub struct RngFlip {
    kind: [u8;8],
    rnd_size: i32,
}

impl RngFlip {
    pub fn new(kind: [u8;8], rnd_size: i32) -> RngFlip {
        RngFlip { kind, rnd_size }
    }
}

impl FakeDataGenerator for RngFlip {
    fn generate(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32 - 20*self.rnd_size;
        let end = leaf.get_end() as i32 + 20*self.rnd_size;
        let out = rng_flip(self.kind,start,end,self.rnd_size);
        let out = out.iter().map(|x| *x as f64).collect();
        vec! { Value::new_from_float(out) }
    }
}

pub struct RngFlipBool {
    kind: [u8;8],
    rnd_size: i32,
    sense_p: f64
}

impl RngFlipBool {
    pub fn new(kind: [u8;8], rnd_size: i32, sense_p: f64) -> RngFlipBool {
        RngFlipBool { kind, rnd_size, sense_p }
    }
}

impl FakeDataGenerator for RngFlipBool {
    fn generate(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32 - 20*self.rnd_size;
        let end = leaf.get_end() as i32 + 20*self.rnd_size;
        let out = rng_prob(self.kind,start,end,self.rnd_size,self.sense_p);
        let starts = out.iter().map(|x| x.0 as f64).collect();
        let elides = out.iter().map(|x| if x.1 {1.} else {0.}).collect();
        vec! {
            Value::new_from_float(starts),
            Value::new_from_float(elides)
        }
    }
}

/*
        let steps = 1000.;
        let bp_inc = leaf.total_bp() / steps as f64;
        let mut buckets_end : Vec<bool> = repeat(false).take(steps as usize).collect();
        let mut buckets_num : Vec<usize> = repeat(0).take(steps as usize).collect();
        let mut prev_pos = 0;
        for (pos,sense) in starts_rng.iter() {
            let b_start = (prop(leaf,prev_pos) * steps).floor().max(0.) as usize;
            let b_end = (prop(leaf,*pos) * steps).ceil().min(steps-1.) as usize;
            for b in b_start..b_end {
                buckets_end[b] = *sense;
                buckets_num[b] += 1;
            }
            prev_pos = *pos;
        }
        for b in 0..steps as usize {
            let sense = buckets_end[b];
            let ops = if buckets_num[b] > 1 {
                vec! { (0.,0.5,!sense),(0.5,1.,sense) }
            } else if buckets_num[b] == 1 {
                vec! { (0.,1.,sense) }
            } else { vec!{} };
            for (i,(start,end,sense)) in ops.iter().enumerate() {
                let c = if *sense { 192 } else { 128 }; 
                closure_add(lc,&stretch_rectangle(
                    &area(cleaf((b as f32+start)/steps,y-3),
                          cleaf((b as f32+end)/steps,y+3)),
                    &ColourSpec::Colour(Colour(c,c,c))));
            }
        }
    }
*/
const STEPS : usize = 1000;
fn shimmer(val: Vec<(i32,bool)>, leaf: &Leaf) -> Vec<(i32,bool,bool)> {
    let mut out = Vec::<(i32,bool,bool)>::new();
    let step_bp = leaf.total_bp() / STEPS as f64;
    /* make buckets */
    let mut buckets_end : Vec<bool> = repeat(false).take(STEPS).collect();
    let mut buckets_num : Vec<usize> = repeat(0).take(STEPS).collect();
    /* populate buckets */
    let mut sense = false;
    let mut prev_pos = 0;
    for (pos,elide) in val.iter() {
        if *elide { continue; }
        let b_start = (leaf.prop(prev_pos) * STEPS as f32).floor().max(0.) as usize;
        let b_end = (leaf.prop(*pos) * STEPS as f32).ceil().min(STEPS as f32-1.) as usize;
        for b in b_start..b_end {
            buckets_end[b] = sense;
            buckets_num[b] += 1;
        }
        prev_pos = *pos;
        sense = !sense;
    }
    /* turn into shimmer track */
    let leaf_start = leaf.get_start();
    for b in 0..STEPS {
        /* calc blocks neeed in step */
        let sense = buckets_end[b];
        let ops = if buckets_num[b] > 1 {
            vec! { (0.,!sense,false),(0.5,sense,false) }
        } else if buckets_num[b] == 1 {
            vec! { (0.,sense,false) }
        } else {
            vec! { (0.,sense,true) }
        };
        /* set down those blocks */
        for (start_p,sense,elide) in ops.iter() {
            let b_start = leaf_start + ((b as f64+start_p)*step_bp);
            out.push((b_start as i32,*elide,*sense));
        }
    }
    out
}

pub struct RngFlipShimmer {
    kind: [u8;8],
    rnd_size: i32,
    sense_p: f64
}

impl RngFlipShimmer {
    pub fn new(kind: [u8;8], rnd_size: i32, sense_p: f64) -> RngFlipShimmer {
        RngFlipShimmer { kind, rnd_size, sense_p }
    }
}

impl FakeDataGenerator for RngFlipShimmer {
    fn generate(&self, leaf: &Leaf) -> Vec<Value> {
        let start = leaf.get_start() as i32 - 20*self.rnd_size;
        let end = leaf.get_end() as i32 + 20*self.rnd_size;
        let flips = rng_prob(self.kind,start,end,self.rnd_size,self.sense_p);
        let out = shimmer(flips,leaf);
        let starts = out.iter().map(|x| x.0 as f64).collect();
        let elides = out.iter().map(|x| if x.1 {1.} else {0.}).collect();
        let colours = out.iter().map(|x| if x.2 {1.} else {0.}).collect();
        vec! {
            Value::new_from_float(starts),
            Value::new_from_float(elides),
            Value::new_from_float(colours)
        }
    }
}
