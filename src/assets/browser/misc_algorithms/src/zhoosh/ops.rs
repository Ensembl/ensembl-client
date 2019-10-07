use std::marker::PhantomData;
use std::ops::{ Add, Sub, Mul, Div };

pub trait ZhooshOps<T> {
    fn interpolate(&self, prop: f64, from: &T, to: &T) -> T;
    fn distance(&self, from: &T, to: &T) -> f64;
}

pub struct ZhooshLinearStdOps<T,U>(PhantomData<T>,PhantomData<U>);

impl<T,U> ZhooshOps<T> for ZhooshLinearStdOps<T,U>
            where T: Add<Output=T>, U: From<f64> + Into<f64>, for<'a> &'a T: Sized + Sub<Output=U> + Mul<U,Output=T> {
    fn interpolate(&self, prop: f64, from: &T, to: &T) -> T {
        from * (1.-prop).into() + to * prop.into()
    }

    fn distance(&self, from: &T, to: &T) -> f64 {
        (to - from).into()
    }
}

pub trait ZhooshPowf<T> {
    fn zhoosh_powf(&self, b: f64) -> T;
}

impl ZhooshPowf<f64> for f64 {
    fn zhoosh_powf(&self, b: f64) -> f64 { self.powf(b) }
}

pub struct ZhooshPropStdOps<T,U>(PhantomData<T>,PhantomData<U>);

impl<T,U> ZhooshOps<T> for ZhooshPropStdOps<T,U> 
    where T: Add<Output=T> + Mul<T,Output=T> + ZhooshPowf<T>, U: From<f64> + Into<f64>, for<'a> &'a T: Sized + Div<&'a T,Output=U> {
    fn interpolate(&self, prop: f64, from: &T, to: &T) -> T {
        from.zhoosh_powf(prop.into()) * to.zhoosh_powf((1.-prop).into())
    }

    fn distance(&self, from: &T, to: &T) -> f64 {
        (to/from).into()
    }
}

pub struct ZhooshEmptyOps();

impl ZhooshOps<()> for ZhooshEmptyOps {
    fn interpolate(&self, _: f64, _: &(), _: &()) -> () { () }
    fn distance(&self, _: &(), _: &()) -> f64 { 0. }
}

pub struct ZhooshBangOps<T>(pub PhantomData<T>);

impl<T> ZhooshOps<T> for ZhooshBangOps<T> where T: Clone+Sized {
    fn interpolate(&self, prop: f64, from: &T, to: &T) -> T {
        if prop < 0.5 { from.clone() } else { to.clone() }
    }

    fn distance(&self, from: &T, to: &T) -> f64 { 1. }
}

pub const ZHOOSH_LINEAR_F64_OPS : ZhooshLinearStdOps<f64,f64> = ZhooshLinearStdOps::<f64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_LINEAR_F32_OPS : ZhooshLinearStdOps<f32,f32> = ZhooshLinearStdOps::<f32,f32>(PhantomData,PhantomData);
pub const ZHOOSH_LINEAR_I64_OPS : ZhooshLinearStdOps<i64,f64> = ZhooshLinearStdOps::<i64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_LINEAR_I32_OPS : ZhooshLinearStdOps<i32,f32> = ZhooshLinearStdOps::<i32,f32>(PhantomData,PhantomData);
pub const ZHOOSH_LINEAR_U64_OPS : ZhooshLinearStdOps<u64,f64> = ZhooshLinearStdOps::<u64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_LINEAR_U32_OPS : ZhooshLinearStdOps<u32,f32> = ZhooshLinearStdOps::<u32,f32>(PhantomData,PhantomData);

pub const ZHOOSH_PROP_F64_OPS : ZhooshPropStdOps<f64,f64> = ZhooshPropStdOps::<f64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_PROP_F32_OPS : ZhooshPropStdOps<f32,f32> = ZhooshPropStdOps::<f32,f32>(PhantomData,PhantomData);
pub const ZHOOSH_PROP_I64_OPS : ZhooshPropStdOps<i64,f64> = ZhooshPropStdOps::<i64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_PROP_I32_OPS : ZhooshPropStdOps<i32,f32> = ZhooshPropStdOps::<i32,f32>(PhantomData,PhantomData);
pub const ZHOOSH_PROP_U64_OPS : ZhooshPropStdOps<u64,f64> = ZhooshPropStdOps::<u64,f64>(PhantomData,PhantomData);
pub const ZHOOSH_PROP_U32_OPS : ZhooshPropStdOps<u32,f32> = ZhooshPropStdOps::<u32,f32>(PhantomData,PhantomData);

pub const ZHOOSH_EMPTY_OPS : ZhooshEmptyOps = ZhooshEmptyOps();