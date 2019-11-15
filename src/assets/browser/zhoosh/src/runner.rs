use super::sequence::{ ZhooshSequence, ZhooshSequenceControl };

pub struct ZhooshRunner {
    seqs: Vec<ZhooshSequence>
}

impl ZhooshRunner {
    pub fn new() -> ZhooshRunner {
        ZhooshRunner {
            seqs: Vec::new()
        }
    }

    pub(super) fn add(&mut self, run: ZhooshSequence) -> ZhooshSequenceControl {
        let control = run.get_control();
        self.seqs.push(run);
        control
    }

    pub fn step(&mut self, now: f64) -> bool {
        let mut keep = Vec::new();
        for mut seq in self.seqs.drain(..) {
            if seq.step(now) {
                keep.push(seq);
            }
        }
        self.seqs = keep;
        self.seqs.len() > 0
    }
}
