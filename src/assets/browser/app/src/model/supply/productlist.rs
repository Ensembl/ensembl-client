use std::cell::RefCell;
use std::rc::Rc;
use std::collections::HashMap;

use composit::AllLandscapes;
use data::{ BackendConfig, HttpXferClerk };
use model::zmenu::ZMenuRegistry;
use tácode::Tácode;
use super::productbuilder::build_product;
use super::Product;
use controller::global::WindowState;

pub struct ProductListImpl {
    products:HashMap<String,Product>
}

impl ProductListImpl {
    pub fn new() -> ProductListImpl {
        ProductListImpl {
            products: HashMap::new(),
        }
    }

    pub fn add_product(&mut self, product: &Product) {
        self.products.insert(product.get_product_name().to_string(),product.clone());
    }

    pub fn get_product(&self, name: &str) -> Option<Product> {
        self.products.get(name).cloned()
    }

}

#[derive(Clone)]
pub struct ProductList(Rc<RefCell<ProductListImpl>>);

impl ProductList {
    pub fn new() -> ProductList {
        ProductList(Rc::new(RefCell::new(ProductListImpl::new())))
    }

    pub fn add_product(&mut self, product: &Product) {
        self.0.borrow_mut().add_product(product);
    }

    pub fn get_product(&self, name: &str) -> Option<Product> {
        self.0.borrow_mut().get_product(name).clone()
    }
}
