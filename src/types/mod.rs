mod coord;
mod colour;
mod todo;
mod area;

pub use types::coord::{
    CPixel, CLeaf, CFraction, APixel,
    cpixel, cleaf, cfraction, cedge,
    Edge, EPixel, Corner,
    Dot, Move, Distance, Units, Axis, AxisSense,
    LEFT, RIGHT, UP, DOWN,
    TOPLEFT, BOTTOMLEFT, TOPRIGHT, BOTTOMRIGHT,
    
    A_TOPLEFT,    A_TOP,    A_TOPRIGHT,
    A_LEFT,       A_MIDDLE, A_RIGHT,
    A_BOTTOMLEFT, A_BOTTOM, A_BOTTOMRIGHT
};

pub use types::area::{
    RLeaf,
    RFraction,
    RPixel,
    area, Rect, area_size,
    Bounds,
};

pub use types::colour::{
    Colour
};

pub use types::todo::Todo;
