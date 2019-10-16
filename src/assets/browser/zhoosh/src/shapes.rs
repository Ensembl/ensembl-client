pub enum ZhooshShape {
    Linear,
    Quadratic(f64)
}

fn quad(x: f64,a: f64) -> f64 { x*(a*x+1.-a) }

impl ZhooshShape {
    pub(super) fn linearize(&self, x: f64) -> f64 {
        match self {
            ZhooshShape::Linear => x,
            ZhooshShape::Quadratic(a) => {
                if x < 0.5 {
                    quad(x*2.,*a)/2.
                } else {
                    1.-quad(2.*(1.-x),*a)/2.
                }
            }
        }
    }
}
