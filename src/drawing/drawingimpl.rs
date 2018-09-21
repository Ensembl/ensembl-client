use std::rc::Rc;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

use types::{ CPixel, RPixel, area_size };

use drawing::alloc::Ticket;
use drawing::alloc::Allocator;
    
use arena::{
    ArenaCanvases,
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
    
    pub fn lookup(&self, a: &Rc<Artist>) -> (Option<DrawingHash>,Option<Drawing>) {
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
}

/* A Artist can service some class of DrawingImpls.
 * A texture type will create an instance of them. Note that a
 * Artist is not parameterised, it can draw exactly one thing.
 */
pub trait Artist {
    fn draw(&self, canv: &mut ArenaCanvases, pos: CPixel);
    fn memoize_key(&self) -> Option<DrawingHash>  { None }
    fn measure(&self, canv: &mut ArenaCanvases) -> CPixel;
}

/* One request to draw on the backing canvas. A combination of
 * Artist and a ticket (to get a location, when ready)
 */
pub struct DrawingImpl {
    gen: Rc<Artist>,
    ticket: Ticket
}

#[derive(Clone)]
pub struct Drawing(Rc<DrawingImpl>);

impl Drawing {
    pub fn new(gen: Rc<Artist>, ticket: Ticket) -> Drawing {
        Drawing(
            Rc::new(DrawingImpl {
                gen,ticket
            }))
    }

    pub fn draw(&self, canvs: &mut ArenaCanvases, leafdrawman: &LeafDrawingManager) {
        let pos = leafdrawman.allocator.position(&self.0.ticket);
        self.0.gen.draw(canvs,pos);
    }
    
    pub fn measure(&self, src: &LeafDrawingManager) -> RPixel {
        let size = src.allocator.size(&self.0.ticket);
        let pos = src.allocator.position(&self.0.ticket);
        area_size(pos,size)
    }
}

/* Utility method to make creating Drawings simpler */
pub fn create_draw_request(leafdrawman: &mut LeafDrawingManager, ta: Rc<Artist>, size: CPixel) -> Drawing {
    let req;
    {
        let flat_alloc = &mut leafdrawman.allocator;
        req = Drawing::new(ta,flat_alloc.request(size));
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
            allocator: Allocator::new(20),
        }
    }

    pub fn add_request(&mut self, canvas: &mut ArenaCanvases, a: Rc<Artist>) -> Drawing {
        let (tdrk,val) = self.cache.lookup(&a);
        if let Some(tdrh) = val {
            // already in cache
            tdrh
        } else {
            let size = a.measure(canvas);
            let val = create_draw_request(self,a,size);
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
    
    pub fn allocate(&mut self) -> CPixel {
        self.allocator.allocate()
    }
}
