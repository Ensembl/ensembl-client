use std::rc::Rc;
use std::collections::HashMap;
use std::hash::Hash;
use std::hash::Hasher;
use std::collections::hash_map::DefaultHasher;

use types::{ CPixel, RPixel, area_size, RFraction, cpixel, area };
use drawing::alloc::{ Ticket, Allocator };
use drawing::{ FlatCanvas, Artist, FlatCanvasManager };
use shape::CanvasIdx;
use drawing::allcanvasman::ArenaFlatCanvas;

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
    ticket: Ticket,
    mask_ticket: Ticket
}

#[derive(Clone)]
pub struct Drawing(Rc<DrawingImpl>);

impl Drawing {
    pub fn new(gen: Rc<Artist>, ticket: Ticket, mask_ticket: Ticket) -> Drawing {
        Drawing(
            Rc::new(DrawingImpl {
                gen, ticket, mask_ticket
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
