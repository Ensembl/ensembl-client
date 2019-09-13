use std::cell::RefCell;
use std::rc::Rc;

use super::ops::{ ZhooshOps, ZHOOSH_EMPTY_OPS };
use super::shapes::ZhooshShape;

/* TODO: 
 * depub
 * doc
 */

struct ZhooshImpl<X,T> {
    after_prop: Vec<f64>,
    delay: f64, 
    max_time: f64,
    min_speed: f64,
    shape: ZhooshShape,
    ops: Box<dyn ZhooshOps<T>>,
    cb: Box<dyn Fn(&mut X,T)>
}

#[derive(Clone)]
pub struct Zhoosh<X,T>(Rc<ZhooshImpl<X,T>>);

impl<X,T> Zhoosh<X,T> {
    pub fn new<F,U>(max_time: f64, min_speed: f64, after_prop: &[f64], delay: f64, shape: ZhooshShape, ops: U, cb: F) -> Zhoosh<X,T>
            where F: Fn(&mut X,T) + 'static, U: ZhooshOps<T> + 'static {
        Zhoosh(Rc::new(ZhooshImpl {
            after_prop: after_prop.to_vec(),
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
struct ZhooshRunImpl<X,T> {
    zhoosh: Zhoosh<X,T>,
    target: X,
    start: T,
    end: T,
    after: Vec<ZhooshRun>,
    started: Option<f64>,
    delay: Option<f64>,
    prop: Option<f64>,
    distance: f64
}

impl<X,T> ZhooshRunImpl<X,T> {
    fn new(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T, after: &[ZhooshRun]) -> ZhooshRunImpl<X,T> {
        let distance = zhoosh.0.ops.distance(&start,&end);
        if after.len() != zhoosh.0.after_prop.len() {
            panic!("after must match expceted length from zhoosh ({} vs {})",after.len(),zhoosh.0.after_prop.len());
        }
        ZhooshRunImpl {
            zhoosh: Zhoosh(zhoosh.0.clone()),
            target, start, end, distance,
            after: after.to_vec(),
            started: None,
            delay: None,
            prop: None
        }
    }

    fn startable(&mut self, now: f64) -> bool {
        if let Some(delay_start) = self.delay {
            /* dependency already triggered. awaiting a delay timeout? */
            return now-delay_start >= self.zhoosh.0.delay;
        } else {
            let mut after_prop = self.zhoosh.0.after_prop.iter();
            for after in &self.after {
                /* how far through is this dependency? */
                let cond = after.0.borrow_mut();
                let prop = cond.get_prop();
                /* is the dependency even started yet? */
                if prop.is_none() { return false; }
                /* dependency satisfied? */
                if prop.unwrap() < *after_prop.next().unwrap() { return false; }
            }
            if self.zhoosh.0.delay > 0. {
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
        /* new starter? */
        if self.prop.is_none() && self.startable(now) {
            self.prop = Some(0.);
            self.started = Some(now);
        }
        /* update prop */
        if self.prop.is_some() && self.started.is_some() {
            self.prop = Some(self.zhoosh.prop_of(now-self.started.unwrap(),self.distance).min(1.).max(0.));
        }
        /* callback */
        if self.started.is_some() {
            let pos = self.zhoosh.0.shape.linearize(self.prop.unwrap());
            let pos = self.zhoosh.0.ops.interpolate(pos,&self.start,&self.end);
            (self.zhoosh.0.cb)(&mut self.target,pos);
        }
        /* finished? */
        if self.started.is_some() && self.prop.unwrap() >= 1. {
            self.started = None;
        }
    }
}

trait ZhooshRunTrait {
    fn get_prop(&self) -> Option<f64>;
    fn step(&mut self, now: f64) -> bool;
    fn update_all_props(&mut self, now: f64);
}

impl<X,T> ZhooshRunTrait for ZhooshRunImpl<X,T> {
    fn get_prop(&self) -> Option<f64> { self.prop }

    fn update_all_props(&mut self, now: f64) {
        for after in &self.after {
            after.0.borrow_mut().update_all_props(now);
        }
        self.update_prop(now);
    }

    fn step(&mut self, now: f64) -> bool {
        self.update_all_props(now);
        if self.prop.is_some() && self.started.is_none() { return false; }
        return true;
    }
}

#[derive(Clone)]
pub struct ZhooshRun(Rc<RefCell<dyn ZhooshRunTrait>>);

impl ZhooshRun {
    pub fn new<X,T>(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T, after: &[ZhooshRun]) -> ZhooshRun where T: 'static, X: 'static {
        ZhooshRun(Rc::new(RefCell::new(ZhooshRunImpl::new(zhoosh,target,start,end,after))))
    }

    fn step(&mut self, now: f64) -> bool {
        self.0.borrow_mut().step(now)
    }
}

pub fn zhoosh_collect(after: &[ZhooshRun], after_prop: &[f64]) -> ZhooshRun {
    let cb = move |_: &mut (), _: ()| {};
    let z = Zhoosh::new(0.,0.,after_prop,0.,ZhooshShape::Linear,ZHOOSH_EMPTY_OPS,cb);
    ZhooshRun::new(&z,(),(),(),after)
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

    pub fn add(&mut self, run: ZhooshRun) {
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
