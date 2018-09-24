use std::collections::HashMap;
use std::cell::RefCell;
use std::rc::Rc;

use dom::prepare_canvas;

use stdweb::web::Element;
use webgl_rendering_context::WebGLRenderingContext as glctx;

use drawing::FlatCanvas;
use wglraw;
use stage::Stage;
use program::{ Program, GPUSpec, ProgramType };
use composit::{ StateManager, Compositor };

pub struct ArenaCanvases {
    pub flat: Rc<FlatCanvas>,
    pub idx: i32,
}

#[allow(dead_code)]
pub struct ArenaData {
    pub canvases: ArenaCanvases,
    pub ctx: glctx,
}

pub struct ArenaPrograms {
    order: Vec<ProgramType>,
    pub map: HashMap<ProgramType,Program>,
}

impl ArenaPrograms {
    pub fn clear_objects(&mut self) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.clear();
        }        
    }

    pub fn finalize_objects(&mut self, adata: &mut ArenaData) {
        for k in &self.order {
            let geom = self.map.get_mut(k).unwrap();
            geom.data.objects_final(adata);
        }
    }
}

pub struct Arena {
    pub data: Rc<RefCell<ArenaData>>,
    pub progs: ArenaPrograms,
}

fn build_programs(ctx: &glctx) -> ArenaPrograms {
    let mut gpuspec = GPUSpec::new();
    gpuspec.populate(&ctx);
    let order = ProgramType::all();
    let mut map = HashMap::<ProgramType,Program>::new();
    for pt in &order {
        debug!("webgl programs","=== {:?} ===",&pt);
        map.insert(*pt,pt.to_program(&gpuspec,&ctx));
    }
    ArenaPrograms { order, map }
}

impl Arena {
    pub fn new(el: &Element) -> Arena {
        let canvas = prepare_canvas(el);
        let ctx = wglraw::prepare_context(&canvas);
        let flat = Rc::new(FlatCanvas::create(2,2));
        let progs = build_programs(&ctx);
        let data = Rc::new(RefCell::new(ArenaData {
            ctx,
            canvases: ArenaCanvases {
                flat,
                idx: 0,
            },
        }));
        let arena = Arena {
            progs, data
        };
        arena
    }

    pub fn draw(&mut self, cman: &mut Compositor, oom: &StateManager, stage: &Stage) {
        /* maybe update scene */
        {
            let (datam,progs) = (
                &mut self.data.borrow_mut(),
                &mut self.progs);
            cman.into_objects(progs,datam,oom);
        }
        /* prepare arena */
        {
            let ctx = &self.data.borrow().ctx;
            ctx.enable(glctx::DEPTH_TEST);
            ctx.depth_func(glctx::LEQUAL);
        }
        /* draw each geometry */
        let datam = &mut self.data.borrow_mut();
        for k in &self.progs.order {
            let geom = self.progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms(&datam.canvases);
            for (key, value) in &u {
                if let Some(obj) = geom.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            geom.draw(datam);
        }
    }
}
