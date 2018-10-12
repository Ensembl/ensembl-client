use webgl_rendering_context::WebGLRenderingContext as glctx;

use composit::{ StateManager, Compositor, Component };
use drawing::AllCanvasMan;
use stage::Stage;
use print::{ Programs, Printer };
use composit::ComponentRedo;

pub struct PrintRun {
}

impl PrintRun {
    pub fn new() -> PrintRun {
        PrintRun {}
    }

    pub fn into_objects(&mut self,
                        cman: &mut Compositor,
                        p: &mut Printer,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        let mut comps = cman.components();
        debug!("redraw","{:?}",level);
        p.clear_objects();
        p.apply_contexts();
        if level == ComponentRedo::Major {
            p.redraw_drawings(&mut comps);
        }
        p.redraw_objects(&mut comps);
        p.finalize_objects();
    }

    pub fn go(&mut self, cman: &mut Compositor,
                stage: &Stage, p: &mut Printer, level: ComponentRedo) {
        self.into_objects(cman,p,level);
        p.go(stage);
    }
}
