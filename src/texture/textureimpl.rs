use std::rc::Rc;
use alloc::Ticket;
use std::marker::PhantomData;
use alloc::Allocator;

use arena::{
    ArenaCanvases,
    ArenaDims,
};

/* A TextureArtist can service some class of TextureDrawRequests.
 * A texture type will create an instance of them. Note that a
 * TextureArtist is not parameterised, it can draw exactly one thing.
 */
pub trait TextureArtist {
    fn draw(&self, canv: &mut ArenaCanvases, x: u32, y: u32);
}

pub struct TextureDrawRequest {
    gen: Box<TextureArtist>,
    ticket: Ticket
}

/* One request to draw on the backing canvas. A combination of
 * TextureArtist and a ticket (to get a location, when ready)
 */
impl TextureDrawRequest {
    pub fn new(gen: Box<TextureArtist>, ticket: Ticket) -> TextureDrawRequest {
        TextureDrawRequest { gen,ticket }
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases, gtexreqman: &TextureSourceManager) {
        let (x,y) = gtexreqman.allocator.position(&self.ticket);
        self.gen.draw(canvs,x,y);
    }
    
    pub fn measure(&self, src: &TextureSourceManager) -> (u32,u32,u32,u32) {
        let (width,height) = src.allocator.size(&self.ticket);
        let (x,y) = src.allocator.position(&self.ticket);
        (x,y,width,height)
    }

}

/* Utility method to make creating TextureDrawRequests simpler */
pub fn create_draw_request(gtexreqman: &mut TextureSourceManager, ta: Box<TextureArtist>, width: u32, height: u32) -> Rc<TextureDrawRequest> {
    let req;
    {
        let flat_alloc = &mut gtexreqman.allocator;
        req = Rc::new(TextureDrawRequest::new(ta,flat_alloc.request(width,height)));
    }
    gtexreqman.add_request(req.clone());
    req
}

/* Manages TextureDrawRequests. Single instance in Arena. Just stores
 * them and calls draw when ready really. Little more than a fancy Vec.
 */
pub struct TextureSourceManager {
    tickets: Vec<Rc<TextureDrawRequest>>,
    allocator: Allocator,
}

impl TextureSourceManager {
    pub fn new() -> TextureSourceManager {
        TextureSourceManager {
            tickets: Vec::<Rc<TextureDrawRequest>>::new(),
            allocator: Allocator::new(16),
        }
    }

    fn add_request(&mut self, req: Rc<TextureDrawRequest>) {
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
 * T = Geometry
 */
pub trait TextureItem<T> {
    fn process(&self, geom: &mut T, x: u32, y: u32, width: u32, height: u32, canvs: &ArenaCanvases, dims: &ArenaDims);
}

/* A TextureTargetManager manages requests to draw an item onto a WebGL
 * canvas by storing relevant TextureItems. One per geometry.
 * 
 * T = geometry
 * U = concrete type of the TextureItem instance we manage.
 */
pub struct TextureTargetManager<T,U> {
    requests: Vec<(Rc<TextureDrawRequest>,U)>,
    _phantom: PhantomData<T>
}

impl<T,U> TextureTargetManager<T,U> where U: TextureItem<T> {
    pub fn new() -> TextureTargetManager<T,U> {
        TextureTargetManager {
            requests: Vec::<(Rc<TextureDrawRequest>,U)>::new(),
            _phantom: Default::default(),
        }
    }

    pub fn add_item(&mut self, req: Rc<TextureDrawRequest>, item: U) {
        self.requests.push((req,item));
    }

    pub fn draw(&self, tg: &mut T, src: &mut TextureSourceManager, canvs: &ArenaCanvases, dims: &ArenaDims) {
        for (req,obj) in &self.requests {
            let (x,y,width,height) = req.measure(src);
            obj.process(tg,x,y,width,height,canvs,dims);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }
}
