use std::sync::{ Arc, Mutex };
use owning_ref::MutexGuardRef;

use super::ops::ZhooshOps;
use super::shapes::ZhooshShape;

/* TODO: 
 * doc
 */

pub(super) struct ZhooshImpl<X,T> {
    delay: f64, 
    max_time: f64,
    min_speed: f64,
    shape: ZhooshShape,
    ops: Box<dyn ZhooshOps<T> + Send+Sync>,
    cb: Box<dyn Fn(&mut X,T) + Send+Sync>
}

impl<X,T> ZhooshImpl<X,T> {
    pub fn new<F,U>(max_time: f64, min_speed: f64, delay: f64, shape: ZhooshShape, ops: U, cb: F) -> ZhooshImpl<X,T>
            where F: Fn(&mut X,T) + Send+Sync + 'static, U: ZhooshOps<T> + 'static + Send+Sync {
        ZhooshImpl {
            delay, max_time, min_speed, shape, cb: Box::new(cb),
            ops: Box::new(ops)
        }
    }

    pub(super) fn prop_of(&self, prop: f64, distance: f64) -> f64 {
        if self.max_time == 0. { return 1.; }
        let speedup = if distance > 0. && self.min_speed > 0. {
            self.min_speed / distance
        } else {
            1.
        };
        prop * speedup / self.max_time
    }

    pub(super) fn get_delay(&self) -> f64 { self.delay }
    pub(super) fn get_ops(&self) -> &Box<dyn ZhooshOps<T>+Send+Sync> { &self.ops }
    pub(super) fn get_shape(&self) -> &ZhooshShape { &self.shape }
    pub(super) fn get_cb(&self) -> &Box<dyn Fn(&mut X,T) + Send+Sync> { &self.cb }
}

pub struct Zhoosh<X,T>(Arc<Mutex<ZhooshImpl<X,T>>>);

impl<X,T> Clone for Zhoosh<X,T> {
    fn clone(&self) -> Self {
        Zhoosh(self.0.clone())
    }
}

impl<X,T> Zhoosh<X,T> {
    pub fn new<F,U>(max_time: f64, min_speed: f64, delay: f64, shape: ZhooshShape, ops: U, cb: F) -> Zhoosh<X,T>
            where F: Fn(&mut X,T) + Send+Sync + 'static, U: ZhooshOps<T> + 'static + Send+Sync {
        Zhoosh(Arc::new(Mutex::new(ZhooshImpl::new(max_time,min_speed,delay,shape,ops,cb))))
    }

    pub(super) fn imp<'ret>(&'ret self) -> MutexGuardRef<'ret,ZhooshImpl<X,T>> {
        MutexGuardRef::new(self.0.lock().unwrap())
    }

}
