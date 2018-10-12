use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use shape::shapeimpl::ShapeContext;
use program::UniformValue;

pub struct CanvasIdxImpl {
    pub index: u32,
    group: HashMap<ProgramType,DataGroup>
}

// XXX merge with spot
#[derive(Clone)]
pub struct CanvasIdx(pub Rc<RefCell<CanvasIdxImpl>>);

impl CanvasIdxImpl {
    pub fn new(index: u32) -> CanvasIdxImpl {
        CanvasIdxImpl {
            group: HashMap::<ProgramType,DataGroup>::new(),
            index
        }
    }

    pub fn get_group(&mut self, name: ProgramType, geom: &mut ProgramAttribs) -> DataGroup {
        self.group.entry(name).or_insert_with(|| {
            geom.new_group()
        }).clone()
    }
}

impl ShapeContext for CanvasIdxImpl {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, _ctx: &glctx) {
        if geom_name.2 == PTSkin::Texture {
            if let Some(obj) = geom.get_object("uSampler") {
                if let Some(group) = self.group.get(geom_name) {
                    obj.set_uniform(Some(*group),UniformValue::Int(self.index as i32));
                }
            }
        }
    }
}

impl CanvasIdx {
    pub fn new(index: u32) -> CanvasIdx {
        CanvasIdx(Rc::new(RefCell::new(CanvasIdxImpl::new(index))))
    }

    pub fn get_index(&self) -> u32 { self.0.borrow().index }

    pub fn get_group(&self, name: ProgramType, prog: &mut ProgramAttribs) -> DataGroup {
        self.0.borrow_mut().get_group(name,prog)
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

