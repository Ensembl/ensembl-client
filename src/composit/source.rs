use composit::page::{ Page, Leaf };
use shape::{ ShapeSpec };

pub trait Source {
    fn get_shapes(&self, page: &Page, leaf: &Leaf) -> Vec<ShapeSpec>;
}
