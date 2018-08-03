pub mod text;
pub mod bitmap;

use std::rc::Rc;

use alloc::Ticket;

use arena::{
    ArenaCanvases,
    ArenaData,
    ArenaDims
};

pub trait TexGeometry {
    fn render(&mut self,origin:&[f32;2],scale:&[f32;2],p:&[f32;4],t:&[f32;4]);
}

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
        
    pub fn process(&self, canvs: &ArenaCanvases, dims: &ArenaDims) -> ([f32;2],[f32;2],[f32;4],[f32;4]) {
        let flat = &canvs.flat;
        let origin = dims.nudge(self.origin);
        let (width,height) = canvs.flat_alloc.size(&self.tr.ticket);
        let p = [0., 0., dims.prop_x(width), dims.prop_y(height)];
        let (x,y) = canvs.flat_alloc.position(&self.tr.ticket);
        let t = [flat.prop_x(x), flat.prop_y(y + height),
                 flat.prop_x(x + width), flat.prop_y(y)];
        (origin,self.scale,p,t)
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

pub struct GTextureItemManager {
    requests: Vec<TextureItem>,
}

impl GTextureItemManager {
    pub fn new() -> GTextureItemManager {
        GTextureItemManager {
            requests: Vec::<TextureItem>::new(),
        }
    }

    fn add_item(&mut self, item: TextureItem) {
        self.requests.push(item);
    }

    pub fn draw(&self, tg: &mut TexGeometry, canvs: &mut ArenaCanvases, dims: &ArenaDims) {
        for req in &self.requests {            
            req.process(canvs,dims);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }
}

pub struct GTextureRequestManager {
    tickets: Vec<Rc<TextureRequest>>,
}

impl GTextureRequestManager {
    pub fn new() -> GTextureRequestManager {
        GTextureRequestManager {
            tickets: Vec::<Rc<TextureRequest>>::new(),
        }
    }

    fn add_request(&mut self, req: Rc<TextureRequest>) {
        self.tickets.push(req);
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases, dims: &ArenaDims) {
        for tr in &self.tickets {
            tr.draw(canvs);
        }
    }
    
    pub fn clear(&mut self) {
        self.tickets.clear();
    }
}
