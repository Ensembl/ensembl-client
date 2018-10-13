use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use shape::shapeimpl::ShapeContext;
use program::UniformValue;
use types::Colour;

pub struct Spot {
    group: HashMap<ProgramType,HashMap<Colour,DataGroup>>
}

impl Spot {
    pub fn new() -> Spot {
        Spot {
            group: HashMap::<ProgramType,HashMap<Colour,DataGroup>>::new(),
        }
    }

    pub fn get_group(&mut self, name: ProgramType, geom: &mut ProgramAttribs, colour: &Colour) -> DataGroup {
        *self.group.entry(name).or_insert_with(||
            HashMap::<Colour,DataGroup>::new()
        ).entry(*colour).or_insert_with(|| {
            geom.new_group()
        })
    }
}

impl ShapeContext for Spot {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs) {
        if geom_name.2 == PTSkin::Spot {
            if let Some(obj) = geom.get_object("uColour") {
                if let Some(m) = self.group.get(geom_name) {
                    for (c,g) in m {
                        obj.set_uniform(Some(*g),c.to_uniform());
                    }
                }
            }
        }
    }
}
