use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::{ StateExpr, StateManager, StateFixed };

use super::Product;

#[derive(Clone)]
pub struct Subassembly {
    product: Product,
    part: Option<String>
}

impl Subassembly {
    pub fn new(product: &Product, part: &Option<String>) -> Subassembly {
        Subassembly { 
            product: product.clone(),
            part: part.clone()
        }
    }
    
    pub fn get_product(&self) -> &Product { &self.product }

    pub fn get_subassembly_name(&self) -> &Option<String> {
        &self.part
    }
}

impl PartialEq for Subassembly {
    fn eq(&self, other: &Subassembly) -> bool {
        self.product == other.product && self.part == other.part
    }
}
impl Eq for Subassembly {}

impl Hash for Subassembly {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.product.hash(state);
        self.part.hash(state);
    }
}

impl fmt::Debug for Subassembly {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self.part {
            Some(ref part) => write!(f,"{:?}:{}",self.product,part),
            None => write!(f,"{:?}",self.product)
        }
    }
}
