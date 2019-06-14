use std::fmt::Debug;

use types::{ 
    CLeaf, AxisSense, Rect, Edge, RLeaf, area_size, cleaf, cpixel,
    Placement, XPosition, YPosition, Dot
};
use model::shape::{ 
    ColourSpec, ShapeSpec, Facade, FacadeType, ShapeInstanceDataType,
    ShapeShortInstanceData, TypeToShape, GenericShape, PatinaSpec,
    ZPosition, RectSpec, RectPosition, ZMenuRectSpec
};
    
impl GenericShape for BoxSpec {}

#[derive(Clone,Debug)]
pub struct BoxSpec {
    pub offset: RLeaf,
    pub width: i32,
    pub colspec: ColourSpec
}

pub struct StretchRectTypeSpec {
    pub spot: PatinaSpec,
    pub hollow: bool
}

impl StretchRectTypeSpec {
    fn new_colspec(&self, rd: &ShapeShortInstanceData) -> ColourSpec {
        if let Facade::Colour(c) = rd.facade {
            match self.spot {
                PatinaSpec::Spot => Some(ColourSpec::Spot(c)),
                PatinaSpec::Colour => Some(ColourSpec::Colour(c)),
                _ => None
            }
        } else { None }.unwrap()
    }
}

impl TypeToShape for StretchRectTypeSpec {
    fn new_short_shape(&self, rd: &ShapeShortInstanceData) -> Option<ShapeSpec> {
        let colspec = self.new_colspec(rd);
        let offset = area_size(cleaf(rd.pos_x,rd.pos_y),
                               cleaf(rd.aux_x,rd.aux_y));
        if rd.pos_x <= 1. && rd.pos_x+rd.aux_x >= 0. {
            if self.spot == PatinaSpec::ZMenu {
                Some(ShapeSpec::ZMenu(ZMenuRectSpec {
                    offset: RectPosition(Placement::Stretch(offset),ZPosition::Normal),
                    id: "this is a test".to_string()
                }))
            } else if self.hollow {
                Some(ShapeSpec::PinBox(BoxSpec {
                    offset,
                    width: 1,
                    colspec
                }))
            } else {
                Some(ShapeSpec::PinRect(RectSpec {
                    offset: RectPosition(Placement::Stretch(offset),ZPosition::Normal),
                    colspec
                }))
            }
        } else {
            None
        }
    }
    
    fn get_facade_type(&self) -> FacadeType { FacadeType::Colour }
    fn needs_scale(&self) -> (bool,bool) { (true,true) }
    fn sid_type(&self) -> ShapeInstanceDataType { ShapeInstanceDataType::Short }
}
