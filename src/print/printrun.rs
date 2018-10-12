use webgl_rendering_context::WebGLRenderingContext as glctx;

use composit::{ StateManager, Compositor, Component };
use stage::Stage;
use print::{ Printer, PrintEdition };
use composit::ComponentRedo;
use shape::Spot;

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
        let mut e = PrintEdition::new();
        p.init();
        if level == ComponentRedo::Major {
            p.redraw_drawings(&mut comps);
        }
        p.redraw_objects(&mut comps,&mut e);
        p.fini(&mut e);
    }

    pub fn go(&mut self, cman: &mut Compositor,
                stage: &Stage, p: &mut Printer, level: ComponentRedo) {
        self.into_objects(cman,p,level);
        p.go(stage);
    }
}
