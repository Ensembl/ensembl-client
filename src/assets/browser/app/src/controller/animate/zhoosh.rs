use std::cell::RefCell;
use std::rc::Rc;

/* TODO: 
 * delay, 
 * min_speed
 * crate
 * unit test
 */

pub enum ZhooshShape {
    Linear,
    Quadratic(f64,f64)
}

fn quadA(x: f64) -> f64 { x*x/2. }
fn quadB(x: f64, a: f64) -> f64 { x-a }
fn quadC(x: f64, b: f64) -> f64 { (x+b-1.)*(x+b-1.)/2. }

impl ZhooshShape {
    pub fn linearize(&self, x: f64) -> f64 {
        match self {
            ZhooshShape::Linear => x,
            ZhooshShape::Quadratic(a,b) => {
                (if x < *a {
                    quadA(x) 
                } else if x < 1.-*b {
                    quadA(*a) + quadB(x,*a)
                } else if *b > 0. {
                    quadA(*a) + quadB(1.-*b,*a) + quadC(x,*b)
                } else {
                    1.
                }) / (1. - (*a+*b)/2. )
            }
        }
    }
}

pub struct ZhooshImpl<X,T> {
    after_prop: f64,
    delay: f64, 
    max_time: f64,
    min_speed: f64,
    shape: ZhooshShape,
    derive: Box<Fn(f64,&T,&T) -> T>,
    cb: Box<Fn(&mut X,T)>
}

#[derive(Clone)]
pub struct Zhoosh<X,T>(Rc<ZhooshImpl<X,T>>);

impl<X,T> Zhoosh<X,T> {
    pub fn new(max_time: f64, min_speed: f64, after_prop: f64, delay: f64, shape: ZhooshShape, derive: Box<Fn(f64,&T,&T) -> T>, cb: Box<Fn(&mut X,T)>) -> Zhoosh<X,T>  {
        Zhoosh(Rc::new(ZhooshImpl {
            after_prop, delay, max_time, min_speed, shape, cb, derive
        }))
    }

    pub fn prop_of(&self, prop: f64) -> f64 {
        if self.0.max_time == 0. { return 1.; }
        prop / self.0.max_time
    }
}

pub struct ZhooshRunImpl<X,T> {
    zhoosh: Zhoosh<X,T>,
    target: X,
    start: T,
    end: T,
    after: Option<ZhooshRun>,
    started: Option<f64>,
    prop: Option<f64>,
}

impl<X,T> ZhooshRunImpl<X,T> {
    pub fn new(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T, after: Option<&ZhooshRun>) -> ZhooshRunImpl<X,T> {
        ZhooshRunImpl {
            zhoosh: Zhoosh(zhoosh.0.clone()),
            target, start, end,
            after: after.map(|v| ZhooshRun(v.0.clone())),
            started: None,
            prop: None
        }
    }

    fn startable(&self) -> bool {
        if self.after.is_none() { return true; }
        let cond_run = self.after.as_ref().unwrap();
        let cond = cond_run.0.borrow_mut();
        let prop = cond.get_prop();
        prop.is_some() && prop.unwrap() >= self.zhoosh.0.after_prop
    }

    fn update_prop(&mut self, now: f64) {
        /* new starter? */
        if self.prop.is_none() && self.startable() {
            self.prop = Some(0.);
            self.started = Some(now);
        }
        /* update prop */
        if self.prop.is_some() && self.started.is_some() {
            self.prop = Some(self.zhoosh.prop_of(now-self.started.unwrap()).min(1.).max(0.));
        }
        /* callback */
        if self.started.is_some() {
            let pos = self.zhoosh.0.shape.linearize(self.prop.unwrap());
            let pos = (self.zhoosh.0.derive)(pos,&self.start,&self.end);
            (self.zhoosh.0.cb)(&mut self.target,pos);
        }
        /* finished? */
        if self.started.is_some() && self.started.unwrap() >= 1. {
            self.started = None;
        }
    }
}

pub trait ZhooshRunTrait {
    fn get_prop(&self) -> Option<f64>;
    fn is_done(&self) -> bool;
    fn step(&mut self, now: f64) -> bool;
    fn update_all_props(&mut self, now: f64);
}

impl<X,T> ZhooshRunTrait for ZhooshRunImpl<X,T> {
    fn is_done(&self) -> bool {
        if self.prop.is_none() || self.prop.unwrap() < 1. { return false; }
        if let Some(prev) = &self.after {
            return prev.0.borrow_mut().is_done();
        }
        return true;
    }

    fn get_prop(&self) -> Option<f64> { self.prop }

    fn update_all_props(&mut self, now: f64) {
        /* dependents */
        self.update_prop(now);
        if let Some(prev) = &self.after {
            prev.0.borrow_mut().update_all_props(now);
        }
    }

    fn step(&mut self, now: f64) -> bool {
        if self.is_done() { return false; }
        self.update_prop(now);
        return true;
    }
}

#[derive(Clone)]
pub struct ZhooshRun(Rc<RefCell<ZhooshRunTrait>>);

impl ZhooshRun {
    pub fn new<X,T>(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T, after: Option<&ZhooshRun>) -> ZhooshRun where T: 'static, X: 'static {
        ZhooshRun(Rc::new(RefCell::new(ZhooshRunImpl::new(zhoosh,target,start,end,after))))
    }

    pub fn step(&mut self, now: f64) {
        self.0.borrow_mut().step(now);
    }
}
