use types::Placement;
use model::shape::{ ColourSpec, GenericShape };

#[derive(Clone,Copy,Debug)]
pub enum ZPosition {
    Normal,
    UnderPage,
    UnderTape,
    UnderAll
}

#[derive(Clone,Copy,Debug)]
pub struct RectPosition(pub Placement,pub ZPosition);

#[derive(Clone,Debug)]
pub struct RectSpec {
    pub offset: RectPosition,
    pub colspec: ColourSpec
}

#[derive(Clone,Debug)]
pub struct ZMenuRectSpec {
    pub offset: RectPosition,
    pub id: String
}

impl GenericShape for RectSpec {}

impl GenericShape for ZMenuRectSpec {
    fn zmenu_box(&self) -> Option<(String,Placement)> {
        Some((self.id.to_string(),self.offset.0))
    }
}

#[derive(Clone,Debug,PartialEq)]
pub enum PatinaSpec {
    Colour,
    Spot,
    ZMenu
}
