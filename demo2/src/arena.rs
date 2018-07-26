use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
};

use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;
use geometry::Geometry;
use hosc::HoscGeometry;
use hofi::HofiGeometry;
use fixx::FixxGeometry;
use labl::LablGeometry;

struct ArenaGeometries {
    hosc: HoscGeometry,
    hofi: HofiGeometry,
    labl: LablGeometry,
    fixx: FixxGeometry,
}

pub struct ArenaData {
    pub ctx: glctx,
    pub aspect: f32,
}

pub struct Arena {
    data: Rc<RefCell<ArenaData>>,
    geom: ArenaGeometries
}

impl Arena {
    pub fn new(selector: &str) -> Arena {
        let canvas = canvasutil::prepare_canvas(selector);
        let ctx = wglraw::prepare_context(&canvas);
        let data = Rc::new(RefCell::new(ArenaData {
            ctx,
            aspect: canvasutil::aspect_ratio(&canvas),
        }));
        let data_g = data.clone();
        let arena = Arena { data, geom: ArenaGeometries {
            hosc: HoscGeometry::new(data_g.clone()),
            hofi: HofiGeometry::new(data_g.clone()),
            labl: LablGeometry::new(data_g.clone()),
            fixx: FixxGeometry::new(data_g.clone()),
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

    pub fn populate(&mut self) {
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.populate());
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.populate());
        self.geom_labl(&mut |g:&mut LablGeometry| g.populate());
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.populate());
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
