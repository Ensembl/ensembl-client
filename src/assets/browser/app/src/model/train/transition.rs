use std::sync::{ Arc, Mutex };

use zhoosh::{ Zhoosh, ZhooshRunner, ZhooshSequence, ZhooshSequenceControl, ZhooshShape, ZhooshStep, ZHOOSH_LINEAR_F64_OPS };

const MS_FADE_FAST : f64 = 100.;
const MS_FADE_SLOW : f64 = 750.;

pub(super) struct TrainManagerTransition {
    imp: Arc<Mutex<f64>>,
    runner: ZhooshRunner,
    control: Option<ZhooshSequenceControl>,
    zhoosh_fast: Zhoosh<Arc<Mutex<f64>>,f64>,
    zhoosh_slow: Zhoosh<Arc<Mutex<f64>>,f64>
}

impl TrainManagerTransition {
    fn zhoosh_new(speed: f64) -> Zhoosh<Arc<Mutex<f64>>,f64> {
        Zhoosh::new(speed,0.,0.,ZhooshShape::Quadratic(1.),ZHOOSH_LINEAR_F64_OPS,|imp: &mut Arc<Mutex<f64>>,val| {
            *imp.lock().unwrap() = val;
        })
    }

    pub(super) fn new() -> TrainManagerTransition {
        TrainManagerTransition {
            imp: Arc::new(Mutex::new(1.)),
            control: None,
            runner: ZhooshRunner::new(),
            zhoosh_fast: TrainManagerTransition::zhoosh_new(MS_FADE_FAST),
            zhoosh_slow: TrainManagerTransition::zhoosh_new(MS_FADE_SLOW)
        }
    }

    pub(super) fn get_prop(&self) -> f64 {
        *ok!(self.imp.lock())
    }

    pub(super) fn reset(&mut self) {
        if let Some(mut control) = self.control.take() {
            control.abandon();
        }
        *ok!(self.imp.lock()) = 0.;
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
