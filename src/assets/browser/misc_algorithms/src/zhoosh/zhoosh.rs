use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use super::ops::{ ZhooshOps, ZHOOSH_EMPTY_OPS };
use super::shapes::ZhooshShape;

/* TODO: 
 * depub
 * doc
 */

struct ZhooshImpl<X,T> {
    //after_prop: Vec<f64>,
    delay: f64, 
    max_time: f64,
    min_speed: f64,
    shape: ZhooshShape,
    ops: Box<dyn ZhooshOps<T> + Send+Sync>,
    cb: Box<dyn Fn(&mut X,T) + Send+Sync>
}

#[derive(Clone)]
pub struct Zhoosh<X,T>(Arc<ZhooshImpl<X,T>>);

impl<X,T> Zhoosh<X,T> {
    pub fn new<F,U>(max_time: f64, min_speed: f64, delay: f64, shape: ZhooshShape, ops: U, cb: F) -> Zhoosh<X,T>
            where F: Fn(&mut X,T) + Send+Sync + 'static, U: ZhooshOps<T> + 'static + Send+Sync {
        Zhoosh(Arc::new(ZhooshImpl {
            //after_prop: after_prop.to_vec(),
            delay, max_time, min_speed, shape, cb: Box::new(cb),
            ops: Box::new(ops)
        }))
    }

    fn prop_of(&self, prop: f64, distance: f64) -> f64 {
        if self.0.max_time == 0. { return 1.; }
        let speedup = if distance > 0. && self.0.min_speed > 0. {
            self.0.min_speed / distance
        } else {
            1.
        };
        prop * speedup / self.0.max_time
    }
}

#[derive(Clone)]
pub struct ZhooshRunSpec<X,T> {
    zhoosh: Zhoosh<X,T>,
    target: X,
    start: T,
    end: T,
    after_prop: Vec<f64>,
    distance: f64,
    after: Vec<ZhooshRunState>,
}

impl<X,T> ZhooshRunSpec<X,T> {
    pub fn new(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T) -> ZhooshRunSpec<X,T> {
        let distance = zhoosh.0.ops.distance(&start,&end);
        ZhooshRunSpec {
            zhoosh: Zhoosh(zhoosh.0.clone()),
            target, start, end, distance,
            after: Vec::new(),
            after_prop: Vec::new()
        }
    }
}

trait ZhooshSpecTrait {
    fn add_trigger(&mut self, after: ZhooshRunState, after_prop: f64);
    fn set(&mut self, prop: f64);
    fn get_delay(&mut self) -> f64;
    fn calc_prop(&self,t : f64) -> f64;
    fn dependencies(&self) -> Vec<(ZhooshRunState,f64)>;
}

impl<X,T> ZhooshSpecTrait for ZhooshRunSpec<X,T> {
    fn add_trigger(&mut self, after: ZhooshRunState, after_prop: f64) {
        self.after.push(after);
        self.after_prop.push(after_prop);
    }

    fn set(&mut self, prop: f64) {
        let pos = self.zhoosh.0.shape.linearize(prop);
        let pos = self.zhoosh.0.ops.interpolate(pos,&self.start,&self.end);
        (self.zhoosh.0.cb)(&mut self.target,pos);
    }

    fn get_delay(&mut self) -> f64 { self.zhoosh.0.delay }

    fn calc_prop(&self,t : f64) -> f64 {
        self.zhoosh.prop_of(t,self.distance).min(1.).max(0.)
    }

    fn dependencies(&self) -> Vec<(ZhooshRunState,f64)> {
        let mut out = Vec::new();
        let mut after_prop = self.after_prop.iter();
        for after in &self.after {
            out.push((after.clone(),*after_prop.next().unwrap()));
        }
        out
    }
}

#[derive(Clone)]
pub struct ZhooshSpec(Arc<Mutex<ZhooshSpecTrait>>);

impl ZhooshSpec {
    pub fn new<X,T>(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T) -> ZhooshSpec where T: 'static, X: 'static {
        ZhooshSpec(Arc::new(Mutex::new(ZhooshRunSpec::new(zhoosh,target,start,end))))
    }

    fn set(&mut self, prop: f64) {
        self.0.lock().unwrap().set(prop);
    }

    pub fn add_trigger(&mut self, after: ZhooshRunState, after_prop: f64) {
        self.0.lock().unwrap().add_trigger(after,after_prop);
    }

    fn get_delay(&mut self) -> f64 {
        self.0.lock().unwrap().get_delay()
    }

    fn calc_prop(&self,t : f64) -> f64 {
        self.0.lock().unwrap().calc_prop(t)
    }

    fn dependencies(&self) -> Vec<(ZhooshRunState,f64)> {
        self.0.lock().unwrap().dependencies()
    }
}

#[derive(Clone)]
pub struct ZhooshRunState {
    spec: ZhooshSpec,
    started: Option<f64>,
    delay: Option<f64>,
    prop: Option<f64>,   
}

impl ZhooshRunState {
    pub fn new(spec: ZhooshSpec) -> ZhooshRunState {
        ZhooshRunState {
            spec,
            started: None,
            delay: None,
            prop: None,
        }
    }

    fn get_prop(&self) -> Option<f64> { self.prop }

    fn startable(&mut self, now: f64) -> bool {
        if let Some(delay_start) = self.delay {
            /* dependency already triggered. awaiting a delay timeout? */
            return now-delay_start >= self.spec.get_delay();
        } else {
            for (after,after_prop) in &self.spec.dependencies() {
                /* how far through is this dependency? */
                let prop = after.get_prop();
                /* is the dependency even started yet? */
                if prop.is_none() { return false; }
                /* dependency satisfied? */
                if prop.unwrap() < *after_prop { return false; }
            }
            if self.spec.get_delay() > 0. {
                /* start delay timer */
                self.delay = Some(now);
                return false;
            } else {
                /* go immediate */
                return true;
            }
        }
    }

    fn update_prop(&mut self, now: f64) {
        /* recurse to everyone who waits on us */
        for (mut after,_) in self.spec.dependencies() {
            after.update_prop(now);
        }
        /* new starter? */
        if self.prop.is_none() && self.startable(now) {
            self.prop = Some(0.);
            self.started = Some(now);
        }
        /* update prop */
        if self.prop.is_some() && self.started.is_some() {
            self.prop = Some(self.spec.calc_prop(now-self.started.unwrap()));
        }
        /* callback */
        if self.started.is_some() {
            self.spec.set(self.prop.unwrap());
        }
        /* finished? */
        if self.started.is_some() && self.prop.unwrap() >= 1. {
            self.started = None;
        }
    }

    fn step(&mut self, now: f64) -> bool {
        self.update_prop(now);
        if self.prop.is_some() && self.started.is_none() { return false; }
        return true;
    }

    // XXX should not be here!
    pub fn add_trigger(&mut self, after: ZhooshRunState, after_prop: f64) {
        self.spec.add_trigger(after,after_prop);
    }
}

pub fn zhoosh_collect() -> ZhooshSpec {
    let cb = move |_: &mut (), _: ()| {};
    let z = Zhoosh::new(0.,0.,0.,ZhooshShape::Linear,ZHOOSH_EMPTY_OPS,cb);
    ZhooshSpec::new(&z,(),(),())
}

pub struct ZhooshSequence {
    roots: Vec<ZhooshRunState>
}

impl ZhooshSequence {
    pub fn new() -> ZhooshSequence {
        ZhooshSequence {
            roots: Vec::new()
        }
    }

    pub fn add(&mut self, run: ZhooshRunState) {
        self.roots.push(run);
    }

    pub fn run(mut self, runner: &mut ZhooshRunner) {
        for root in self.roots.drain(..) {
            runner.add(root)
        }
    }
}

pub struct ZhooshRunner {
    runs: Vec<ZhooshRunState>
}

impl ZhooshRunner {
    pub fn new() -> ZhooshRunner {
        ZhooshRunner {
            runs: Vec::new()
        }
    }

    fn add(&mut self, run: ZhooshRunState) {
        self.runs.push(run);
    }

    pub fn step(&mut self, now: f64) {
        let mut keep = Vec::new();
        for mut run in self.runs.drain(..) {
            if run.step(now) {
                keep.push(run);
            }
        }
        self.runs = keep;
    }
}
