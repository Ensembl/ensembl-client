mod coord;
mod colour;
mod area;
mod corners;
mod misctypes;

pub use crate::types::corners::{
    Anchors, Axis, AxisSense, Anchored, Corner, Edge, Anchor,
    cedge, Direction,

    LEFT, RIGHT, UP, DOWN, IN, OUT,
    TOPLEFT, BOTTOMLEFT, TOPRIGHT, BOTTOMRIGHT,
    
    A_TOPLEFT,    A_TOP,    A_TOPRIGHT,
    A_LEFT,       A_MIDDLE, A_RIGHT,
    A_BOTTOMLEFT, A_BOTTOM, A_BOTTOMRIGHT
};

pub use crate::types::coord::{
    CPixel, CLeaf, CFraction, APixel, CDFraction,
    cpixel, cleaf, cfraction, cdfraction, ddiv,
    EPixel, Dot, Move, Distance, Units,
};

pub use crate::types::area::{
    RLeaf,
    RFraction,
    RPixel,
    area, Rect, area_size, area_centred,
    Bounds, Placement, XPosition, YPosition
};

pub use crate::types::colour::{
    Colour
};

pub use crate::types::misctypes::{ AsyncValue, Awaiting };