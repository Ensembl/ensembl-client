use std::rc::Rc;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

use types::{ CPixel, RPixel, area_size, RFraction, cpixel, area };
use drawing::alloc::{ Ticket, Allocator };
use drawing::FlatCanvas;
use shape::CanvasIdx;
use arena::ArenaFlatCanvas;

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
    fn draw(&self, canv: &FlatCanvas, pos: CPixel);
    fn draw_mask(&self, canv: &FlatCanvas, pos: CPixel) {
        canv.bitmap(&vec!{ 
            0,0,0,255,0,0,0,255,0,0,0,255,
            0,0,0,255,0,0,0,255,0,0,0,255,
            0,0,0,255,0,0,0,255,0,0,0,255,
        }, area_size(pos,cpixel(3,3)));
    }
    fn memoize_key(&self) -> Option<DrawingHash>  { None }
    fn measure(&self, canv: &FlatCanvas) -> CPixel;
    fn measure_mask(&self, canv: &FlatCanvas) -> CPixel { cpixel(1,1) }
}

pub struct Artwork {
    pub pos: RFraction,
    pub mask_pos: RFraction,
    pub size: CPixel,
    pub index: CanvasIdx
}

/* One request to draw on the backing canvas. A combination of
 * Artist and a ticket (to get a location, when ready)
 */
pub struct DrawingImpl {
    gen: Rc<Artist>,
    canvas_idx: Option<CanvasIdx>,
    ticket: Ticket,
    mask_ticket: Ticket
}

#[derive(Clone)]
pub struct Drawing(Rc<DrawingImpl>);

impl Drawing {
    pub fn new(gen: Rc<Artist>, ticket: Ticket, mask_ticket: Ticket) -> Drawing {
        Drawing(
            Rc::new(DrawingImpl {
                gen, ticket, mask_ticket, canvas_idx: None
            }))
    }

    pub fn draw(&self, leafdrawman: &FlatCanvasManager) {
        let pos = leafdrawman.allocator.position(&self.0.ticket);
        self.0.gen.draw(&mut leafdrawman.canvas.as_ref().unwrap().canvas(),pos);
        let mask_pos = leafdrawman.allocator.position(&self.0.mask_ticket);
        self.0.gen.draw_mask(&mut leafdrawman.canvas.as_ref().unwrap().canvas(),mask_pos + cpixel(1,1));
    }

    pub fn artwork(&self, src: &FlatCanvasManager) -> Artwork {
        let canvas = src.canvas.as_ref().unwrap();
        let cs = canvas.canvas().size().as_fraction();
        let m = self.measure(src);
        let mm = self.measure_mask(src).inset(area(cpixel(1,1),cpixel(1,1)));
        Artwork {
            pos: m.as_fraction() / cs,
            mask_pos: mm.as_fraction() / cs,
            size: m.area(),
            index: src.canvas_idx.as_ref().unwrap().clone()
        }
    }
    
    pub fn measure(&self, src: &FlatCanvasManager) -> RPixel {
        let size = src.allocator.size(&self.0.ticket);
        let pos = src.allocator.position(&self.0.ticket);
        area_size(pos,size)
    }

    pub fn measure_mask(&self, src: &FlatCanvasManager) -> RPixel {
        let size = src.allocator.size(&self.0.mask_ticket);
        let pos = src.allocator.position(&self.0.mask_ticket);
        area_size(pos,size)
    }
}

/* Manages DrawingImpls. Single instance in Leaf. Just stores
 * them and calls draw when ready really. Little more than a fancy Vec.
 */
pub struct FlatCanvasManager {
    canvas: Option<ArenaFlatCanvas>,
    canvas_idx: Option<CanvasIdx>,
    standin: FlatCanvas,
    cache: DrawingMemory,
    drawings: Vec<Drawing>,
    allocator: Allocator,
}

impl FlatCanvasManager {
    pub fn new() -> FlatCanvasManager {
        FlatCanvasManager {
            canvas: None,
            canvas_idx: None,
            standin: FlatCanvas::create(2,2),
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
            let size = a.measure(&self.standin);
            let mask_size = a.measure_mask(&self.standin);
            let flat_alloc = &mut self.allocator;
            let req = flat_alloc.request(size);
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

    pub fn draw(&mut self, canvs: ArenaFlatCanvas, canvas_idx: CanvasIdx) {
        self.canvas = Some(canvs);
        self.canvas_idx = Some(canvas_idx);
        for tr in &self.drawings {
            tr.draw(self);
        }
    }
    
    pub fn allocate(&mut self) -> CPixel {
        self.allocator.allocate()
    }
}
