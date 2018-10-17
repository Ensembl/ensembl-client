use composit::{ Compositor, ComponentRedo, Leaf };
use print::Printer;
use stage::Stage;

pub struct PrintRun {
    leaf: Leaf
}

impl PrintRun {
    pub fn new(leaf: &Leaf) -> PrintRun {
        PrintRun { leaf: leaf.clone() }
    }

    pub fn into_objects(&mut self,
                        cman: &mut Compositor,
                        p: &mut Printer,
                        level: ComponentRedo) {
        if level == ComponentRedo::None { return; }
        debug!("redraw","{:?}",level);
        if let Some(ref mut comps) = cman.get_components(&self.leaf) {
            p.init();
            if level == ComponentRedo::Major {
                p.redraw_drawings(&self.leaf,comps);
            }
            let mut e = p.new_edition(&self.leaf);
            p.redraw_objects(comps,&self.leaf,&mut e);
            p.fini(&mut e,&self.leaf);
        }
    }

    pub fn go(&mut self, cman: &mut Compositor,
                stage: &Stage, p: &mut Printer, 
                level: ComponentRedo) {
        self.into_objects(cman,p,level);
        p.go(stage);
    }
}
