use model::item::UnpackedProduct;

pub trait UnpackedProductConsumer {
    fn consume(&mut self, ui: UnpackedProduct);
}
