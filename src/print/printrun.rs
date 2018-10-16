use composit::{ Compositor, ComponentRedo, Leaf };
use print::Printer;
use stage::Stage;

pub struct PrintRun {
}

impl PrintRun {
    pub fn new() -> PrintRun {
        PrintRun {}
    }

    pub fn into_objects(&mut self,
                        cman: &mut Compositor,
                        p: &mut Printer,
                        leaf: &Leaf,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        debug!("redraw","{:?}",level);
        if let Some(ref mut comps) = cman.get_components(leaf) {
            p.init();
            if level == ComponentRedo::Major {
                p.redraw_drawings(comps);
            }
            let mut e = p.new_edition();
            p.redraw_objects(comps,&mut e);
            p.fini(&mut e);
        }
    }

    pub fn go(&mut self, cman: &mut Compositor,
                stage: &Stage, p: &mut Printer, 
                leaf: &Leaf, level: ComponentRedo) {
        self.into_objects(cman,p,leaf,level);
        p.go(stage);
    }
}
