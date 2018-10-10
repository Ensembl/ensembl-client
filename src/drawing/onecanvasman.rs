use std::rc::Rc;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

use types::{ CPixel, RPixel, area_size, cpixel };
use drawing::alloc::{ Ticket, Allocator };
use drawing::{ FlatCanvas, Drawing, Artist };

pub struct DrawingHash(u64);

impl DrawingHash {
    pub fn new<K>(val: K) -> DrawingHash where K : Hash + Eq {
        let mut hasher = DefaultHasher::new();
        val.hash(&mut hasher);
        DrawingHash(hasher.finish())
    }
}

struct DrawingMemory {
    cache: HashMap<u64,Drawing>
}

impl DrawingMemory {
    fn new() -> DrawingMemory {
        DrawingMemory {
            cache: HashMap::<u64,Drawing>::new()
        }
    }

    fn insert(&mut self, key: &DrawingHash, val: Drawing) {
        self.cache.insert(key.0,val);
    }
    
    fn lookup(&self, a: &Rc<Artist>) -> (Option<DrawingHash>,Option<Drawing>) {
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

/* Manages DrawingImpls. Single instance in Leaf. Just stores
 * them and calls draw when ready really. Little more than a fancy Vec.
 */
pub struct OneCanvasManager {
    pub canvas: Option<FlatCanvas>,
    standin: FlatCanvas,
    cache: DrawingMemory,
    drawings: Vec<Drawing>,
    allocator: Allocator,
}

impl OneCanvasManager {
    pub fn new(standin: &FlatCanvas) -> OneCanvasManager {
        OneCanvasManager {
            canvas: None,
            standin: standin.clone(),
            cache: DrawingMemory::new(),
            drawings: Vec::<Drawing>::new(),
            allocator: Allocator::new(20),
        }
    }

    pub fn add_request(&mut self, a: Rc<Artist>) -> Drawing {
        let (tdrk,val) = self.cache.lookup(&a);
        if let Some(tdrh) = val {
            // already in cache
            tdrh
        } else {
            let margin = a.margin();
            let size = a.measure(&self.standin);
            let mask_size = a.measure_mask(&self.standin);
            let flat_alloc = &mut self.allocator;
            let req = flat_alloc.request(size + cpixel(2,2)*margin);
            let mask_req = flat_alloc.request(mask_size + cpixel(2,2));
            let val = Drawing::new(a,req,mask_req);
            if let Some(tdrk) = tdrk {
                // put in cache
                self.cache.insert(&tdrk,val.clone());
            }
            self.drawings.push(val.clone());
            val
        }
    }

    pub fn draw(&mut self, canvs: FlatCanvas) {
        if let Some(ref old) = self.canvas {
            old.remove();
        }
        self.canvas = Some(canvs);
        for tr in &self.drawings {
            tr.draw(self);
        }
    }
    
    pub fn allocate(&mut self) -> CPixel {
        self.allocator.allocate()
    }
    
    pub fn ticket_pos(&self, t: &Ticket) -> CPixel {
        self.allocator.position(&t)
    }
    
    pub fn ticket_size(&self, t: &Ticket) -> RPixel {
        let size = self.allocator.size(t);
        let pos = self.allocator.position(t);
        area_size(pos,size)
    }    
}
