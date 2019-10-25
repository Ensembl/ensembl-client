use super::ops::ZHOOSH_EMPTY_OPS;
use super::shapes::ZhooshShape;
use super::runner::ZhooshStepHandle;
use super::zhoosh::Zhoosh;

pub(super) struct ZhooshTrigger {
    pub(super) prop: f64,
    pub(super) handle: ZhooshStepHandle
}

struct ZhooshStepImpl<X,T> {
    zhoosh: Zhoosh<X,T>,
    target: X,
    start: T,
    end: T,
    after: Vec<ZhooshTrigger>,
    distance: f64,
}

impl<X,T> ZhooshStepImpl<X,T> {
    pub fn new(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T) -> ZhooshStepImpl<X,T> {
        let distance = zhoosh.imp().get_ops().distance(&start,&end);
        ZhooshStepImpl {
            zhoosh: zhoosh.clone(),
            target, start, end, distance,
            after: Vec::new()
        }
    }
}

trait ZhooshStepTrait {
    fn add_trigger(&mut self, after: &ZhooshStepHandle, after_prop: f64);
    fn set(&mut self, prop: f64);
    fn get_delay(&mut self) -> f64;
    fn calc_prop(&self,t : f64) -> f64;
    fn dependencies(&self) -> &Vec<ZhooshTrigger>;
}

impl<X,T> ZhooshStepTrait for ZhooshStepImpl<X,T> {
    fn add_trigger(&mut self, handle: &ZhooshStepHandle, prop: f64) {
        self.after.push(ZhooshTrigger { handle: *handle, prop });
    }

    fn set(&mut self, prop: f64) {
        let pos = self.zhoosh.imp().get_shape().linearize(prop);
        let pos = self.zhoosh.imp().get_ops().interpolate(pos,&self.start,&self.end);
        (self.zhoosh.imp().get_cb())(&mut self.target,pos);
    }

    fn get_delay(&mut self) -> f64 { self.zhoosh.imp().get_delay() }

    fn calc_prop(&self,t : f64) -> f64 {
        self.zhoosh.imp().prop_of(t,self.distance).min(1.).max(0.)
    }

    fn dependencies(&self) -> &Vec<ZhooshTrigger> {
        &self.after
    }
}

pub struct ZhooshStep(Box<dyn ZhooshStepTrait>);

impl ZhooshStep {
    pub fn new<X,T>(zhoosh: &Zhoosh<X,T>, target: X, start: T, end: T) -> ZhooshStep where T: 'static, X: 'static {
        ZhooshStep(Box::new(ZhooshStepImpl::new(zhoosh,target,start,end)))
    }

    pub(super) fn set(&mut self, prop: f64) {
        self.0.set(prop);
    }

    pub(super) fn add_trigger(&mut self, after: &ZhooshStepHandle, after_prop: f64) {
        self.0.add_trigger(after,after_prop);
    }

    pub(super) fn get_delay(&mut self) -> f64 {
        self.0.get_delay()
    }

    pub(super) fn calc_prop(&self,t : f64) -> f64 {
        self.0.calc_prop(t)
    }

    pub(super) fn dependencies(&self) -> &Vec<ZhooshTrigger> {
        self.0.dependencies()
    }
}

pub fn zhoosh_empty_step() -> ZhooshStep {
    let cb = move |_: &mut (), _: ()| {};
    let z = Zhoosh::new(0.,0.,0.,ZhooshShape::Linear,ZHOOSH_EMPTY_OPS,cb);
    ZhooshStep::new(&z,(),(),())
}
