use webgl_rendering_context::WebGLRenderingContext as glctx;

use composit::{ StateManager, Compositor };
use drawing::{ FlatCanvas, AllCanvasMan };
use stage::Stage;
use print::Programs;

pub struct PrintRun {
}

impl PrintRun {
    pub fn new() -> PrintRun {
        PrintRun {}
    }

    pub fn go(&mut self, cman: &mut Compositor, oom: &StateManager,
                stage: &Stage, progs: &mut Programs, ctx: &glctx,
                acm: &mut AllCanvasMan) {
        cman.into_objects(progs,&ctx,acm,oom);
        ctx.enable(glctx::DEPTH_TEST);
        ctx.depth_func(glctx::LEQUAL);
        for k in &progs.order {
            let geom = progs.map.get_mut(k).unwrap();
            let u = stage.get_uniforms();
            for (key, value) in &u {
                if let Some(obj) = geom.get_object(key) {
                    obj.set_uniform(None,*value);
                }
            }
            geom.draw(&ctx);
        }
    }
}
