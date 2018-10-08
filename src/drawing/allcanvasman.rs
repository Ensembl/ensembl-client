use std::rc::Rc;
use std::collections::HashMap;

use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use dom::domutil;
use drawing::FlatCanvas;
use program::CanvasWeave;
use types::Dot;

#[derive(Clone)]
pub struct ArenaFlatCanvas {
    canvas: Rc<FlatCanvas>,
    index: Option<usize>,
    w: CanvasWeave
}

impl ArenaFlatCanvas {
    pub fn canvas(&self) -> Rc<FlatCanvas> { 
        self.canvas.clone()
    }
    
    pub fn index(&self) -> usize { self.index.unwrap() }
}

pub struct AllCanvasMan {
    root: Element,
    pub canvases: Vec<ArenaFlatCanvas>,
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        AllCanvasMan {
            root: domutil::query_select(id),
            canvases: Vec::<ArenaFlatCanvas>::new()
        }
    }
    
    pub fn get_canvas(&self, idx: i32) -> Option<&ArenaFlatCanvas> {
        self.canvases.get(idx as usize)
    }
    
    pub fn flat_allocate(&mut self, size: Dot<i32,i32>, w: CanvasWeave) -> ArenaFlatCanvas {
        let canvas : CanvasElement = 
            document().create_element("canvas")
                .ok().unwrap().try_into().unwrap();
        self.root.append_child(&canvas);
        let canvas = FlatCanvas::create(canvas,size.0,size.1);
        let out = ArenaFlatCanvas {
            canvas: Rc::new(canvas),
            index: Some(self.canvases.len()),
            w
        };
        self.canvases.push(out.clone());
        out
    }
}
