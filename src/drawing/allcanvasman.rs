use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use dom::domutil;
use drawing::FlatCanvas;
use program::CanvasWeave;
use types::Dot;

pub struct AllCanvasMan {
    root: Element,
    pub canvases: Vec<FlatCanvas>,
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        AllCanvasMan {
            root: domutil::query_select(id),
            canvases: Vec::<FlatCanvas>::new()
        }
    }
    
    pub fn get_canvas(&self, idx: i32) -> Option<&FlatCanvas> {
        self.canvases.get(idx as usize)
    }
    
    pub fn flat_allocate(&mut self, size: Dot<i32,i32>, w: &CanvasWeave) -> FlatCanvas {
        let canvas : CanvasElement = 
            document().create_element("canvas")
                .ok().unwrap().try_into().unwrap();
        self.root.append_child(&canvas);
        let canvas = FlatCanvas::create(canvas,self.canvases.len(),size.0,size.1,w);
        self.canvases.push(canvas.clone());
        canvas
    }
}
