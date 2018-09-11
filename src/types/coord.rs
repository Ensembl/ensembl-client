use std::ops::{ Add, Mul, Div, Neg };
use program::{ Object, ObjectAttrib, DataBatch, Input };

/***** Direction types *****/

pub enum Units { Pixels, Bases, Screens }
pub enum Direction { Up, Down, Left, Right }
pub enum Move<T: Neg<Output=T>,
              U: Neg<Output=U>> {
    Up(U,Units),
    Down(U,Units),
    Left(T,Units),
    Right(T,Units)
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

/*** impls for dot types ***/

impl<T: Clone + Copy + Add<T, Output=T> + Neg<Output=T>,
     U: Clone + Copy + Add<U, Output=U> + Neg<Output=U>> Dot<T,U> {
    pub fn move_by(&self, m: Move<T,U>) -> Dot<T,U> {
        match m {
            Move::Up(y,_) =>    Dot(self.0,      self.1+(-y)),
            Move::Down(y,_) =>  Dot(self.0,      self.1+y),
            Move::Left(x,_) =>  Dot(self.0+(-x), self.1),
            Move::Right(x,_) => Dot(self.0+x,    self.1),
        }
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

/* Dot + Dot => add like vectors */
impl<T : Clone + Copy + Add<T, Output=T>,
     U : Clone + Copy + Add<U, Output=U>> Add for Dot<T,U> {
    type Output = Dot<T,U>;
    
    fn add(self,other: Dot<T,U>) -> Dot<T,U> {
        Dot(self.0+other.0, self.1+other.1)
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

/*** impls for area types ***/

impl<T: Clone + Copy + From<u8>,
     U: Clone + Copy + From<u8>> Area<T,U> {

    pub fn at_origin(self) -> Area<T,U> {
        Area(Dot(0.into(),0.into()),self.1)
    }
}

impl<T: Clone + Copy + Add<T, Output=T>,
     U: Clone + Copy + Add<U, Output=U>> Area<T,U> {
    
    pub fn expand(&self) -> Area<T,U> {
        Area(self.0, self.0+self.1)
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

impl<T : Clone + Copy + Into<f64> + Add<T, Output=T>,
     U : Clone + Copy + Into<f64> + Add<U, Output=U>> Input for Area<T,U> {
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
