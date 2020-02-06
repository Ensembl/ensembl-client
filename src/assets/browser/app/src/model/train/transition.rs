use std::sync::{ Arc, Mutex };

use zhoosh::{ Zhoosh, ZhooshOps, ZhooshRunner, ZhooshSequence, ZhooshSequenceControl, ZhooshShape, ZhooshStep, ZHOOSH_LINEAR_F64_OPS };

const MS_FADE_FAST : f64 = 250.;
const MS_FADE_SLOW : f64 = 2500.;

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
    imp: Arc<Mutex<CrossFade>>,
    runner: ZhooshRunner,
    control: Option<ZhooshSequenceControl>,
    zhoosh_fast: Zhoosh<Arc<Mutex<CrossFade>>,CrossFade>,
    zhoosh_slow: Zhoosh<Arc<Mutex<CrossFade>>,CrossFade>
}

fn modify_prop(v: f64, prop: f64, quad: f64) -> f64 {
    let v = (1.-v/prop).max(0.).min(1.);
    v*v*quad+v*(1.-quad)
}

#[derive(Clone,Copy)]
pub struct CrossFade(f64,f64,f64); /* (prop,dippyness,quadness) */

impl CrossFade {
    pub fn get_prop_up(&self) -> f64 {
        modify_prop(1.-self.0,self.1,self.2)
    }

    pub fn get_prop_down(&self) -> f64 {
        modify_prop(self.0,self.1,self.2)
    }
}

pub struct CrossFader(f64,f64);

impl ZhooshOps<CrossFade> for CrossFader {
    fn interpolate(&self, prop: f64, from: &CrossFade, to: &CrossFade) -> CrossFade {
        CrossFade(ZHOOSH_LINEAR_F64_OPS.interpolate(prop,&from.0,&to.0),self.0,self.1)
    }

    fn distance(&self, from: &CrossFade, to: &CrossFade) -> f64 {
        ZHOOSH_LINEAR_F64_OPS.distance(&from.0,&to.0)
    }
}

impl TrainManagerTransition {
    pub(super) fn new() -> TrainManagerTransition {
        TrainManagerTransition {
            imp: Arc::new(Mutex::new(CrossFade(1.,1.,0.))),
            control: None,
            runner: ZhooshRunner::new(),
            zhoosh_fast: Zhoosh::new(MS_FADE_FAST,0.,0.,ZhooshShape::Linear,CrossFader(1.0,0.0),|imp: &mut Arc<Mutex<CrossFade>>,val| {
                *imp.lock().unwrap() = val;
            }),
            zhoosh_slow: Zhoosh::new(MS_FADE_SLOW,0.,0.,ZhooshShape::Linear,CrossFader(0.6,1.0),|imp: &mut Arc<Mutex<CrossFade>>,val| {
                *imp.lock().unwrap() = val;
            }),
        }
    }

    pub(super) fn get_prop(&self) -> CrossFade {
        *ok!(self.imp.lock())
    }

    pub(super) fn reset(&mut self) {
        if let Some(mut control) = self.control.take() {
            control.abandon();
        }
        *ok!(self.imp.lock()) = CrossFade(0.,1.,0.);
    }

    pub(super) fn start(&mut self, t: f64, slow: bool) {
        console!("start slow={:?}",slow);
        self.reset();
        let zhoosh = if slow { &self.zhoosh_slow } else { &self.zhoosh_fast };
        let mut seq = ZhooshSequence::new();
        seq.add(ZhooshStep::new(&zhoosh,self.imp.clone(),CrossFade(0.,1.,0.),CrossFade(1.,1.,0.)));
        self.control = Some(seq.run(&mut self.runner));
    }

    pub(super) fn update(&mut self, t: f64) {
        self.runner.step(t);
    }
}
