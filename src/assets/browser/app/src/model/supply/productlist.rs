use std::collections::HashMap;

use composit::AllLandscapes;
use data::{ BackendConfig, HttpXferClerk };
use model::zmenu::ZMenuRegistry;
use tácode::Tácode;
use super::productbuilder::build_product;
use super::Product;
use model::focus::FocusObject;
use controller::global::Window;

pub struct ProductList {
    products: HashMap<String,Product>,
    window: Window
}

impl ProductList {
    pub fn new(window: &Window) -> ProductList {
        ProductList {
            products: HashMap::new(),
            window: window.clone()
        }
    }

    pub fn get_product(&mut self, name: &str) -> Option<Product> {
        if !self.products.contains_key(name) {
            let product = build_product(&mut self.window,name);
            self.products.insert(name.to_string(),product);
        }
        self.products.get(name).cloned()
    }
}
