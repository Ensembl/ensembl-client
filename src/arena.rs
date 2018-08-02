use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;
use geometry::Geometry;
use labl::LablGeometry;
use text::TextGeometry;
use geometry::stretch::StretchGeometry;
use geometry::pin::PinGeometry;
use geometry::fix::FixGeometry;

use canvasutil::FCFont;

struct ArenaGeometries {
    stretch: StretchGeometry,
    pin: PinGeometry,
    fix: FixGeometry,
    labl: LablGeometry,
    text: TextGeometry,
}

use alloc::Allocator;

pub struct ArenaData {
    spec: ArenaSpec,
    pub flat_alloc: Allocator,
    pub flat: Rc<canvasutil::FlatCanvas>,
    pub ctx: glctx,
    pub aspect: f32,
    pub width_px: u32,
    pub height_px: u32,
}

impl ArenaData {
    pub fn prop_x(&self,x_px: u32) -> f32 {
        (x_px as f64 * 2.0 / self.width_px as f64) as f32
    }

    pub fn prop_y(&self,y_px: u32) -> f32 {
        (y_px as f64 * 2.0 / self.height_px as f64) as f32
    }
    
    fn nudge1(&self,val: f32, size: u32) -> f32 {
        let n = (val * size as f32 / 2.).round();
        n * 2. / size as f32
    }
    
    pub fn nudge(&self,input: [f32;2]) -> [f32;2] {
        [self.nudge1(input[0],self.width_px),
         self.nudge1(input[1],self.height_px)]
    }
    
    pub fn settle(&self, stage: &mut Stage) {
        // XXX settle to account for zoom
        let [hpos,vpos] = self.nudge([stage.hpos,stage.vpos]);
        stage.hpos = hpos;
        stage.vpos = vpos;
    }
}

pub struct ArenaSpec {
    pub flat_width: u32,
    pub flat_height: u32,
    pub debug: bool,
}

impl ArenaSpec {
    pub fn new() -> ArenaSpec {
        ArenaSpec {
            flat_width: 256,
            flat_height: 256,
            debug: false
        }
    }
}

pub struct Arena {
    data: Rc<RefCell<ArenaData>>,
    geom: ArenaGeometries
}

impl Arena {
    pub fn new(selector: &str, mcsel: &str, spec: ArenaSpec) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector,mcsel,spec.debug);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(2,2));
        let data = Rc::new(RefCell::new(ArenaData {
            ctx, spec, flat,
            aspect: canvasutil::aspect_ratio(&canvas),
            width_px: canvas.width(),
            height_px: canvas.height(),
            flat_alloc: Allocator::new(16),
        }));
        let data_g = data.clone();
        let data_b = data_g.borrow();
        let arena = Arena { data, geom: ArenaGeometries {
            stretch: enclose! { (data_g) StretchGeometry::new(&data_b) },
            pin:     enclose! { (data_g) PinGeometry::new(&data_b) },
            fix:     enclose! { (data_g) FixGeometry::new(&data_b) },
            labl: LablGeometry::new(data_g.clone()),
            text: enclose! { (data_g) TextGeometry::new(data_g) },
        }};
        arena
    }

    pub fn settle(&self, stage: &mut Stage) {
        self.data.borrow().settle(stage);
    }
    
    pub fn geom_labl(&mut self,f: &mut FnMut(&mut LablGeometry)) {
        let g = &mut self.geom.labl;
        f(g);
    }    

    pub fn geom_text(&mut self,f: &mut FnMut(&mut TextGeometry)) {
        let g = &mut self.geom.text;
        f(g);
    }    

    pub fn triangle_stretch(&mut self, p: &[f32;6], c: &[f32;3]) {
        self.geom.stretch.triangle(p,c);
    }

    pub fn rectangle_stretch(&mut self, p: &[f32;4], c: &[f32;3]) {
        self.geom.stretch.rectangle(p,c);
    }

    pub fn triangle_pin(&mut self, r: &[f32;2], p: &[f32;6], c :&[f32;3]) {
        self.geom.pin.triangle(r,p,c);
    }

    pub fn text_pin(&mut self, origin:&[f32;2],chars: &str,font: &FCFont) {
        let datam = &mut self.data.borrow_mut();
        self.geom.text.text(datam,origin,chars,font);
    }

    pub fn triangle_fix(&mut self,points:&[f32;9],colour:&[f32;3]) {
        self.geom.fix.triangle(points,colour);
    }
    
    pub fn rectangle_fix(&mut self,p:&[f32;6],colour:&[f32;3]) {
        self.geom.fix.rectangle(p,colour);
    }

    pub fn populate(&mut self) {
        let datam = &mut self.data.borrow_mut();
        let (x,y) = datam.flat_alloc.allocate();
        datam.flat = Rc::new(canvasutil::FlatCanvas::create(x,y));

        self.geom.stretch.populate(datam);
        self.geom.pin.populate(datam);
        self.geom.text.populate(datam);
        self.geom.labl.populate(datam);
        self.geom.fix.populate(datam);
    }

    pub fn animate(&mut self, stage: &Stage) {
        // prepare arena
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        // draw each geometry
        let datam = &mut self.data.borrow_mut();
        self.geom.stretch.draw(datam,&stage);
        self.geom.pin.draw(datam,&stage);
        self.geom.text.draw(datam,&stage);
        self.geom.labl.draw(datam,&stage);
        self.geom.fix.draw(datam,&stage);
    }
}



pub struct Stage {
    pub hpos: f32,
    pub vpos: f32,
    pub zoom: f32,
    pub cursor: [f32;2],
}

impl Stage {
    pub fn new() -> Stage {
        Stage { hpos: 0.0, vpos: 0.0, zoom: 1.0, cursor: [0.0,0.0] }
    }
}
