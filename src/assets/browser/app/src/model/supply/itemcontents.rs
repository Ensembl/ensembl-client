use composit::Leaf;
use model::shape::{ GenericShape, ShapeSpec };
use model::supply::Product;
use model::zmenu::ZMenuLeaf;

// XXX cache compressed and remove clone!
#[derive(Clone)]
pub struct ItemContents {
    shapes: Vec<ShapeSpec>,
    zml: ZMenuLeaf
}

impl ItemContents {
    pub fn new(leaf: &Leaf) -> ItemContents {
        ItemContents {
            shapes: Vec::<ShapeSpec>::new(),
            zml: ZMenuLeaf::new(leaf)
        }
    }

    pub fn expect(&mut self, amt: usize) {
        self.shapes.reserve(amt);
    }
    
    pub fn add_shape(&mut self, item: ShapeSpec) {
        self.shapes.push(item);
    }

    pub fn get_shapes(&self) -> &Vec<ShapeSpec> {
        &self.shapes
    }
        
    pub fn size(&self) -> usize {
        self.shapes.len()
    }

    pub fn get_zmenu_leaf(&mut self) -> &mut ZMenuLeaf {
        &mut self.zml
    }

    pub fn create_zmenu(&mut self, product: &Product) {
        for shape in &self.shapes {
            if let Some((id,zbox)) = shape.zmenu_box() {
                self.zml.add_box(&id,product.get_product_name(),&zbox);
            }
        }
    }
}
