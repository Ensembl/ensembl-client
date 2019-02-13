use composit::Source;
use debug::testcards::common::prop;
use debug::testcards::closuresource::{ ClosureSource, closure_add, closure_done };
use drawing::{ FCFont, FontVariety, text_texture };
use shape::{ ColourSpec, tape_rectangle, tape_texture, stretch_rectangle };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };
use tácode::{ Tácode, TáSource };

pub fn tá_source(tc: &Tácode) -> impl Source {
    TáSource::new(tc)
}
