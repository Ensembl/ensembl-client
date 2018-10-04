use std::collections::HashMap;

use stdweb::web::{ Element, INode, document };
use stdweb::web::html_element::CanvasElement;
use stdweb::unstable::TryInto;

use dom::domutil;
use drawing::FlatCanvas;

pub struct AllCanvasMan {
    root: Element,
}

impl AllCanvasMan {
    pub fn new(id: &str) -> AllCanvasMan {
        AllCanvasMan {
            root: domutil::query_select(id),
        }
    }
    
    pub fn allocate(&mut self, width: i32, height: i32) -> FlatCanvas {
        let canvas : CanvasElement = 
            document().create_element("canvas")
                .ok().unwrap().try_into().unwrap();
        self.root.append_child(&canvas);
        FlatCanvas::create(canvas,width,height)
    }
}
