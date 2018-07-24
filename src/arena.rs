use std::cell::Ref;
use std::cell::RefCell;
use std::rc::Rc;

use canvasutil;
use wglraw;
use hosc::HoscGeometry;
use hofi::HofiGeometry;
use fixx::FixxGeometry;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

struct ArenaGeometries {
    hosc: HoscGeometry,
    hofi: HofiGeometry,
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

    pub fn populate(&mut self) {
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.populate());
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.populate());
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.populate());
    }

    pub fn animate(&mut self, stage: &Stage) {
        // prepare arena
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        //    ctx.clear_color(1.0,1.0,1.0,1.0);
        //    ctx.clear_depth(1.0);
        }
        // draw each geometry
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.perspective(&stage));
        self.geom_hosc(&mut |g:&mut HoscGeometry| g.draw());
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.perspective(&stage));
        self.geom_hofi(&mut |g:&mut HofiGeometry| g.draw());
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.perspective(&stage));
        self.geom_fixx(&mut |g:&mut FixxGeometry| g.draw());
    }
}

pub trait Geometry {
    fn adata(&self) -> Ref<ArenaData>;
    fn program<'a>(&'a self) -> &'a glprog;

    fn populate(&mut self);
    fn draw(&self);

    fn perspective(&self,stage:&Stage) {
        let data = &self.adata();
        let ctx = &data.ctx;
        let aspect = data.aspect;
        let prog = self.program();
        ctx.use_program(Some(&prog));
        wglraw::set_uniform_1(&ctx,&prog,"uStageHpos",stage.hpos);
        wglraw::set_uniform_1(&ctx,&prog,"uStageVpos",stage.vpos);
        wglraw::set_uniform_1(&ctx,&prog,"uStageZoom",stage.zoom);
        wglraw::set_uniform_2(&ctx,&prog,"uCursor",stage.cursor);
        wglraw::set_uniform_1(&ctx,&prog,"uAspect",aspect);
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

