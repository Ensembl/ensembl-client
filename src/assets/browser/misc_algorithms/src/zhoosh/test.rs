use std::sync::{ Arc, Mutex };
use crate::zhoosh::{ Zhoosh, ZhooshOps, ZhooshRunState, ZhooshRunner, ZhooshSequence, ZhooshShape, ZhooshSpec, ZHOOSH_LINEAR_F64_OPS, ZHOOSH_PROP_F64_OPS, zhoosh_collect };

#[derive(Clone)]
struct TestProp(Arc<Mutex<Vec<(i32,f64)>>>);

fn build_zhoosh<U>(max_time: f64, min_speed: f64, delay: f64, shape: ZhooshShape, ops: U, now: &Arc<Mutex<i32>>) 
        -> Zhoosh<TestProp,f64> where U: ZhooshOps<f64> + 'static + Send+Sync {
    let now = now.clone();
    let cb = move |x : &mut TestProp, t: f64| {
        x.0.lock().unwrap().push((*now.lock().unwrap(),t.round()));
    };
    Zhoosh::new(max_time,min_speed,delay,shape,ops,cb)
}

fn new_run(z: &Zhoosh<TestProp,f64>, from: f64, to: f64, reqs: &[(ZhooshRunState,f64)]) -> (TestProp,ZhooshRunState) {
    let t = TestProp(Arc::new(Mutex::new(vec![])));
    let mut step = ZhooshRunState::new(ZhooshSpec::new(z,t.clone(),from,to));
    for (after,after_prop) in reqs {
        step.add_trigger(after.clone(),*after_prop);
    }
    (t,step)
}

fn run(start: ZhooshRunState, steps: i32, now: &Arc<Mutex<i32>>) {
    let mut seq = ZhooshSequence::new();
    let mut runner = ZhooshRunner::new();
    seq.add(start);
    seq.run(&mut runner);
    for i in 0..steps {
        *now.lock().unwrap() = i;
        runner.step(i as f64);
    }
}

#[test]
fn zhoosh_smoke() {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_zhoosh(10.,0.,1.,ZhooshShape::Linear,ZHOOSH_LINEAR_F64_OPS,&now);
    let z2 = build_zhoosh(10.,0.,1.,ZhooshShape::Linear,ZHOOSH_PROP_F64_OPS,&now);
    let (t1,step1) = new_run(&z1,0.,10.,&[]);
    let (t2,step2) = new_run(&z2,1.,10.,&[(step1,0.5)]);
    run(step2,23,&now);
    assert_eq!(vec![(1, 0.),(2,1.),(3,2.),( 4,3.),( 5,4.),( 6,5.),( 7,6.),( 8,7.),( 9,8.),(10,9.),(11,10.)],t1.0.lock().unwrap().clone());
    assert_eq!(vec![(7,10.),(8,8.),(9,6.),(10,5.),(11,4.),(12,3.),(13,3.),(14,2.),(15,2.),(16,1.),(17,1. )],t2.0.lock().unwrap().clone());
}

#[test]
fn zhoosh_min_speed() {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_zhoosh(10.,20.,1.,ZhooshShape::Linear,ZHOOSH_LINEAR_F64_OPS,&now);
    let (t1,step1) = new_run(&z1,0.,10.,&[]);
    run(step1,23,&now);
    assert_eq!(t1.0.lock().unwrap().len(),6);
}

fn delay_start(prop: f64, delay1: f64, delay2: f64) -> i32 {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_zhoosh(10.,0.,delay1,ZhooshShape::Linear,ZHOOSH_LINEAR_F64_OPS,&now);
    let z2 = build_zhoosh(10.,0.,delay2,ZhooshShape::Linear,ZHOOSH_LINEAR_F64_OPS,&now);
    let (_,step1) = new_run(&z1,0.,10.,&[]);
    let (t2,step2) = new_run(&z2,1.,10.,&[(step1,prop)]);
    run(step2,23,&now);
    let v = t2.0.lock().unwrap()[0].0;
    v
}

#[test]
fn zhoosh_after_prop() {
    assert_eq!(delay_start(0.5,1.,1.),7);
    assert_eq!(delay_start(1.0,1.,1.),12);
    assert_eq!(delay_start(0.0,1.,1.),2);
    assert_eq!(delay_start(0.5,1.,0.),6);
    assert_eq!(delay_start(1.0,1.,0.),11);
    assert_eq!(delay_start(0.0,1.,0.),1);
    assert_eq!(delay_start(0.5,0.,1.),6);
    assert_eq!(delay_start(1.0,0.,1.),11);
    assert_eq!(delay_start(0.0,0.,1.),1);
    assert_eq!(delay_start(0.5,0.,0.),5);
    assert_eq!(delay_start(1.0,0.,0.),10);
    assert_eq!(delay_start(0.0,0.,0.),0);
}

#[test]
fn zhoosh_multi_start() {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_zhoosh(10.,0.,1.,ZhooshShape::Linear,ZHOOSH_LINEAR_F64_OPS,&now);
    let z2 = build_zhoosh(10.,0.,10.,ZhooshShape::Linear,ZHOOSH_PROP_F64_OPS,&now);
    let (_,step1) = new_run(&z1,0.,10.,&[]);
    let (t2,step2) = new_run(&z2,1.,10.,&[]);
    let mut step3 = zhoosh_collect();
    step3.add_trigger(step1,1.);
    step3.add_trigger(step2,0.5);
    run(ZhooshRunState::new(step3),23,&now);
    assert_eq!(t2.0.lock().unwrap().len(),6);
}

#[derive(Debug,PartialEq)]
struct Special(f64);
struct SpecialOps();

impl ZhooshOps<Special> for SpecialOps {
    fn interpolate(&self, prop: f64, a: &Special, b: &Special) -> Special { Special((b.0*(1.-prop)+a.0).round()) }
    fn distance(&self, a: &Special, b: &Special) -> f64 { b.0-a.0 }
}

#[derive(Clone)]
struct SpecialTestProp(Arc<Mutex<Vec<Special>>>);

fn build_special_zhoosh<U>(max_time: f64, min_speed: f64, delay: f64, shape: ZhooshShape, ops: U) 
        -> Zhoosh<SpecialTestProp,Special> where U: ZhooshOps<Special> + 'static + Send+Sync {
    let cb = move |x : &mut SpecialTestProp, t: Special| {
        x.0.lock().unwrap().push(t);
    };
    Zhoosh::new(max_time,min_speed,delay,shape,ops,cb)
}

fn new_special_run(z: &Zhoosh<SpecialTestProp,Special>, from: Special, to: Special) -> (SpecialTestProp,ZhooshRunState) {
    let t = SpecialTestProp(Arc::new(Mutex::new(vec![])));
    let step : ZhooshRunState = ZhooshRunState::new(ZhooshSpec::new(z,t.clone(),from,to));
    (t,step)
}

#[test]
fn zhoosh_special() {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_special_zhoosh(10.,0.,1.,ZhooshShape::Linear,SpecialOps());
    let (t1,step1) = new_special_run(&z1,Special(0.),Special(10.));
    run(step1,23,&now);
    print!("{:?}\n",t1.0);
    assert_eq!(Special(6.),t1.0.lock().unwrap()[4]);
}

#[test]
fn zhoosh_quadratic() {
    let now = Arc::new(Mutex::new(0));
    let z1 = build_zhoosh(10.,0.,1.,ZhooshShape::Quadratic(0.5),ZHOOSH_LINEAR_F64_OPS,&now);
    let (t1,step1) = new_run(&z1,0.,1000.,&[]);
    run(step1,120,&now);
    print!("{:?}\n",t1.0);
    assert_eq!(vec![(1,0.),(2,60.),(3,140.),(4,240.),(5,360.),(6,500.),(7,640.),(8,760.),(9,860.),(10, 940.),(11,1000.)],t1.0.lock().unwrap().clone());
}