use rand::Rng;
use rand::rngs::SmallRng;
use rand::SeedableRng;

use composit::Leaf;
use tánaiste::Value;
use super::fakedata::FakeDataGenerator;

const RNG_BLOCK_SIZE : i32 = 1000000;
const MAX_LEN : usize = 10000;

pub fn rng_flip(kind: [u8;8], start: i32, end: i32, rnd_size: i32,
                sense_type: Option<f64>) -> Vec<(i32,bool)> {
    let mut out = Vec::<(i32,bool)>::new();
    let start_block = (start as f32/RNG_BLOCK_SIZE as f32).floor() as i32;
    let end_block = (end as f32/RNG_BLOCK_SIZE as f32).ceil() as i32;
    for block in start_block..(end_block+1) {
        let block_start = block * RNG_BLOCK_SIZE;
        let seed = [kind[0],kind[1],kind[2],kind[3],
                    kind[4],kind[5],kind[6],kind[7],
                    0,0,0,0,
                    ((block>>24)&0xff) as u8,
                    ((block>>16)&0xff) as u8,
                    ((block>> 8)&0xff) as u8,
                    ((block    )&0xff) as u8];
        let seed_b = [kind[0],kind[1],kind[2],kind[3],
                    kind[4],kind[5],kind[6],kind[7],
                    1,0,0,0,
                    ((block>>24)&0xff) as u8,
                    ((block>>16)&0xff) as u8,
                    ((block>> 8)&0xff) as u8,
                    ((block    )&0xff) as u8];
        let mut rng = SmallRng::from_seed(seed);
        let mut rng_b = SmallRng::from_seed(seed_b);
        let mut prev_pos = 0;
        let mut sense = false;
        out.push((block_start,true));
        while prev_pos < RNG_BLOCK_SIZE-2 {
            let rnd_size = rng.gen_range(rnd_size/2,rnd_size);
            let rnd_start = prev_pos + rnd_size;
            let obj_start = rnd_start + block_start;
            if obj_start <= end {
                out.push((obj_start,sense));
                sense = match sense_type {
                    Some(p) => rng_b.gen_bool(p),
                    None => !sense
                };
            }
            prev_pos = rnd_start;
        }
        if sense {
            out.push((block_start + RNG_BLOCK_SIZE-2,true));
        }
        out.push((block_start+ RNG_BLOCK_SIZE-1,false));
        if out.len() > MAX_LEN {
            console!("PANIC, TOO MUCH DATA!");
            return vec!{};
        }
    }
    out.sort();
    out
}

pub struct RngFlip {
    kind: [u8;8],
    rnd_size: i32,
    sense_p: Option<f64>,
    sense: bool
}

impl RngFlip {
    pub fn new(kind: [u8;8], rnd_size: i32, sense_p: Option<f64>, sense: bool) -> RngFlip {
        RngFlip { kind, rnd_size, sense_p, sense }
    }
}

impl FakeDataGenerator for RngFlip {
    fn generate(&self, leaf: &Leaf) -> Value {
        let start = leaf.get_start() as i32 - 20*self.rnd_size;
        let end = leaf.get_end() as i32 + 20*self.rnd_size;
        let out = rng_flip(self.kind,start,end,self.rnd_size,self.sense_p);
        let out = out.iter()
            .map(|x| if self.sense { if x.1 {1.} else {0.} } else { x.0 as f64 }).
            collect();
        Value::new_from_float(out)
    }
}
