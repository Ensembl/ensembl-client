use std::rc::Rc;
use std::cell::RefCell;
use std::collections::HashMap;
use arena::ArenaData;
use program::{ ProgramAttribs, DataGroup, ProgramType, PTSkin };
use types::{ Colour, RPixel };
use campaign::CampaignManager;
use drawing::Artist;

pub trait Shape {
    fn get_artist(&self) -> Option<Rc<Artist>> { None }
    fn into_objects(&self, geom_name: ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData, d: Option<RPixel>);
    fn get_geometry(&self) -> ProgramType;
}

pub trait ShapeContext {
    fn reset(&mut self);
    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData);
}

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

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, _adata: &ArenaData) {
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
    pub fn new(camps: &mut CampaignManager, colour: &Colour) -> Spot {
        let s = Spot(Rc::new(RefCell::new(SpotImpl::new(colour))));
        camps.add_context(Box::new(s.clone()));
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

    fn into_objects(&mut self, geom_name: &ProgramType, geom: &mut ProgramAttribs, adata: &ArenaData) {
        self.0.borrow_mut().into_objects(geom_name,geom,adata);
    }
}

#[derive(Clone)]
pub enum ColourSpec {
    Colour(Colour),
    Spot(Spot)
}

impl ColourSpec {
    pub fn to_group(&self, gn: ProgramType) -> Option<DataGroup> {
        match self {
            ColourSpec::Spot(s) => Some(s.get_group(gn)),
            ColourSpec::Colour(_) => None
        }
    }
}

#[derive(Clone,Copy)]
pub enum MathsShape {
    Polygon(u16,f32), // (points,offset/rev)
    Circle
}
