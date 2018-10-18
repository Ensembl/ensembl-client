use composit::{ Compositor, ComponentRedo, Leaf, Stage };
use drawing::AllCanvasAllocator;
use print::LeafPrinter;

pub struct PrintRun {
    leaf: Leaf
}

impl PrintRun {
    pub fn new(leaf: &Leaf) -> PrintRun {
        PrintRun { leaf: leaf.clone() }
    }

    pub fn into_objects(&mut self,
                        cman: &mut Compositor,
                        lp: &mut LeafPrinter, aca: &mut AllCanvasAllocator,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        debug!("redraw","{:?}",level);
        if let Some(ref mut comps) = cman.get_components(&self.leaf) {
            lp.init();
            if level == ComponentRedo::Major {
                lp.redraw_drawings(aca,comps);
            }
            let mut e = lp.new_edition();
            lp.redraw_objects(comps,&mut e);
            lp.fini(&mut e);
        }
    }

    pub fn build_snap(&mut self, cman: &mut Compositor,
                stage: &Stage, lp: &mut LeafPrinter,
                aca: &mut AllCanvasAllocator,
                level: ComponentRedo) {
        self.into_objects(cman,lp,aca,level);
        lp.take_snap(stage);
    }
}
