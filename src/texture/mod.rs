pub mod text;
pub mod bitmap;

use std::rc::Rc;

use alloc::Ticket;

use arena::{
    ArenaCanvases,
    ArenaData
};

pub trait TextureGenerator {
    fn draw(&self, adata: &mut ArenaCanvases, x: u32, y: u32);
}

pub struct TextureItem {
    origin: [f32;2],
    scale: [f32;2],
    tr: Rc<TextureRequest>,
}

impl TextureItem {
    pub fn new(tr: Rc<TextureRequest>, origin: &[f32;2], scale: &[f32;2]) -> TextureItem {
        TextureItem {
            tr, origin: *origin, scale: *scale,
        }
    }
}

pub struct TextureRequest {
    gen: Box<TextureGenerator>,
    ticket: Ticket
}

impl TextureRequest {
    pub fn new(gen: Box<TextureGenerator>, ticket: Ticket) -> TextureRequest {
        TextureRequest { gen,ticket }
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases) {
        let (x,y) = canvs.flat_alloc.position(&self.ticket);
        self.gen.draw(canvs,x,y);
    }
}

pub struct GTextureManager {
    requests: Vec<TextureItem>,
    tickets: Vec<Rc<TextureRequest>>,
}

pub trait GTextureReceiver {
    fn add_request(&mut self, req: Rc<TextureRequest>);
    fn add_item(&mut self, item: TextureItem);
}

impl GTextureReceiver for GTextureManager {
    fn add_request(&mut self, req: Rc<TextureRequest>) {
        self.tickets.push(req);
    }

    fn add_item(&mut self, item: TextureItem) {
        self.requests.push(item);
    }
}

impl GTextureManager {
    pub fn new() -> GTextureManager {
        GTextureManager {
            requests: Vec::<TextureItem>::new(),
            tickets: Vec::<Rc<TextureRequest>>::new(),
        }
    }

    pub fn draw(&self, adata: &mut ArenaData) -> Vec<([f32;2],[f32;2],[f32;4],[f32;4])> {
        for tr in &self.tickets {
            tr.draw(&mut adata.canvases);
        }
        let flat = &adata.canvases.flat;
        let mut data = Vec::<([f32;2],[f32;2],[f32;4],[f32;4])>::new();
        for req in &self.requests {
            let origin = adata.nudge(req.origin);
            let (width,height) = adata.canvases.flat_alloc.size(&req.tr.ticket);
            let p = [0., 0., adata.prop_x(width), adata.prop_y(height)];
            let (x,y) = adata.canvases.flat_alloc.position(&req.tr.ticket);
            let t = [flat.prop_x(x), flat.prop_y(y + height),
                     flat.prop_x(x + width), flat.prop_y(y)];
            data.push((origin,req.scale,p,t));
        }
        data
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
        self.tickets.clear();
    }
}
