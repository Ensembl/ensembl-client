use geometry::{
    Geometry,
    GeomContext,
    GTypeHolder,
    GTypeAttrib,
    GType,
    GTypeCanvasTexture,
    GTypeTicket,
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLProgram as glprog
};

use geometry;

use alloc::{
    Ticket,
    Allocator
};

use arena::{
    ArenaData,
    Stage
};

use canvasutil::FCFont;
use canvasutil::FlatCanvas;
use canvasutil;

use std::cell::RefCell;
use std::rc::Rc;
use std::collections::HashMap;
use std::collections::hash_map::Entry;

const V_SRC : &str = "
attribute vec2 aVertexPosition;
attribute vec2 aOrigin;
attribute vec2 aTextureCoord;

uniform float uAspect;
uniform float uStageHpos;
uniform float uStageVpos;
uniform float uStageZoom;

varying highp vec2 vTextureCoord;

void main() {
    gl_Position = vec4(
        (aOrigin.x - uStageHpos) * uStageZoom + aVertexPosition.x,
        (aOrigin.y - uStageVpos) + aVertexPosition.y,
        0.0, 1.0
    );
    vTextureCoord = aTextureCoord;
}
";

const F_SRC : &str = "
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
}
";

pub struct TextTicketReq {
    width: u32,
    height: u32,
    chars: String,
    font: FCFont,
    ticket: Ticket
}

impl TextTicketReq {
    fn new(adata: &mut ArenaData, chars: &str, font: &FCFont) -> Rc<TextTicketReq> {
        let flat = &adata.flat;
        let (width, height) = flat.measure(chars,font);
        let flat_alloc = &mut adata.flat_alloc;
        Rc::new(TextTicketReq {
            width, height,
            ticket: flat_alloc.request(width,height),
            font: font.clone(),
            chars: chars.to_string()
        })
    }
}

pub struct TextReq {
    origin: [f32;2],
    tr: Rc<TextTicketReq>,
}

impl TextReq {
    fn new(tr: Rc<TextTicketReq>, origin: &[f32;2]) -> TextReq {
        TextReq {
            tr, origin: *origin
        }
    }
}

pub struct TextGeometry {
    std: GeomContext,
    requests: Vec<TextReq>,
    tickets: HashMap<(String,FCFont),Rc<TextTicketReq>>,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
}

impl GTypeHolder for TextGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,
        vec! { &mut self.sampler, &mut self.pos,
               &mut self.origin, &mut self.coord })
    }
}

impl TextGeometry {
    pub fn new(adata: Rc<RefCell<ArenaData>>) -> TextGeometry {                   
        TextGeometry {
            std: GeomContext::new(adata.clone(),&V_SRC,&F_SRC),
            pos:    GTypeAttrib::new(&adata.borrow(),"aVertexPosition",2,1),
            origin: GTypeAttrib::new(&adata.borrow(),"aOrigin",2,3),
            coord:  GTypeAttrib::new(&adata.borrow(),"aTextureCoord",2,1),
            sampler: GTypeCanvasTexture::new("uSampler",0),
            requests: Vec::<TextReq>::new(),
            tickets: HashMap::<(String,FCFont),Rc<TextTicketReq>>::new(),
        }
    }
            
    fn triangle(&mut self,origin:&[f32;2],points:&[f32;6],tex_points:&[f32;6]) {
        self.pos.add(points);
        self.origin.add(origin);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    fn rectangle(&mut self,origin:&[f32;2],p:&[f32;4],t:&[f32;4]) {
        self.triangle(origin,&[p[0],p[1],p[2],p[1],p[0],p[3]],
                             &[t[0],t[1],t[2],t[1],t[0],t[3]]);
        self.triangle(origin,&[p[2],p[3],p[0],p[3],p[2],p[1]],
                             &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
    
    fn prepopulate(&mut self) {
        let adatac = self.std.get_adata();
        let mut adata = adatac.borrow_mut();
        for tr in self.tickets.values() {
            let (x,y) = adata.flat_alloc.position(&tr.ticket);
            adata.flat.text(&tr.chars,x,y,&tr.font);
        }
        let flat = &adata.flat;
        let mut data = Vec::<([f32;2],[f32;4],[f32;4])>::new();
        for req in &self.requests {
            let nudge = adata.nudge((req.origin[0],req.origin[1]));
            let p = [
                nudge.0, nudge.1, 
                nudge.0 + adata.prop_x(req.tr.width),
                nudge.1 + adata.prop_y(req.tr.height)
            ];
            let (x,y) = adata.flat_alloc.position(&req.tr.ticket);
            let t = [flat.prop_x(x), flat.prop_y(y + req.tr.height),
                     flat.prop_x(x + req.tr.width), flat.prop_y(y)];
            data.push((req.origin,p,t));
        }
        for (origin,p,t) in data {
            self.rectangle(&origin,&p,&t);
        }
        self.requests.clear();
    }
    
    pub fn text(&mut self,origin:&[f32;2],text: &str,font: &FCFont) {
        let adatac = self.std.get_adata();
        let mut adata = adatac.borrow_mut();
        let tickets = &mut self.tickets;
        let tr = match tickets.entry((text.to_string(),font.clone())) {
            Entry::Occupied(v) => 
                v.into_mut(),
            Entry::Vacant(v) => 
                v.insert(TextTicketReq::new(&mut adata,text,font))
        };
        let req = TextReq::new(tr.clone(),origin);
        self.requests.push(req);
    }
}

impl Geometry for TextGeometry {
    fn populate(&mut self) {
        self.prepopulate();
        geometry::populate(self);
    }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
