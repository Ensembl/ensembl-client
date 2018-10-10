use std::cmp::{ Ordering, PartialOrd };
use stage::Stage;
use std::fmt::Debug;
use std::ops::{ Add, Sub, Mul, Div, Neg };
use program::{ Object, ObjectAttrib, DataBatch, Input };
use types::area::{ area, Rect };

/***** Direction types *****/

#[derive(Clone,Copy,Debug)]
pub enum Units { Pixels, Bases, Screens }

#[derive(Clone,Copy,Debug)]
pub enum Axis { Horiz, Vert }

#[derive(Clone,Copy,Debug)]
pub enum AxisSense { Pos, Neg }

#[derive(Clone,Copy,Debug)]
pub struct Anchor(Option<AxisSense>);

impl Anchor {
    pub fn prop(&self) -> f32 {
        match self.0 {
            Some(AxisSense::Pos) =>  1.0,
            Some(AxisSense::Neg) => -1.0,
            None => 0.0
        }
    }
    
    pub fn flip(&self) -> Anchor {
        Anchor(match self.0 {
            Some(AxisSense::Pos) => Some(AxisSense::Neg),
            Some(AxisSense::Neg) => Some(AxisSense::Pos),
            None => None
        })
    }

    pub fn sense(self, s: AxisSense) -> Anchor {
        match s {
            AxisSense::Pos => self,
            AxisSense::Neg => self.flip()
        }
    }
}

pub type Anchors = Dot<Anchor,Anchor>;

const AS : Anchor = Anchor(Some(AxisSense::Pos));
const AM : Anchor = Anchor(None);
const AE : Anchor = Anchor(Some(AxisSense::Neg));

pub const A_TOP        : Anchors = Dot(AM,AS);
pub const A_TOPLEFT    : Anchors = Dot(AS,AS);
pub const A_TOPRIGHT   : Anchors = Dot(AE,AS);
pub const A_BOTTOM     : Anchors = Dot(AM,AE);
pub const A_BOTTOMLEFT : Anchors = Dot(AS,AE);
pub const A_BOTTOMRIGHT: Anchors = Dot(AE,AE);
pub const A_LEFT       : Anchors = Dot(AS,AM);
pub const A_RIGHT      : Anchors = Dot(AE,AM);
pub const A_MIDDLE     : Anchors = Dot(AM,AM);

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

impl Input for f32 {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        attrib.add_f32(&[*self],batch);
    }
}

impl From<AxisSense> for f32 {
    fn from(xs: AxisSense) -> f32 {
        let x : f64 = xs.into();
        x as f32
    }
}

impl From<AxisSense> for f64 {
    fn from(xs: AxisSense) -> f64 {
        match xs {
            AxisSense::Pos =>  1.0,
            AxisSense::Neg => -1.0
        }        
    }
}

impl<T: Clone+Copy+Debug + PartialOrd> Dot<Edge<T>, Edge<T>> {
    pub fn is_backward(&self) -> bool {
        match ((self.0).0,(self.1).0) {
            (AxisSense::Pos,AxisSense::Pos) =>
                ((self.0).1).partial_cmp(&(self.1).1).unwrap() == Ordering::Greater,
            (AxisSense::Neg,AxisSense::Neg) =>
                ((self.0).1).partial_cmp(&(self.1).1).unwrap() == Ordering::Less,
            (AxisSense::Neg,AxisSense::Pos) =>
                true,
            (AxisSense::Pos,AxisSense::Neg) =>
                false
        }
    }
}

impl<T: Clone+Copy+Debug, U: Clone+Copy+Debug> Dot<T,U> {
    pub fn x_edge(&self,xs: AxisSense) -> Dot<Edge<T>,U> {
        Dot(Edge(xs,self.0),self.1)
    }

    pub fn y_edge(&self,xs: AxisSense) -> Dot<T,Edge<U>> {
        Dot(self.0,Edge(xs,self.1))
    }

    pub fn x_anchor(&self,xs: Anchor) -> Dot<Anchored<T>,U> {
        Dot(Anchored(xs,self.0),self.1)
    }

    pub fn y_anchor(&self,xs: Anchor) -> Dot<T,Anchored<U>> {
        Dot(self.0,Anchored(xs,self.1))
    }
    
    pub fn anchor(&self, a: Anchors) -> Dot<Anchored<T>,Anchored<U>> {
        self.x_anchor(a.0).y_anchor(a.1)
    }
}

impl<T: Clone+Copy+Debug,
     U: Clone+Copy+Debug> Dot<Anchored<T>,Anchored<U>> {
    pub fn from_nw(&self, r: Rect<f32,f32>) -> Rect<f32,f32> {
        let s = r.size();
        r + Dot((self.0.prop()-1.)/2.,(self.1.prop()-1.)/2.) * s
    }
}

#[derive(Clone,Copy,Debug)]
pub struct Edge<T>(AxisSense,T);

#[derive(Clone,Copy,Debug)]
pub struct Anchored<T>(Anchor,T);

impl<T: Clone+Copy> Anchored<T> {
    pub fn prop(&self) -> f32 { self.0.prop() }
    pub fn flip(&self) -> Anchored<T> {
        Anchored(self.0.flip(),self.1)
    }

    pub fn sense<U>(&self, e: Edge<U>) -> Anchored<T> {
        Anchored(self.0.sense(e.0),self.1)
    }
}


pub fn cedge<T: Clone+Copy+Debug,U: Clone+Copy+Debug>
        (c: Corner, d: Dot<T,U>) -> Dot<Edge<T>,Edge<U>> {
    Dot(Edge(c.0,d.0),Edge(c.1,d.1))
}

impl<T: Clone+Copy+Debug+Add<T,Output=U>,
     U: Clone+Copy+Debug> Add<T> for Edge<T> {
    type Output = Edge<U>;
    
    fn add(self, other: T) -> Self::Output {
        Edge(self.0, self.1+other)
    }
    
}

impl<T: Clone+Copy+Debug> Edge<T> {
    pub fn corner(self) -> AxisSense { self.0 }
    pub fn quantity(self) -> T { self.1 }
}

impl<T: Clone+Copy+Debug> Anchored<T> {
    pub fn corner(self) -> Option<AxisSense> { (self.0).0 }
    pub fn quantity(self) -> T { self.1 }
}

impl From<Dot<Corner,Corner>> for Rect<AxisSense,AxisSense> {
    fn from(c: Dot<Corner,Corner>) -> Rect<AxisSense,AxisSense> {
        area(Dot((c.0).0,(c.0).1),Dot((c.1).0,(c.1).1))
    }
}

pub type EPixel = Dot<Edge<i32>,Edge<i32>>;

impl Input for Corner {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        let (a,b): (f32,f32) = (self.0.into(), self.1.into());
        attrib.add_f32(&[a,b],batch);
    }
}

impl<T: Clone+Copy+Debug, U: Clone+Copy+Debug> Dot<Edge<T>,Edge<U>> {
    pub fn corner(&self) -> Corner {
        Corner((self.0).0,(self.1).0)
    }
    
    pub fn quantity(&self) -> Dot<T,U> {
        Dot((self.0).1,(self.1).1)
    }
}

impl<T: Clone+Copy+Debug, U: Clone+Copy+Debug> Dot<Anchored<T>,Anchored<U>> {
    pub fn corner(&self) -> Dot<Anchor,Anchor> {
        Dot((self.0).0,(self.1).0)
    }
    
    pub fn quantity(&self) -> Dot<T,U> {
        Dot((self.0).1,(self.1).1)
    }
    
    pub fn flip<A: Clone+Copy+Debug,
                B: Clone+Copy+Debug>(&self, f: Dot<Edge<A>,Edge<B>>) -> Dot<Anchored<T>,Anchored<U>> {
        Dot(self.0.sense(f.0),self.1.sense(f.1))
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

pub type APixel = Dot<Anchored<i32>,Anchored<i32>>;

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

impl<T : Clone + Copy + Into<f64>> Anchored<T> {
    pub fn as_fraction(&self) -> Anchored<f32> {
        Anchored(self.0,self.1.into() as f32)
    }
}

impl<T : Clone + Copy + Into<f64>,
     U : Clone + Copy + Into<f64>> Dot<Anchored<T>,Anchored<U>> {
    pub fn as_fraction(&self) -> Dot<Anchored<f32>,Anchored<f32>> {
        Dot(self.0.as_fraction(),self.1.as_fraction())
    }
}

fn pmin<'a,T: PartialOrd>(a: &'a T, b: &'a T) -> &'a T {
    if let Some(Ordering::Greater) = a.partial_cmp(b) { b } else { a }
}

fn pmax<'a,T: PartialOrd>(a: &'a T, b: &'a T) -> &'a T {
    if let Some(Ordering::Less) = a.partial_cmp(b) { b } else { a }
}

impl<T: Clone+Copy+Debug + PartialOrd,
     U: Clone+Copy+Debug + PartialOrd> Dot<T,U> {
    pub fn min(&self, other: &Dot<T,U>) -> Dot<T,U> {
        Dot(*pmin(&self.0,&other.0),*pmin(&self.1,&other.1))
    }

    pub fn max(&self, other: &Dot<T,U>) -> Dot<T,U> {
        Dot(*pmax(&self.0,&other.0),*pmax(&self.1,&other.1))
    }
}

impl<T : Clone + Copy + Into<f64>,
     U : Clone + Copy + Into<f64>> Input for Dot<T,U> {
    fn to_f32(&self, attrib: &mut ObjectAttrib, batch: &DataBatch) {
        let (a,b): (f64,f64) = (self.0.into(), self.1.into());
        attrib.add_f32(&[a as f32,b as f32],batch);
    }
}

/* Dot + Dot => add like vectors */
impl<A: Clone+Copy+Debug + Add<C,Output=T>,
     B: Clone+Copy+Debug + Add<D,Output=U>,
     C: Clone+Copy+Debug,
     D: Clone+Copy+Debug,
     T: Clone+Copy+Debug,
     U: Clone+Copy+Debug> Add<Dot<C,D>> for Dot<A,B> {
    type Output = Dot<T,U>;
    
    fn add(self, other: Dot<C,D>) -> Self::Output {
        Dot(self.0 + other.0, self.1+other.1)
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
