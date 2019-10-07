use std::cell::RefCell;
use std::fmt::Debug;
use std::marker::PhantomData;
use std::ops::{ Add, Mul, Sub };
use std::rc::Rc;

use misc_algorithms::zhoosh::{ Zhoosh, ZhooshBangOps, ZhooshOps, ZhooshRun, ZhooshRunner, ZhooshShape, ZHOOSH_LINEAR_F64_OPS };

use controller::input::Action;
use types::Dot;

/* DotOps: All about the Dot type, for the benefit of zhoosh */

struct DotOps<X,Y>(PhantomData<X>,PhantomData<Y>);

impl<X,Y> ZhooshOps<Dot<X,Y>> for DotOps<X,Y> 
    where X: Clone+Copy+Debug + Add<X,Output=X> + Sub<X,Output=X> + Mul<X,Output=X> + Add<Y,Output=Y> + From<f64>,
          Y: Clone+Copy+Debug + Add<Y,Output=Y> + Sub<Y,Output=Y> + Mul<Y,Output=Y> + From<f64> + Into<f64> {
    fn interpolate(&self, prop: f64, from: &Dot<X,Y>, to: &Dot<X,Y>) -> Dot<X,Y> {
        *from * Dot((1.-prop).into(),(1.-prop).into()) + *to * Dot(prop.into(),prop.into())
    }

    fn distance(&self, from: &Dot<X,Y>, to: &Dot<X,Y>) -> f64 {
        let delta = (*to - *from);
        (delta.0*delta.0 + delta.1*delta.1).into().sqrt()
    }
}

/* PendingActions allows callbacks to schedule an action after they are run */

#[derive(Clone)]
pub struct PendingActions(Rc<RefCell<Vec<Action>>>);

impl PendingActions {
    pub fn new() -> PendingActions {
        PendingActions(Rc::new(RefCell::new(Vec::new())))
    }

    pub fn add(&mut self, action: Action) {
        self.0.borrow_mut().push(action);
    }

    pub fn take(&mut self) -> Vec<Action> {
        self.0.replace(Vec::new())
    }
}

/* Zhoosh's that animators can create */

pub fn action_zhoosh_bang<F,T>(after_prop: &[f64], delay: f64, cb: F) -> Zhoosh<PendingActions,T>
        where F: Fn(&mut PendingActions,T) + 'static, T: Clone + 'static {
    let ops : ZhooshBangOps<T> = ZhooshBangOps::<T>(PhantomData);
    Zhoosh::new(0.,0.,after_prop,delay,ZhooshShape::Linear,ops,cb)
}

pub fn action_zhoosh_pos<F,X,Y>(max_time: f64, min_speed: f64, after_prop: &[f64], delay: f64, cb: F) -> Zhoosh<PendingActions,Dot<X,Y>>
            where F: Fn(&mut PendingActions,Dot<X,Y>) + 'static,
                  X: Clone+Copy+Debug + Add<X,Output=X> + Sub<X,Output=X> + Mul<X,Output=X> + Add<Y,Output=Y> + From<f64> + 'static,
                  Y: Clone+Copy+Debug + Add<Y,Output=Y> + Sub<Y,Output=Y> + Mul<Y,Output=Y> + From<f64> + Into<f64> + 'static {
    Zhoosh::new(max_time,min_speed,after_prop,delay,ZhooshShape::Quadratic(1.),DotOps::<X,Y>(PhantomData,PhantomData),cb)
}

pub fn action_zhoosh_zoom<F>(max_time: f64, min_speed: f64, after_prop: &[f64], delay: f64, cb: F) -> Zhoosh<PendingActions,f64>
            where F: Fn(&mut PendingActions,f64) + 'static {
    Zhoosh::new(max_time,min_speed,after_prop,delay,ZhooshShape::Quadratic(1.),ZHOOSH_LINEAR_F64_OPS,cb)
}

/* Main access for animators */

#[derive(Clone)]
pub struct ActionAnimator {
    zhoosh_run: Rc<RefCell<ZhooshRunner>>,
    actions: PendingActions
}

impl ActionAnimator {
    pub fn new() -> ActionAnimator {
        ActionAnimator {
            zhoosh_run: Rc::new(RefCell::new(ZhooshRunner::new())),
            actions: PendingActions::new()
        }
    }

    pub fn add<T>(&mut self, zhoosh: &Zhoosh<PendingActions,T>, start: T, end: T, after: &[ZhooshRun]) -> ZhooshRun where T: 'static+Debug {
        ZhooshRun::new(zhoosh,self.actions.clone(),start,end,after)
    }

    pub fn run(&mut self, run: ZhooshRun) {
        self.zhoosh_run.borrow_mut().add(run.clone());
    }

    pub fn tick(&mut self, t: f64) -> Vec<Action> {
        self.zhoosh_run.borrow_mut().step(t);
        self.actions.take()
    }
}
