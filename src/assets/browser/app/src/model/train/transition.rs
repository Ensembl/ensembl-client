use std::sync::{ Arc, Mutex };

use zhoosh::{ Zhoosh, ZhooshRunner, ZhooshSequence, ZhooshSequenceControl, ZhooshShape, ZhooshStep, ZHOOSH_LINEAR_F64_OPS };

const MS_FADE_FAST : f64 = 100.;
const MS_FADE_SLOW : f64 = 750.;

pub struct TrainManagerTransitionImpl {
    transition_prop: f64,
}

impl TrainManagerTransitionImpl {
    pub fn new() -> TrainManagerTransitionImpl {
        TrainManagerTransitionImpl {
            transition_prop: 1.
        }
    }

    fn get_prop(&self) -> f64 {
        self.transition_prop
    }

    fn set(&mut self, val: f64) {
        self.transition_prop = val;
    }
}

pub(super) struct TrainManagerTransition {
    imp: Arc<Mutex<TrainManagerTransitionImpl>>,
    runner: ZhooshRunner,
    control: Option<ZhooshSequenceControl>,
    zhoosh_fast: Zhoosh<Arc<Mutex<TrainManagerTransitionImpl>>,f64>,
    zhoosh_slow: Zhoosh<Arc<Mutex<TrainManagerTransitionImpl>>,f64>
}

impl TrainManagerTransition {
    pub(super) fn new() -> TrainManagerTransition {
        TrainManagerTransition {
            imp: Arc::new(Mutex::new(TrainManagerTransitionImpl::new())),
            control: None,
            runner: ZhooshRunner::new(),
            zhoosh_fast: Zhoosh::new(MS_FADE_FAST,0.,0.,ZhooshShape::Quadratic(1.),ZHOOSH_LINEAR_F64_OPS,|imp: &mut Arc<Mutex<TrainManagerTransitionImpl>>,val| {
                imp.lock().unwrap().set(val);
            }),
            zhoosh_slow: Zhoosh::new(MS_FADE_SLOW,0.,0.,ZhooshShape::Quadratic(1.),ZHOOSH_LINEAR_F64_OPS,|imp: &mut Arc<Mutex<TrainManagerTransitionImpl>>,val| {
                imp.lock().unwrap().set(val);
            }),
        }
    }

    pub(super) fn get_prop(&self) -> f64 {
        ok!(self.imp.lock()).get_prop()
    }

    pub(super) fn reset(&mut self) {
        if let Some(mut control) = self.control.take() {
            control.abandon();
        }
        ok!(self.imp.lock()).set(0.);
    }

    pub(super) fn start(&mut self, t: f64, slow: bool) {
        self.reset();
        let zhoosh = if slow { &self.zhoosh_slow } else { &self.zhoosh_fast };
        let mut seq = ZhooshSequence::new();
        seq.add(ZhooshStep::new(&zhoosh,self.imp.clone(),0.,1.));
        self.control = Some(seq.run(&mut self.runner));
    }

    pub(super) fn update(&mut self, t: f64) {
        self.runner.step(t);
    }
}
