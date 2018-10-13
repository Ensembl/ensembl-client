use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin, CanvasWeave };
use shape::shapeimpl::ShapeContext;
use program::UniformValue;
use types::Colour;

pub struct CanvasIdx2 {
    group: HashMap<ProgramType,HashMap<CanvasWeave,DataGroup>>,
    glindexes: HashMap<CanvasWeave,u32>
}

impl CanvasIdx2 {
    pub fn new(glindexes: HashMap<CanvasWeave,u32>) -> CanvasIdx2 {
        CanvasIdx2 {
            group: HashMap::<ProgramType,HashMap<CanvasWeave,DataGroup>>::new(),
            glindexes
        }
    }

    pub fn get_group(&mut self, name: ProgramType, geom: &mut ProgramAttribs, weave: &CanvasWeave) -> DataGroup {
        *self.group.entry(name).or_insert_with(||
            HashMap::<CanvasWeave,DataGroup>::new()
        ).entry(*weave).or_insert_with(|| {
            geom.new_group()
        })
    }
}

impl ShapeContext for CanvasIdx2 {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs) {
        if geom_name.2 == PTSkin::Texture {
            if let Some(obj) = geom.get_object("uSampler") {
                if let Some(m) = self.group.get(geom_name) {
                    for (w,g) in m {
                        let idx = self.glindexes[w] as i32;
                        obj.set_uniform(Some(*g),UniformValue::Int(idx));
                    }
                }
            }
        }
    }
}
