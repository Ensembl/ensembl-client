use std::cell::RefCell;
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
    supplier: Rc<dyn Supplier>,
    sa_expr: Rc<RefCell<HashMap<Option<String>,Rc<dyn StateExpr>>>>,
    lid: usize,
    focus_dep: bool
}

impl Product {
    pub fn new(name: &str, supplier: Rc<dyn Supplier>, lid: usize, focus_dep: bool) -> Product {
        Product {
            supplier,
            name: name.to_string(),
            parts: HashMap::new(),
            sa_expr: Rc::new(RefCell::new(HashMap::new())),
            lid,
            focus_dep
        }
    }
    
    pub fn get_supplier(&self) -> &Rc<dyn Supplier> { &self.supplier }
    
    pub fn add_subassembly(&mut self, sa: &Subassembly, expr: &Rc<dyn StateExpr>) {
        let sa_name = sa.get_subassembly_name().as_ref().map(|x| x.to_string());
        self.parts.insert(sa_name.clone(),sa.clone());
        self.sa_expr.borrow_mut().insert(sa_name,expr.clone());
    }
    
    pub fn list_subassemblies(&self) -> impl Iterator<Item=&Subassembly> {
        self.parts.values()
    }
    
    pub fn get_product_name(&self) -> &str { &self.name }
    pub fn get_lid(&self) -> usize { self.lid }
    pub fn get_focus_dependent(&self) -> bool { self.focus_dep }

    pub fn get_subassembly_state(&self, sa: &Subassembly, m: &StateManager) -> bool {
        let sa_name = sa.get_subassembly_name().as_ref().map(|x| x.to_string());
        self.sa_expr.borrow().get(&sa_name).map(|expr| expr.is_on(m)).unwrap_or(false)
    }
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
