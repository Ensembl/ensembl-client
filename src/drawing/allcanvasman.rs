use std::collections::HashMap;

use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use dom::domutil;
use drawing::{  DrawingSession, FlatCanvas };
use program::CanvasWeave;
use types::Dot;

pub struct CanvasRemover(u32);

impl CanvasRemover {
    pub fn remove(&self, aca: &mut AllCanvasAllocator) {
        aca.remove(self.0);
    }
}

pub struct AllCanvasAllocator {
    root: Element,
    idx: u32,
    pub canvases: HashMap<u32,FlatCanvas>    
}

impl AllCanvasAllocator {
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

pub struct AllCanvasMan {
    alloc: AllCanvasAllocator,
    ds: Option<DrawingSession>
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        AllCanvasMan {
            alloc: AllCanvasAllocator {
                root: domutil::query_select(id),
                canvases: HashMap::<u32,FlatCanvas>::new(),
                idx: 0,
            },
            ds: None,
        }
    }
    
    fn ds_init(&mut self) {
        self.ds = Some(DrawingSession::new(&mut self.alloc));
    }
    
    pub fn get_drawing_session<'a>(&'a mut self) -> &'a mut DrawingSession {
        self.get_ds_alloc().0
    }
    
    pub fn get_ds_alloc<'a>(&'a mut self) -> (&'a mut DrawingSession,&'a mut AllCanvasAllocator) {
        if let None = self.ds {
            self.ds_init();
        }
        (self.ds.as_mut().unwrap(),&mut self.alloc)
    }
    
    pub fn reset(&mut self) {
        let ds = self.ds.take();
        if let Some(ref ds) = ds {
            ds.finish(&mut self.alloc);
        }
        self.ds_init();
    }    
}
