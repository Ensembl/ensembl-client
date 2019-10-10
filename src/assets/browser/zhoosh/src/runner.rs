use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRefMut;

use super::step::ZhooshStep;
use super::state::ZhooshStepState;

#[derive(Clone,Copy)]
pub struct ZhooshStepHandle(usize);

pub struct ZhooshSequenceControlImpl {
    abandoned: bool
}

#[derive(Clone)]
pub struct ZhooshSequenceControl(Arc<Mutex<ZhooshSequenceControlImpl>>);

impl ZhooshSequenceControl {
    fn new() -> ZhooshSequenceControl {
        ZhooshSequenceControl(Arc::new(Mutex::new(ZhooshSequenceControlImpl {
            abandoned: false
        })))
    }

    pub fn abandon(&mut self) {
        self.0.lock().unwrap().abandoned = true;
    }

    fn is_abandoned(&self) -> bool {
        self.0.lock().unwrap().abandoned 
    }
}

pub struct ZhooshSequence {
    control: ZhooshSequenceControl,
    runs: Vec<Arc<Mutex<ZhooshStepState>>>
}

impl ZhooshSequence {
    pub fn new() -> ZhooshSequence {
        ZhooshSequence {
            control: ZhooshSequenceControl::new(),
            runs: Vec::new()
        }
    }

    pub(super) fn get_control(&self) -> ZhooshSequenceControl {
        self.control.clone()
    }

    pub(super) fn resolve_handle<'ret>(&'ret self, h: &ZhooshStepHandle) -> MutexGuardRefMut<'ret,ZhooshStepState> {
        MutexGuardRefMut::new(self.runs[h.0].lock().unwrap())
    }

    pub fn add(&mut self, spec: ZhooshStep) -> ZhooshStepHandle {
        let run = Arc::new(Mutex::new(ZhooshStepState::new(spec)));
        self.runs.push(run.clone());
        ZhooshStepHandle(self.runs.len()-1)
    }

    pub fn add_trigger(&mut self, subject: &ZhooshStepHandle, after: &ZhooshStepHandle, after_prop: f64) {
        let mut subject = self.resolve_handle(&subject);
        subject.get_spec().add_trigger(after,after_prop);
    }

    pub fn run(self, runner: &mut ZhooshRunner) -> ZhooshSequenceControl {
        runner.add(self)
    }

    fn step(&mut self, now: f64) -> bool {
        if self.control.is_abandoned() { return false; }
        let mut valid = 0;
        for run in self.runs.iter() {
            if run.lock().unwrap().step(now,&self) {
                valid += 1;
            }
        }
        valid > 0
    }
}

pub struct ZhooshRunner {
    seqs: Vec<ZhooshSequence>
}

impl ZhooshRunner {
    pub fn new() -> ZhooshRunner {
        ZhooshRunner {
            seqs: Vec::new()
        }
    }

    fn add(&mut self, run: ZhooshSequence) -> ZhooshSequenceControl {
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
