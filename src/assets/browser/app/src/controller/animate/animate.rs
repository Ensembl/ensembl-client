use std::cell::RefCell;
use std::fmt::Debug;
use std::marker::PhantomData;
use std::ops::{ Add, Mul, Sub };
use std::rc::Rc;
use std::sync::{ Arc, Mutex };

use misc_algorithms::zhoosh::{ Zhoosh, ZhooshBangOps, ZhooshStepHandle, ZhooshOps, ZhooshStep, ZhooshRunner, ZhooshSequence, ZhooshShape, ZHOOSH_LINEAR_F64_OPS };

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
pub struct PendingActions(Arc<Mutex<Option<Vec<Action>>>>);

impl PendingActions {
    pub fn new() -> PendingActions {
        PendingActions(Arc::new(Mutex::new(Some(Vec::new()))))
    }

    pub fn add(&mut self, action: Action) {
        self.0.lock().unwrap().as_mut().unwrap().push(action);
    }

    pub fn take(&mut self) -> Vec<Action> {
        self.0.lock().unwrap().replace(Vec::new()).unwrap()
    }
}

/* Zhoosh's that animators can create */

pub fn action_zhoosh_bang<F,T>(delay: f64, cb: F) -> Zhoosh<PendingActions,T>
        where F: Fn(&mut PendingActions,T) + 'static + Send+Sync, T: Clone + 'static + Send+Sync {
    let ops : ZhooshBangOps<T> = ZhooshBangOps::<T>(PhantomData);
    Zhoosh::new(0.,0.,delay,ZhooshShape::Linear,ops,cb)
}

pub fn action_zhoosh_pos<F,X,Y>(max_time: f64, min_speed: f64, delay: f64, cb: F) -> Zhoosh<PendingActions,Dot<X,Y>>
            where F: Fn(&mut PendingActions,Dot<X,Y>) + 'static +Send+Sync,
                  X: Clone+Copy+Debug + Add<X,Output=X> + Sub<X,Output=X> + Mul<X,Output=X> + Add<Y,Output=Y> + From<f64> + 'static + Send+Sync,
                  Y: Clone+Copy+Debug + Add<Y,Output=Y> + Sub<Y,Output=Y> + Mul<Y,Output=Y> + From<f64> + Into<f64> + 'static + Send+Sync {
    Zhoosh::new(max_time,min_speed,delay,ZhooshShape::Quadratic(1.),DotOps::<X,Y>(PhantomData,PhantomData),cb)
}

pub fn action_zhoosh_zoom<F>(max_time: f64, min_speed: f64, delay: f64, cb: F) -> Zhoosh<PendingActions,f64>
            where F: Fn(&mut PendingActions,f64) + 'static +Send+Sync {
    Zhoosh::new(max_time,min_speed,delay,ZhooshShape::Quadratic(1.),ZHOOSH_LINEAR_F64_OPS,cb)
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

    pub fn new_sequence(&mut self) -> ZhooshSequence {
        ZhooshSequence::new()
    }

    pub fn new_step<T>(&mut self, seq: &mut ZhooshSequence, zhoosh: &Zhoosh<PendingActions,T>, start: T, end: T) -> ZhooshStepHandle where T: 'static+Debug {
        let spec = ZhooshStep::new(zhoosh,self.actions.clone(),start,end);
        seq.add(spec)
    }

    pub fn run(&mut self, seq: ZhooshSequence) {
        seq.run(&mut self.zhoosh_run.borrow_mut());
    }

    pub fn tick(&mut self, t: f64) -> Vec<Action> {
        self.zhoosh_run.borrow_mut().step(t);
        self.actions.take()
    }
}
