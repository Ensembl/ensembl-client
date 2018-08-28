use std::rc::Rc;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

use coord::{ CPixel, RPixel };

use alloc::Ticket;
use alloc::Allocator;

use shape::Shape;

use program::ProgramAttribs;
    
use arena::{
    ArenaCanvases,
    ArenaData,
};

pub struct DrawingHash(u64);

impl DrawingHash {
    pub fn new<K>(val: K) -> DrawingHash where K : Hash + Eq {
        let mut hasher = DefaultHasher::new();
        val.hash(&mut hasher);
        DrawingHash(hasher.finish())
    }
}

pub struct DrawingMemory {
    cache: HashMap<u64,Drawing>
}

impl DrawingMemory {
    pub fn new() -> DrawingMemory {
        DrawingMemory {
            cache: HashMap::<u64,Drawing>::new()
        }
    }

    pub fn insert(&mut self, key: &DrawingHash, val: Drawing) {
        self.cache.insert(key.0,val);
    }
    
    pub fn lookup(&self, a: &Box<Artist>) -> (Option<DrawingHash>,Option<Drawing>) {
        let tdrk = a.memoize_key();
        if let Some(tdrk) = tdrk {
            if let Some(obj) = self.cache.get(&tdrk.0) {
                // can cache, is cached
                (Some(tdrk),Some(obj.clone()))
            } else {
                // can cache, isn't cached
                (Some(tdrk),None)
            }
        } else {
            // Can't cache
            (None,None)
        }
    }
    
    pub fn clear(&mut self) {
        self.cache.clear();
    }
}

/* A Artist can service some class of DrawingImpls.
 * A texture type will create an instance of them. Note that a
 * Artist is not parameterised, it can draw exactly one thing.
 */
pub trait Artist {
    fn draw(&self, canv: &mut ArenaCanvases, x: i32, y: i32);
    fn memoize_key(&self) -> Option<DrawingHash>  { None }
    fn measure(&self, canv: &mut ArenaCanvases) -> (i32, i32);
}

/* One request to draw on the backing canvas. A combination of
 * Artist and a ticket (to get a location, when ready)
 */
pub struct DrawingImpl {
    gen: Box<Artist>,
    ticket: Ticket
}

#[derive(Clone)]
pub struct Drawing(Rc<DrawingImpl>);

impl Drawing {
    pub fn new(gen: Box<Artist>, ticket: Ticket) -> Drawing {
        Drawing(
            Rc::new(DrawingImpl {
                gen,ticket
            }))
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases, gtexreqman: &LeafDrawingManager) {
        let (x,y) = gtexreqman.allocator.position(&self.0.ticket);
        self.0.gen.draw(canvs,x,y);
    }
    
    pub fn measure(&self, src: &LeafDrawingManager) -> RPixel {
        let (width,height) = src.allocator.size(&self.0.ticket);
        let (x,y) = src.allocator.position(&self.0.ticket);
        RPixel(CPixel(x,y),CPixel(width,height))
    }
}

/* Utility method to make creating DrawingImpls simpler */
pub fn create_draw_request(gtexreqman: &mut LeafDrawingManager, ta: Box<Artist>, width: i32, height: i32) -> Drawing {
    let req;
    {
        let flat_alloc = &mut gtexreqman.allocator;
        req = Drawing::new(ta,flat_alloc.request(width,height));
    }
    req
}

/* Manages DrawingImpls. Single instance in Leaf. Just stores
 * them and calls draw when ready really. Little more than a fancy Vec.
 */
pub struct LeafDrawingManager {
    cache: DrawingMemory,
    tickets: Vec<Drawing>,
    allocator: Allocator,
}

impl LeafDrawingManager {
    pub fn new() -> LeafDrawingManager {
        LeafDrawingManager {
            cache: DrawingMemory::new(),
            tickets: Vec::<Drawing>::new(),
            allocator: Allocator::new(16),
        }
    }

    pub fn add_request(&mut self, canvas: &mut ArenaCanvases, a: Box<Artist>) -> Drawing {
        let (tdrk,val) = self.cache.lookup(&a);
        if let Some(tdrh) = val {
            // already in cache
            tdrh
        } else {
            let (width, height) = a.measure(canvas);
            let val = create_draw_request(self,a,width,height);
            if let Some(tdrk) = tdrk {
                // put in cache
                self.cache.insert(&tdrk,val.clone());
            }
            self.tickets.push(val.clone());
            val
        }
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases) {
        for tr in &self.tickets {
            tr.draw(canvs,self);
        }
    }
    
    pub fn clear(&mut self) {
        self.cache.clear();
        self.tickets.clear();
    }

    pub fn allocate(&mut self) -> (i32,i32) {
        self.allocator.allocate()
    }
}

/* A TextureItem is a trait which can place a drawn item onto a WebGL
 * canvas using textures. Parameterised by geometry so each will have
 * its own (as it has its own co-rodinate data to store).
 * 
 */

pub trait DrawnShape : Shape {
    fn set_texpos(&mut self, data: &RPixel);    
}


/* A DrawnShapeManager manages requests to draw an item onto a WebGL
 * canvas by storing relevant TextureItems. One per geometry.
 */

pub struct DrawnShapeManager {
    requests: Vec<(Drawing,Box<DrawnShape>)>
}

impl DrawnShapeManager {
    pub fn new() -> DrawnShapeManager {
        DrawnShapeManager {
            requests: Vec::<(Drawing,Box<DrawnShape>)>::new()
        }
    }
    
    pub fn add_item(&mut self, req: Drawing, item: Box<DrawnShape>) {
        self.requests.push((req,item));
    }
    
    pub fn into_objects(&mut self, tg: &mut ProgramAttribs, adata: &mut ArenaData) {
        let src = &adata.gtexreqman;
        for (ref mut req,ref mut obj) in &mut self.requests {
            let tp = req.measure(src);
            obj.set_texpos(&tp);
            obj.into_objects(tg,adata);
        }
    }
    
    pub fn clear(&mut self) {
        self.requests.clear();
    }        
}
