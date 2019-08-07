use std::cmp::{ Eq, PartialEq };
use std::collections::HashMap;
use std::fmt;
use std::hash::{ Hash, Hasher };
use std::rc::Rc;

use composit::StateManager;
use composit::StateExpr;

use super::{ Subassembly, Supplier };

#[derive(Clone)]
pub struct Product {
    name: String,
    parts: HashMap<Option<String>,Subassembly>,
    supplier: Rc<Supplier>
}

impl Product {
    pub fn new(name: &str, supplier: Rc<Supplier>) -> Product {
        Product {
            supplier,
            name: name.to_string(),
            parts: HashMap::<Option<String>,Subassembly>::new()
        }
    }
    
    pub fn get_supplier(&self) -> &Rc<Supplier> { &self.supplier }
    
    pub fn add_subassembly(&mut self, sa: &Subassembly) {
        self.parts.insert(sa.get_subassembly_name().as_ref().map(|x| x.to_string()),sa.clone());
    }
    
    pub fn list_subassemblies(&self) -> impl Iterator<Item=&Subassembly> {
        self.parts.values()
    }
    
    pub fn get_product_name(&self) -> &str { &self.name }      
}

impl PartialEq for Product {
    fn eq(&self, other: &Product) -> bool {
        self.name == other.name
    }
}
impl Eq for Product {}

impl Hash for Product {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.name.hash(state);
    }
}

impl fmt::Debug for Product {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f,"{}",self.get_product_name())
    }
}
