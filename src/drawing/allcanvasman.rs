use std::collections::HashMap;

use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use dom::domutil;
use drawing::FlatCanvas;
use program::CanvasWeave;
use types::Dot;

pub struct CanvasRemover(u32);

impl CanvasRemover {
    pub fn remove(&self, acm: &mut AllCanvasMan) {
        acm.remove(self.0);
    }
}

pub struct AllCanvasMan {
    root: Element,
    idx: u32,
    pub canvases: HashMap<u32,FlatCanvas>
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        AllCanvasMan {
            root: domutil::query_select(id),
            canvases: HashMap::<u32,FlatCanvas>::new(),
            idx: 0,
        }
    }
        
    pub fn all_canvases(&self) -> Vec<&FlatCanvas> {
        self.canvases.values().collect()
    }
    
    fn remove(&mut self, idx: u32) {
        self.canvases.remove(&idx);
    }
    
    pub fn flat_allocate(&mut self, size: Dot<i32,i32>, 
                         w: &CanvasWeave) -> FlatCanvas {
        let canvas : CanvasElement = 
            document().create_element("canvas")
                .ok().unwrap().try_into().unwrap();
        self.root.append_child(&canvas);
        let rm = CanvasRemover(self.idx);
        let canvas = FlatCanvas::create(canvas,size.0,size.1,w,rm);
        self.canvases.insert(self.idx,canvas.clone());
        self.idx += 1;
        canvas
    }
}
