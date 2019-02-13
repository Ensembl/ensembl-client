use std::rc::Rc;

use stdweb::web::window;
use stdweb::web::IWindowOrWorker;

use composit::{ Leaf, Source, SourceResponse };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use tácode::{ Tácode, TáTask };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

pub struct TáSourceImpl {
    tc: Tácode
}

#[derive(Clone)]
pub struct TáSource(Rc<TáSourceImpl>);

impl TáSource {
    pub fn new(tc: &Tácode) -> TáSource {
        TáSource(Rc::new(TáSourceImpl{
            tc: tc.clone()
        }))
    }
}

const src: &str = r#"
    const #1, [10000,17000,20000,30000]
    const #2, [4000,1000]
    const #3, [1]
    const #4, [400]
    const #5, [255,120,0,120,255,0]
    strect #1, #2, #3, #4, #5
"#;

impl Source for TáSource {
    fn populate(&self, lc: &mut SourceResponse, leaf: &Leaf) {
        let b = self.0.tc.assemble(&src);
        let pid = self.0.tc.run(&b.ok().unwrap()).ok().unwrap();
        self.0.tc.context().set_task(pid,TáTask::MakeShapes(leaf.clone(),lc.clone()));
        self.0.tc.start(pid);
        lc.done(200);
    }
}
