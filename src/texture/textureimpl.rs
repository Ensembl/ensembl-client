use std::rc::Rc;
use alloc::Ticket;
use alloc::Allocator;
use canvasutil::FlatCanvas;

use shape::Shape;

use program::ProgramAttribs;
    
use arena::{
    ArenaCanvases,
    ArenaData,
};

use coord::{
    PCoord,
    TCoord,
};

/* A TextureArtist can service some class of TextureDrawRequests.
 * A texture type will create an instance of them. Note that a
 * TextureArtist is not parameterised, it can draw exactly one thing.
 */
pub trait TextureArtist {
    fn draw(&self, canv: &mut ArenaCanvases, x: u32, y: u32);
}

/* One request to draw on the backing canvas. A combination of
 * TextureArtist and a ticket (to get a location, when ready)
 */
pub struct TextureDrawRequest {
    gen: Box<TextureArtist>,
    ticket: Ticket
}

#[derive(Clone)]
pub struct TextureDrawRequestHandle(Rc<TextureDrawRequest>);

impl TextureDrawRequestHandle {
    pub fn new(gen: Box<TextureArtist>, ticket: Ticket) -> TextureDrawRequestHandle {
        TextureDrawRequestHandle(
            Rc::new(TextureDrawRequest {
                gen,ticket
            }))
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases, gtexreqman: &TextureSourceManager) {
        let (x,y) = gtexreqman.allocator.position(&self.0.ticket);
        self.0.gen.draw(canvs,x,y);
    }
    
    pub fn measure(&self, src: &TextureSourceManager) -> TexPart {
        let (width,height) = src.allocator.size(&self.0.ticket);
        let (x,y) = src.allocator.position(&self.0.ticket);
        TexPart::new(x,y,width,height)
    }
}

/* Utility method to make creating TextureDrawRequests simpler */
pub fn create_draw_request(gtexreqman: &mut TextureSourceManager, ta: Box<TextureArtist>, width: u32, height: u32) -> TextureDrawRequestHandle {
    let req;
    {
        let flat_alloc = &mut gtexreqman.allocator;
        req = TextureDrawRequestHandle::new(ta,flat_alloc.request(width,height));
    }
    gtexreqman.add_request(req.clone());
    req
}

/* Manages TextureDrawRequests. Single instance in Arena. Just stores
 * them and calls draw when ready really. Little more than a fancy Vec.
 */
pub struct TextureSourceManager {
    tickets: Vec<TextureDrawRequestHandle>,
    allocator: Allocator,
}

impl TextureSourceManager {
    pub fn new() -> TextureSourceManager {
        TextureSourceManager {
            tickets: Vec::<TextureDrawRequestHandle>::new(),
            allocator: Allocator::new(16),
        }
    }

    fn add_request(&mut self, req: TextureDrawRequestHandle) {
        self.tickets.push(req);
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases) {
        for tr in &self.tickets {
            tr.draw(canvs,self);
        }
    }
    
    pub fn clear(&mut self) {
        self.tickets.clear();
    }

    pub fn allocate(&mut self) -> (u32,u32) {
        self.allocator.allocate()
    }
}

/* A TextureItem is a trait which can place a drawn item onto a WebGL
 * canvas using textures. Parameterised by geometry so each will have
 * its own (as it has its own co-rodinate data to store).
 * 
 * T = Program
 */

pub trait TexPosItem : Shape {
    fn set_texpos(&mut self, data: &TexPart);    
}

#[derive(Clone,Copy)]
pub struct TexPart {
    x: u32,
    y: u32,
    width: u32,
    height: u32
}

impl TexPart {
    pub fn new(x: u32, y: u32, width: u32, height: u32) -> TexPart {
        TexPart { x, y, width, height }
    }
    
    pub fn to_rect(&self,flat: &Rc<FlatCanvas>) -> [TCoord;2] {
        [TCoord(flat.prop_x(self.x), flat.prop_y(self.y + self.height)),
         TCoord(flat.prop_x(self.x + self.width), flat.prop_y(self.y))]
    }
    
    
    pub fn size(&self, scale: PCoord) -> PCoord {
        PCoord(self.width as f32 * scale.0,
               self.height as f32 * scale.1)
    }
}

/* A TextureTargetManager manages requests to draw an item onto a WebGL
 * canvas by storing relevant TextureItems. One per geometry.
 */

pub struct TextureTargetManager {
    requests: Vec<(TextureDrawRequestHandle,Box<TexPosItem>)>
}

impl TextureTargetManager {
    pub fn new() -> TextureTargetManager {
        TextureTargetManager {
            requests: Vec::<(TextureDrawRequestHandle,Box<TexPosItem>)>::new()
        }
    }
    
    pub fn add_item(&mut self, req: TextureDrawRequestHandle, item: Box<TexPosItem>) {
        self.requests.push((req,item));
    }
    
    pub fn draw(&mut self, tg: &mut ProgramAttribs, adata: &mut ArenaData) {
        let src = &adata.gtexreqman;
        for (ref mut req,ref mut obj) in &mut self.requests {
            let tp = req.measure(src);
            obj.set_texpos(&tp);
            obj.process(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
