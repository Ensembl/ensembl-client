use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use shape::shapeimpl::ShapeContext;
use program::UniformValue;
use types::Colour;

pub struct SpotImpl {
    group: HashMap<ProgramType,HashMap<Colour,DataGroup>>
}

#[derive(Clone)]
pub struct Spot(pub Rc<RefCell<SpotImpl>>);

impl SpotImpl {
    pub fn new() -> SpotImpl {
        SpotImpl {
            group: HashMap::<ProgramType,HashMap<Colour,DataGroup>>::new(),
        }
    }

    pub fn get_group(&mut self, name: ProgramType, geom: &mut ProgramAttribs, colour: &Colour) -> DataGroup {
        let m = self.group.entry(name).or_insert_with(||
            HashMap::<Colour,DataGroup>::new()
        );
        *m.entry(*colour).or_insert_with(|| {
            geom.new_group()
        })
    }
}

impl ShapeContext for SpotImpl {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, _ctx: &glctx) {
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

impl Spot {
    pub fn new() -> Spot {
        Spot(Rc::new(RefCell::new(SpotImpl::new())))
    }

    pub fn get_group(&self, name: ProgramType, prog: &mut ProgramAttribs, colour: &Colour) -> DataGroup {
        self.0.borrow_mut().get_group(name,prog,colour)
    }
}

impl ShapeContext for Spot {
    fn reset(&mut self) {
        self.0.borrow_mut().reset();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, ctx: &glctx) {
        self.0.borrow_mut().into_objects(geom_name,geom,ctx);
    }
}
