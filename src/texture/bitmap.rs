use std::rc::Rc;
use arena::ArenaCanvases;

use texture::{
    TextureRequest,
    TextureGenerator,
    TextureItem,
    GTextureReceiver,
};

struct BitmapTextureGenerator {
    data: Vec<u8>,
    width: u32,
    height: u32
}

impl BitmapTextureGenerator {
    fn new(data: Vec<u8>, width: u32, height: u32) -> BitmapTextureGenerator {
        BitmapTextureGenerator { data, width, height }
    }
}

impl TextureGenerator for BitmapTextureGenerator {
    fn draw(&self, canvs: &mut ArenaCanvases, x: u32, y: u32) {
        canvs.flat.bitmap(&self.data,x,y,self.width,self.height);
    }
}

pub struct BitmapTextureStore {
}

impl BitmapTextureStore {
    pub fn new() -> BitmapTextureStore {
        BitmapTextureStore { }
    }

    pub fn add(&mut self,gtexman: &mut GTextureReceiver, canvas: &mut ArenaCanvases, origin:&[f32;2], scale:&[f32;2], data: Vec<u8>, width: u32, height: u32) {
        let flat_alloc = &mut canvas.flat_alloc;
        let req = Rc::new(TextureRequest::new(
                            Box::new(BitmapTextureGenerator::new(data,width,height)),
                            flat_alloc.request(width,height)));
        gtexman.add_request(req.clone());
        let item = TextureItem::new(req.clone(),origin,scale);
        gtexman.add_item(item);
    }
}
