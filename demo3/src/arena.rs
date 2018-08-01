#[macro_use]
use util;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use canvasutil::{
    FlatCanvas
};
use wglraw;
use geometry::Geometry;
use hosc::HoscGeometry;
use hofi::HofiGeometry;
use fixx::FixxGeometry;
use labl::LablGeometry;
use text::TextGeometry;

struct ArenaGeometries {
    hosc: HoscGeometry,
    hofi: HofiGeometry,
    labl: LablGeometry,
    fixx: FixxGeometry,
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
}

pub struct ArenaSpec {
    pub flat_width: u32,
    pub flat_height: u32,
}

impl ArenaSpec {
    pub fn new() -> ArenaSpec {
        ArenaSpec {
            flat_width: 256,
            flat_height: 256
        }
    }
}

pub struct Arena {
    data: Rc<RefCell<ArenaData>>,
    geom: ArenaGeometries
}

impl Arena {
    pub fn new(selector: &str, spec: ArenaSpec) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(canvasutil::FlatCanvas::create(spec.flat_width,spec.flat_height));
        let data = Rc::new(RefCell::new(ArenaData {
            ctx, spec, flat,
            aspect: canvasutil::aspect_ratio(&canvas),
            width_px: canvas.width(),
            height_px: canvas.height(),
            flat_alloc: Allocator::new(16),
        }));
        let data_g = data.clone();
        let arena = Arena { data, geom: ArenaGeometries {
            hosc: HoscGeometry::new(data_g.clone()),
            hofi: HofiGeometry::new(data_g.clone()),
            labl: LablGeometry::new(data_g.clone()),
            fixx: FixxGeometry::new(data_g.clone()),
            text: enclose! { (data_g) TextGeometry::new(data_g) },
        }};
        arena
    }

    pub fn geom_hosc(&mut self,f: &mut FnMut(&mut HoscGeometry)) {
        let g = &mut self.geom.hosc;
        f(g);
    }
    
    pub fn geom_hofi(&mut self,f: &mut FnMut(&mut HofiGeometry)) {
        let g = &mut self.geom.hofi;
        f(g);
    }
    
    pub fn geom_fixx(&mut self,f: &mut FnMut(&mut FixxGeometry)) {
        let g = &mut self.geom.fixx;
        f(g);
    }    

    pub fn geom_labl(&mut self,f: &mut FnMut(&mut LablGeometry)) {
        let g = &mut self.geom.labl;
        f(g);
    }    

    pub fn geom_text(&mut self,f: &mut FnMut(&mut TextGeometry)) {
        let g = &mut self.geom.text;
        f(g);
    }    

    pub fn populate(&mut self) {
        let (x,y) = self.data.borrow_mut().flat_alloc.allocate();
        js! { console.log("xy",@{x},@{y}); };
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.populate());
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.populate());
        self.geom_labl(&mut |g:&mut LablGeometry| g.populate());
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.populate());
        self.geom_text(&mut |g:&mut TextGeometry| g.populate());
    }

    pub fn animate(&mut self, stage: &Stage) {
        // prepare arena
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        // draw each geometry
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.draw(&stage));
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.draw(&stage));
        self.geom_labl(&mut |g:&mut LablGeometry| g.draw(&stage));
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.draw(&stage));
        self.geom_text(&mut |g:&mut TextGeometry| g.draw(&stage));
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
