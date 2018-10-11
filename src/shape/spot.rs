use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;

use webgl_rendering_context::WebGLRenderingContext as glctx;

use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use types::{ Colour };
use print::Printer;
use shape::shapeimpl::ShapeContext;

pub struct SpotImpl {
    colour: Colour,
    group: HashMap<ProgramType,DataGroup>
}

#[derive(Clone)]
pub struct Spot(Rc<RefCell<SpotImpl>>);

impl SpotImpl {
    pub fn new(colour: &Colour) -> SpotImpl {
        SpotImpl {
            group: HashMap::<ProgramType,DataGroup>::new(),
            colour: *colour
        }
    }

    pub fn get_group(&self, name: ProgramType) -> DataGroup {
        self.group[&name]
    }
}

impl ShapeContext for SpotImpl {
    fn reset(&mut self) {
        self.group.clear();
    }

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, _ctx: &glctx) {
        if geom_name.2 == PTSkin::Spot {
            let group = geom.new_group();
            self.group.insert(*geom_name,group);
            if let Some(obj) = geom.get_object("uColour") {
                obj.set_uniform(Some(group),self.colour.to_uniform());
            }
        }
    }    
}

impl Spot {
    pub fn new(p: &mut Printer, colour: &Colour) -> Spot {
        let s = Spot(Rc::new(RefCell::new(SpotImpl::new(colour))));
        p.add_context(Box::new(s.clone()));
        s
    }

    pub fn get_group(&self, name: ProgramType) -> DataGroup {
        self.0.borrow().get_group(name)
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
