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

use std::cell::RefCell;
use std::rc::Rc;

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

pub struct TextGeometry {
    std: GeomContext,
    pos: GTypeAttrib,
    origin: GTypeAttrib,
    coord: GTypeAttrib,
    sampler: GTypeCanvasTexture,
    tickets: GTypeTicket,
}

pub struct TextReq {
    width: u32,
    height: u32,
    chars: String,
    font: FCFont
}

impl TextReq {
    fn new(chars: &str, width: u32, height: u32, font: &FCFont) -> TextReq {
        TextReq {
            width, height,
            font: font.clone(),
            chars: chars.to_string()
        }
    }
    
    fn make_ticket(&self, flat_alloc: &mut Allocator) -> Ticket {
        flat_alloc.request(self.width,self.height)
    }
    
    fn insert(&self, adata: &ArenaData, x: u32, y: u32) {
        adata.flat.text(&self.chars,x,y,&self.font);
    }
}

impl GTypeHolder for TextGeometry {
    fn gtypes(&mut self) -> (&GeomContext,Vec<&mut GType>) {
        (&self.std,
        vec! { &mut self.sampler, &mut self.pos,
               &mut self.origin, &mut self.coord,
               &mut self.tickets })
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
            tickets: GTypeTicket::new(),
        }
    }
            
    pub fn triangle(&mut self,origin:&[f32;2],points:&[f32;6],tex_points:&[f32;6]) {
        self.pos.add(points);
        self.origin.add(origin);
        self.coord.add(tex_points);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,origin:&[f32;2],p:&[f32;4],t:&[f32;4]) {
        self.triangle(origin,&[p[0],p[1],p[2],p[1],p[0],p[3]],
                             &[t[0],t[1],t[2],t[1],t[0],t[3]]);
        self.triangle(origin,&[p[2],p[3],p[0],p[3],p[2],p[1]],
                             &[t[2],t[3],t[0],t[3],t[2],t[1]]);
    }
    
    pub fn text(&mut self,origin:&[f32;2],text: &str,font: &FCFont) {
        let adatac = self.std.get_adata();
        {
            let mut adata = adatac.borrow_mut();
            let flat_alloc = &mut adata.flat_alloc;
            let req = TextReq::new("Hello, World!",80,16,font);
            let t = req.make_ticket(flat_alloc);
            let t = req.make_ticket(flat_alloc);
            let f = Box::new(
                move |adata: &ArenaData,x: u32,y: u32| {
                    req.insert(adata,x,y);
                }
            );
            self.tickets.add_ticket(t,f);
        }
        let adata = adatac.borrow();
        let flat = &adata.flat;
        let (x_px,y_px) = (0,0);
        let (w_px,h_px) = flat.text("Hello, World!",0,0,font);
        let (x,y) = (flat.prop_x(x_px),flat.prop_y(y_px));
        let (w,h) = (flat.prop_x(w_px),flat.prop_y(h_px));
        let t2 = [x,y+h,x+w,y];
        let p2 = [0.,0.,adata.prop_x(w_px),adata.prop_y(h_px)];
        self.rectangle(origin,&p2,&t2);
    }
}

impl Geometry for TextGeometry {
    fn populate(&mut self) { geometry::populate(self); }
    fn draw(&mut self,stage:&Stage) { geometry::draw(self,stage); }
}
