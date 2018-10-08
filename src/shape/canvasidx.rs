use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use types::{ Colour };
use composit::{ Compositor, DrawingSession };
use drawing::{ Artist, Artwork };
use shape::shapeimpl::ShapeContext;
use program::UniformValue;

pub struct CanvasIdxImpl {
    index: usize,
    group: HashMap<ProgramType,DataGroup>
}

// XXX merge with spot
#[derive(Clone)]
pub struct CanvasIdx(Rc<RefCell<CanvasIdxImpl>>);

impl CanvasIdxImpl {
    pub fn new(index: usize) -> CanvasIdxImpl {
        CanvasIdxImpl {
            group: HashMap::<ProgramType,DataGroup>::new(),
            index
        }
    }

    pub fn get_group(&self, name: ProgramType) -> DataGroup {
        self.group[&name]
    }
}

impl ShapeContext for CanvasIdxImpl {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, _ctx: &glctx) {
        if geom_name.2 == PTSkin::Texture {
            let group = geom.new_group();
            self.group.insert(*geom_name,group);
            if let Some(obj) = geom.get_object("uSampler") {
                obj.set_uniform(Some(group),UniformValue::Int(self.index as i32));
            }
        }
    }
}

impl CanvasIdx {
    pub fn new(ds: &mut DrawingSession, index: usize) -> CanvasIdx {
        let s = CanvasIdx(Rc::new(RefCell::new(CanvasIdxImpl::new(index))));
        ds.add_context(Box::new(s.clone()));
        s
    }

    pub fn get_group(&self, name: ProgramType) -> DataGroup {
        self.0.borrow().get_group(name)
    }
}

impl ShapeContext for CanvasIdx {
    fn reset(&mut self) {
        self.0.borrow_mut().reset();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, ctx: &glctx) {
        self.0.borrow_mut().into_objects(geom_name,geom,ctx);
    }
}
