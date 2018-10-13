use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element };

use print::{ PrintRun, Programs };
use composit::{ Compositor, Component, StateManager };
use drawing::{ AllCanvasMan, DrawingSession };
use shape::ShapeContext;
use dom::domutil;
use stage::Stage;
use types::{ Dot };
use wglraw;

use webgl_rendering_context::WebGLRenderingContext as glctx;
use stdweb::web::html_element::{
    CanvasElement
};

pub struct ShapeContextList {
    contexts: Vec<Box<ShapeContext>>
}

impl ShapeContextList {
    pub fn new() -> ShapeContextList {
        ShapeContextList {
            contexts: Vec::<Box<ShapeContext>>::new()
        }
    }
    
    pub fn add(&mut self, sc: Box<ShapeContext>) {
        self.contexts.push(sc);
    }
    
    pub fn reset(&mut self) {
        for c in &mut self.contexts {
            c.reset();
        }
    }
    
    pub fn go(&mut self, progs: &mut Programs) {
        for (ref gk,ref mut prog) in progs.map.iter_mut() {
            for ref mut c in &mut self.contexts {
                c.into_objects(gk,&mut prog.data);
            }
        }
    }
}
