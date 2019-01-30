use std::collections::HashMap;
use std::collections::hash_map::Entry;

use composit::Carriage;
use drawing::{ OneCanvasManager, FlatCanvas, AllCanvasAllocator };
use program::{ CanvasWeave };

pub struct DrawingSession {
    next_canv_idx: u32,
    canvases: HashMap<CanvasWeave,OneCanvasManager>,
    standin: FlatCanvas,
}

impl DrawingSession {
    pub fn new(aca: &mut AllCanvasAllocator) -> DrawingSession {
        DrawingSession {
            next_canv_idx: 0,
            canvases: HashMap::<CanvasWeave,OneCanvasManager>::new(),
            standin: aca.get_standin().clone()
        }
    }

    pub fn indices(&self) -> HashMap<CanvasWeave,u32> {
        let mut out = HashMap::<CanvasWeave,u32>::new();
        for (w,ocm) in &self.canvases {
            out.insert(*w,ocm.index());
        }
        out
    }

    pub fn all_ocm(&self) -> Vec<&OneCanvasManager> {
        self.canvases.values().collect()
    }

    pub fn get_ocm(&mut self, weave: CanvasWeave) -> &mut OneCanvasManager {
        let standin = self.standin.clone();
        match self.canvases.entry(weave) {
            Entry::Occupied(e) => e.into_mut(),
            Entry::Vacant(e) => {
                self.next_canv_idx += 1;
                e.insert(OneCanvasManager::new(self.next_canv_idx-1,weave,&standin))
            }
        }
    }

    pub fn redraw_component(&mut self, c: &mut Carriage) {
        c.draw_drawings(self);
    }
    
    pub fn finalise(&mut self, aca: &mut AllCanvasAllocator) {
        for (ref weave,ref mut ocm) in &mut self.canvases {                    
            let size = ocm.allocate();
            let mut canv = aca.flat_allocate(size,*weave);
            ocm.draw(aca,canv);
        }
    }
    
    pub fn finish(&self, aca: &mut AllCanvasAllocator) {
        //self.standin.remove(aca); // XXX standin global now but should be freed on unload
        for ocm in self.canvases.values() {
            ocm.finish(aca);
        }
    }
}
