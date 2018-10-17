use std::collections::HashMap;

use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use composit::Leaf;
use dom::domutil;
use drawing::{  DrawingSession, FlatCanvas };
use program::CanvasWeave;
use types::{ Dot, cpixel };

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
    ds: HashMap<Leaf,DrawingSession>,
    standin: FlatCanvas,
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        let mut alloc = AllCanvasAllocator {
            root: domutil::query_select(id),
            canvases: HashMap::<u32,FlatCanvas>::new(),
            idx: 0,
        };
        let standin = alloc.flat_allocate(cpixel(2,2),&CanvasWeave::Pixelate);
        AllCanvasMan {
            alloc,
            ds: HashMap::<Leaf,DrawingSession>::new(),
            standin
        }
    }
        
    pub fn get_drawing_session<'a>(&'a mut self, leaf: &Leaf) -> &'a mut DrawingSession {
        self.get_ds_alloc(leaf).0
    }
    
    pub fn get_ds_alloc<'a>(&'a mut self, leaf: &Leaf) -> (&'a mut DrawingSession,&'a mut AllCanvasAllocator) {
        let (dss,alloc,standin) = (&mut self.ds, &mut self.alloc,&self.standin);
        let ds = dss.entry(leaf.clone()).or_insert_with(|| 
            DrawingSession::new(alloc,standin)
        );
        (ds,alloc)
    }
    
    pub fn reset(&mut self, leaf: &Leaf) {
        if let Some(ds) = self.ds.remove(leaf) {
            ds.finish(&mut self.alloc);
        }
    }    
}
