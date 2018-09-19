use stage::Stage;
use std::fmt::Debug;
use std::ops::{ Add, Sub, Mul, Div, Neg };
use program::{ Object, ObjectAttrib, DataBatch, Input };

/***** Direction types *****/

#[derive(Clone,Copy,Debug)]
pub enum Units { Pixels, Bases, Screens }

#[derive(Clone,Copy,Debug)]
pub enum Axis { Horiz, Vert }

#[derive(Clone,Copy,Debug)]
pub enum AxisSense { Pos, Neg }

pub struct Direction(pub Axis,pub AxisSense);

pub const LEFT : Direction = Direction(Axis::Horiz,AxisSense::Neg);
pub const RIGHT : Direction = Direction(Axis::Horiz,AxisSense::Pos);
pub const UP : Direction = Direction(Axis::Vert,AxisSense::Neg);
pub const DOWN : Direction = Direction(Axis::Vert,AxisSense::Pos);

#[derive(Clone,Copy,Debug)]
pub struct Corner(pub AxisSense, pub AxisSense);

pub const TOPLEFT    : Corner = Corner(AxisSense::Pos,AxisSense::Pos);
pub const TOPRIGHT   : Corner = Corner(AxisSense::Neg,AxisSense::Pos);
pub const BOTTOMLEFT : Corner = Corner(AxisSense::Pos,AxisSense::Neg);
pub const BOTTOMRIGHT: Corner = Corner(AxisSense::Neg,AxisSense::Neg);

impl From<AxisSense> for f32 {
    fn from(xs: AxisSense) -> f32 {
        match xs {
            AxisSense::Pos =>  1.0,
            AxisSense::Neg => -1.0
        }
    }
}

impl Input for Corner {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        let (a,b): (f32,f32) = (self.0.into(), self.1.into());
        attrib.add_f32(&[a,b],batch);
    }
}

impl Corners {
    pub fn rectangle(&self) -> [Corner;4] {
        [
            self.0,
            Corner((self.0).0,(self.1).1),
            self.1,
            Corner((self.1).0,(self.0).1)
        ]
    }
}

#[derive(Clone,Copy,Debug)]
pub struct Corners(pub Corner, pub Corner);
impl Input for Corners {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        for c in self.rectangle().iter() {
            let (a,b) : (f32,f32) = (c.0.into(), c.1.into());
            attrib.add_f32(&[a,b],batch);
        }
    }    
}

#[derive(Clone,Copy,Debug)]
pub struct CSticky<T: Clone + Copy + Debug,
                   U: Clone + Copy + Debug>(Corner,Dot<T,U>);

#[derive(Clone,Copy,Debug)]
pub struct RSticky<T: Clone + Copy + Debug,
                   U: Clone + Copy + Debug>(CSticky<T,U>,CSticky<T,U>);

impl<T: Clone + Copy + Debug + Add<T,Output=T> + Sub<T,Output=T>,
     U: Clone + Copy + Debug + Add<U,Output=U> + Sub<U,Output=U>> RSticky<T,U> {
    pub fn corners(&self) -> Corners {
        Corners((self.0).0,(self.1).0)
    }
    
    pub fn quantity(&self) -> Area<T,U> {
        Area((self.0).1,(self.1).1).contract()
    }
}

#[derive(Clone,Copy,Debug)]
pub struct Distance<T : Clone + Copy + Debug>(pub T,pub Units);

impl<T: Clone + Copy + Mul<f32,Output=T> + Div<f32,Output=T> + Debug> Distance<T> {
    pub fn convert(&self, target: Units, axis: Axis, stage: &Stage) -> Distance<T> {
        let Distance(quant,source) = self;
        let dims = stage.get_size();
        let (size,zoom) = match axis {
            Axis::Horiz => (dims.0 as f32,stage.get_linear_zoom()),
            Axis::Vert => (dims.1 as f32,1.0)
        };
        let quant = match source {
            Units::Pixels => match target {
                Units::Pixels => *quant,
                Units::Bases => *quant / zoom / size,
                Units::Screens => *quant / size
            },
            Units::Bases => match target {
                Units::Pixels => *quant * zoom * size,
                Units::Bases => *quant,
                Units::Screens => *quant * zoom
            },
            Units::Screens => match target {
                Units::Pixels => *quant * size,
                Units::Bases => *quant / zoom,
                Units::Screens => *quant
            },            
        };
        Distance(quant,target)
    }
}

#[derive(Clone,Copy,Debug)]
pub enum Move<T: Neg<Output=T> + Clone + Copy + Debug +
                 Mul<f32,Output=T> + Div<f32,Output=T>,
              U: Neg<Output=U> + Clone + Copy + Debug +
                 Mul<f32,Output=U> + Div<f32,Output=U>> {
    Up(Distance<U>),
    Down(Distance<U>),
    Left(Distance<T>),
    Right(Distance<T>)
}

impl<T: Neg<Output=T> + Clone + Copy + Debug + Mul<f32,Output=T> + Div<f32,Output=T>,
     U: Neg<Output=U> + Clone + Copy + Debug + Mul<f32,Output=U> + Div<f32,Output=U>> Move<T,U> {
         
    pub fn convert(&self, target: Units, stage: &Stage) -> Move<T,U> {
        match self {
            Move::Up(u) => Move::Up(u.convert(target,Axis::Vert, stage)),
            Move::Down(u) => Move::Down(u.convert(target,Axis::Vert, stage)),
            Move::Left(u) => Move::Left(u.convert(target,Axis::Horiz, stage)),
            Move::Right(u) => Move::Right(u.convert(target,Axis::Horiz, stage)),
        }
    }
    
    pub fn direction(&self) -> Direction {
        match self {
            Move::Up(_) => UP,
            Move::Down(_) => DOWN,
            Move::Left(_) => LEFT,
            Move::Right(_) => RIGHT
        }
    }
    
}

impl<T: Clone + Copy + Debug + Add<T,Output=T> + Neg<Output=T> + Mul<f32,Output=T> + Div<f32,Output=T>,
     U: Clone + Copy + Debug + Add<U,Output=U> + Neg<Output=U> + Mul<f32,Output=U> + Div<f32,Output=U>> 
        Add<Move<T,U>> for Dot<T,U> {
    type Output = Dot<T,U>;
         
    fn add(self, other: Move<T,U>) -> Dot<T,U> {
        match other {
            Move::Up(Distance(y,_)) =>    Dot(self.0,      self.1+(-y)),
            Move::Down(Distance(y,_)) =>  Dot(self.0,      self.1+y),
            Move::Left(Distance(x,_)) =>  Dot(self.0+(-x), self.1),
            Move::Right(Distance(x,_)) => Dot(self.0+x,    self.1),
        }        
    }
}


/***** Dot types *****/

#[derive(Clone,Copy,Debug)]
pub struct Dot<T : Clone + Copy,
               U : Clone + Copy>(pub T, pub U);

pub type CFraction = Dot<f32,f32>;
pub fn cfraction(x: f32, y: f32) -> CFraction { Dot(x,y) }

pub type CLeaf = Dot<f32,i32>;
pub fn cleaf(x: f32, y: i32) -> CLeaf { Dot(x,y) }

pub type CPixel = Dot<i32,i32>;
pub fn cpixel(x: i32, y: i32) -> CPixel { Dot(x,y) }

pub type CCorner = CSticky<i32,i32>;
pub fn ccorner(c: Corner, q: Dot<i32,i32>) -> CCorner { CSticky(c,q) }

/*** impls for dot types ***/

impl<T: Clone + Copy + Mul<T, Output=U>,U: Add<U, Output=U>> Dot<T,T> {
    pub fn abs_sq(&self) -> U {
        self.0*self.0+self.1*self.1
    }
}

impl<T : Clone + Copy + Into<f64>,
     U : Clone + Copy + Into<f64>> Dot<T,U> {    
    pub fn as_fraction(&self) -> CFraction {
        cfraction(self.0.into() as f32,self.1.into() as f32)
    }
}

impl<T : Clone + Copy + Into<f64>,
     U : Clone + Copy + Into<f64>> Input for Dot<T,U> {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        let (a,b): (f64,f64) = (self.0.into(), self.1.into());
        attrib.add_f32(&[a as f32,b as f32],batch);
    }
}

/* Corner + Dot => add like vectors, keep orientation */
impl<T : Clone + Copy + Debug + Add<T, Output=T>,
     U : Clone + Copy + Debug + Add<U, Output=U>> Add<Dot<T,U>> for CSticky<T,U> {
    type Output = CSticky<T,U>;
    
    fn add(self, other: Dot<T,U>) -> CSticky<T,U> {
        CSticky(self.0, self.1+other)
    }
}

/* Dot + Dot => add like vectors */
impl<T : Clone + Copy + Add<T, Output=T>,
     U : Clone + Copy + Add<U, Output=U>> Add for Dot<T,U> {
    type Output = Dot<T,U>;
    
    fn add(self,other: Dot<T,U>) -> Dot<T,U> {
        Dot(self.0+other.0, self.1+other.1)
    }
}

/* Dot - Dot => subtract like vectors */
impl<T : Clone + Copy + Sub<T, Output=T>,
     U : Clone + Copy + Sub<U, Output=U>> Sub for Dot<T,U> {
    type Output = Dot<T,U>;
    
    fn sub(self,other: Dot<T,U>) -> Dot<T,U> {
        Dot(self.0-other.0, self.1-other.1)
    }
}

/* Dot * Dot => scale */
impl<T : Clone + Copy + Mul<T, Output=T>,
     U : Clone + Copy + Mul<U, Output=U>> Mul for Dot<T,U> {
    type Output = Dot<T,U>;
    
    fn mul(self,other: Dot<T,U>) -> Dot<T,U> {
        Dot(self.0*other.0, self.1*other.1)
    }
}

/* Dot/Dot => divide and force into fractional Dot */
impl<T: Clone + Copy + Div<T, Output=T> + Into<f32>,
     U: Clone + Copy + Div<U, Output=U> + Into<f32>> Div for Dot<T,U> {
    type Output = Dot<f32,f32>;
    
    fn div(self, other: Dot<T,U>) -> Dot<f32,f32> {
        Dot((self.0.into() as f64 / other.0.into() as f64) as f32,
            (self.1.into() as f64 / other.1.into() as f64) as f32)
    }
}

/***** Area types *****/

#[derive(Clone,Copy,Debug)]
pub struct Area<T: Clone + Copy,
                U: Clone + Copy>(pub Dot<T,U>, pub Dot<T,U>);

pub type RFraction = Area<f32,f32>;
pub fn rfraction<T : Clone + Copy,
                 U : Clone + Copy>(x: Dot<T,U>, y: Dot<T,U>) -> Area<T,U> { 
    Area(x,y)
}

pub type RLeaf = Area<f32,i32>;
pub fn rleaf<T : Clone + Copy,
                 U : Clone + Copy>(x: Dot<T,U>, y: Dot<T,U>) -> Area<T,U> { 
    Area(x,y)
}

pub type RPixel = Area<i32,i32>;
pub fn rpixel<T : Clone + Copy,
                 U : Clone + Copy>(x: Dot<T,U>, y: Dot<T,U>) -> Area<T,U> { 
    Area(x,y)
}

pub type RCorner = RSticky<i32,i32>;
pub fn rcorner(x: CCorner, y: CCorner) -> RCorner {
    RSticky(x,y)
}

/*** impls for area types ***/

impl<T: Clone + Copy + From<u8>,
     U: Clone + Copy + From<u8>> Area<T,U> {

    pub fn at_origin(self) -> Area<T,U> {
        Area(Dot(0.into(),0.into()),self.1)
    }
}

impl<T: Clone + Copy + Add<T, Output=T> + Sub<T, Output=T>,
     U: Clone + Copy + Add<U, Output=U> + Sub<U, Output=U>> Area<T,U> {
    
    pub fn expand(&self) -> Area<T,U> {
        Area(self.0, self.0+self.1)
    }
    
    pub fn contract(&self) -> Area<T,U> {
        Area(self.0, self.1-self.0)
    }
    
    pub fn rectangle(&self) -> [Dot<T,U>;4] {
        let x = self.expand();
        [
            x.0,
            Dot((x.0).0, (x.1).1), 
            x.1,
            Dot((x.1).0, (x.0).1)
        ]
    }
}

impl<T : Clone + Copy + Into<f64>,
     U : Clone + Copy + Into<f64>> Area<T,U> {    
    pub fn as_fraction(&self) -> RFraction {
        rfraction(self.0.as_fraction(),self.1.as_fraction())
    }
}

impl<T : Clone + Copy + Into<f64> + Add<T, Output=T> + Sub<T, Output=T>,
     U : Clone + Copy + Into<f64> + Add<U, Output=U> + Sub<U, Output=U>> Input for Area<T,U> {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        for c in self.rectangle().iter() {
            attrib.add_f32(&[c.0.into() as f32,c.1.into() as f32],batch);
        }
    }
}

/* Area + Dot => offset */
impl<T : Clone + Copy + Add<T, Output=T>,
     U : Clone + Copy + Add<U, Output=U>>
        Add<Dot<T,U>> for Area<T,U> {
    type Output = Area<T,U>;
    
    fn add(self, other: Dot<T,U>) -> Area<T,U> {
        Area(self.0 + other, self.1)
    }         
}

/* Area + Corner => offset and keep orientation */
impl<T : Clone + Copy + Debug + Add<T, Output=T> + Sub<T, Output=T>,
     U : Clone + Copy + Debug + Add<U, Output=U> + Sub<U, Output=U>>
        Add<CSticky<T,U>> for Area<T,U> {
    type Output = RSticky<T,U>;
    
    fn add(self, other: CSticky<T,U>) -> RSticky<T,U> {
        let r = self.expand();
        RSticky(CSticky(other.0,other.1+r.0),CSticky(other.0,other.1+r.1))
    }         
}

/* Area * Dot => scale size and offset as given, into self */
impl<T : Clone + Copy + Mul<T, Output=T>,
     U : Clone + Copy + Mul<U, Output=U>>
        Mul<Dot<T,U>> for Area<T,U> {
    type Output = Area<T,U>;
    
    fn mul(self, other: Dot<T,U>) -> Area<T,U> {
        Area(self.0 * other, self.1 * other)
    }         
}

/* Area / Dot => scale size and offset as given, into fraction */
impl<T : Clone + Copy + Div<T, Output=T> + Into<f32>,
     U : Clone + Copy + Div<U, Output=U> + Into<f32>>
        Div<Dot<T,U>> for Area<T,U> {
    type Output = Area<f32,f32>;
    
    fn div(self, other: Dot<T,U>) -> Area<f32,f32> {
        Area(self.0 / other, self.1 / other)
    }         
}
