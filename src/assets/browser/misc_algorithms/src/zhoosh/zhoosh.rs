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
    after: Vec<ZhooshRun>,
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

    pub fn add_trigger(&mut self, after: ZhooshRun, after_prop: f64) {
        self.after.push(after);
        self.after_prop.push(after_prop);
    }

    fn constrained(&self) -> bool {
        self.after.len() > 0
    }
}

#[derive(Clone)]
struct ZhooshRunState {
    started: Option<f64>,
    delay: Option<f64>,
    prop: Option<f64>,   
}

impl ZhooshRunState {
    pub fn new() -> ZhooshRunState {
        ZhooshRunState {
            started: None,
            delay: None,
            prop: None,
        }
    }

    fn startable<X,T>(&mut self, now: f64, spec: &ZhooshRunSpec<X,T>) -> bool {
        if let Some(delay_start) = self.delay {
            /* dependency already triggered. awaiting a delay timeout? */
            return now-delay_start >= spec.zhoosh.0.delay;
        } else {
            let mut after_prop = spec.after_prop.iter();
            for after in &spec.after {
                /* how far through is this dependency? */
                let cond = after.0.lock().unwrap();
                let prop = cond.get_prop();
                /* is the dependency even started yet? */
                if prop.is_none() { return false; }
                /* dependency satisfied? */
                if prop.unwrap() < *after_prop.next().unwrap() { return false; }
            }
            if spec.zhoosh.0.delay > 0. {
                /* start delay timer */
                self.delay = Some(now);
                return false;
            } else {
                /* go immediate */
                return true;
            }
        }
    }

    fn update_prop<X,T>(&mut self, now: f64, spec: &mut ZhooshRunSpec<X,T>) {
        /* new starter? */
        if self.prop.is_none() && self.startable(now,spec) {
            self.prop = Some(0.);
            self.started = Some(now);
        }
        /* update prop */
        if self.prop.is_some() && self.started.is_some() {
            self.prop = Some(spec.zhoosh.prop_of(now-self.started.unwrap(),spec.distance).min(1.).max(0.));
        }
        /* callback */
        if self.started.is_some() {
            let pos = spec.zhoosh.0.shape.linearize(self.prop.unwrap());
            let pos = spec.zhoosh.0.ops.interpolate(pos,&spec.start,&spec.end);
            (spec.zhoosh.0.cb)(&mut spec.target,pos);
        }
        /* finished? */
        if self.started.is_some() && self.prop.unwrap() >= 1. {
            self.started = None;
        }
    }
}

#[derive(Clone)]
struct ZhooshRunImpl<X,T> {
    spec: ZhooshRunSpec<X,T>,
    state: ZhooshRunState
}

impl<X,T> ZhooshRunImpl<X,T> {
    fn new(spec: ZhooshRunSpec<X,T>) -> ZhooshRunImpl<X,T> {
        ZhooshRunImpl {
            spec,
            state: ZhooshRunState::new()
        }
    }

    fn startable(&mut self, now: f64) -> bool {
        self.state.startable(now,&self.spec)
    }

    fn update_prop(&mut self, now: f64) {
        self.state.update_prop(now, &mut self.spec);
    }
}

trait ZhooshRunTrait {
    fn get_prop(&self) -> Option<f64>;
    fn step(&mut self, now: f64) -> bool;
    fn update_all_props(&mut self, now: f64);
    fn add_trigger(&mut self, after: ZhooshRun, after_prop: f64);
    fn constrained(&self) -> bool;
}

impl<X,T> ZhooshRunTrait for ZhooshRunImpl<X,T> {
    fn get_prop(&self) -> Option<f64> { self.state.prop }

    fn update_all_props(&mut self, now: f64) {
        for after in &self.spec.after {
            after.0.lock().unwrap().update_all_props(now);
        }
        self.update_prop(now);
    }

    fn step(&mut self, now: f64) -> bool {
        self.update_all_props(now);
        if self.state.prop.is_some() && self.state.started.is_none() { return false; }
        return true;
    }

    fn add_trigger(&mut self, after: ZhooshRun, after_prop: f64) {
        self.spec.add_trigger(after,after_prop);
    }

    fn constrained(&self) -> bool {
        self.spec.constrained()
    }
}

#[derive(Clone)]
pub struct ZhooshRun(Arc<Mutex<dyn ZhooshRunTrait>>);

impl ZhooshRun {
    pub fn new<X,T>(spec: ZhooshRunSpec<X,T>) -> ZhooshRun where T: 'static, X: 'static {
        ZhooshRun(Arc::new(Mutex::new(ZhooshRunImpl::new(spec))))
    }

    fn constrained(&self) -> bool {
        self.0.lock().unwrap().constrained()
    }

    fn step(&mut self, now: f64) -> bool {
        self.0.lock().unwrap().step(now)
    }

    pub fn add_trigger(&mut self, after: ZhooshRun, after_prop: f64) {
        self.0.lock().unwrap().add_trigger(after,after_prop);
    }
}

pub fn zhoosh_collect() -> ZhooshRun {
    let cb = move |_: &mut (), _: ()| {};
    let z = Zhoosh::new(0.,0.,0.,ZhooshShape::Linear,ZHOOSH_EMPTY_OPS,cb);
    let spec = ZhooshRunSpec::new(&z,(),(),());
    ZhooshRun::new(spec)
}

pub struct ZhooshSequence {
    roots: Vec<ZhooshRun>
}

impl ZhooshSequence {
    pub fn new() -> ZhooshSequence {
        ZhooshSequence {
            roots: Vec::new()
        }
    }

    pub fn add(&mut self, run: ZhooshRun) {
        self.roots.push(run);
    }

    pub fn run(mut self, runner: &mut ZhooshRunner) {
        for root in self.roots.drain(..) {
            runner.add(root)
        }
    }
}

pub struct ZhooshRunner {
    runs: Vec<ZhooshRun>
}

impl ZhooshRunner {
    pub fn new() -> ZhooshRunner {
        ZhooshRunner {
            runs: Vec::new()
        }
    }

    fn add(&mut self, run: ZhooshRun) {
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
