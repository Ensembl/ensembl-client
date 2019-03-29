use composit::Source;
use drivers::webgl::{ FCFont, FontVariety };
use model::shape::{ PinRectTypeSpec, TextureTypeSpec };
use drivers::webgl::{ Facade, TypeToShape, ShapeInstanceData, ShapeShortInstanceData };
use types::{ Colour, cleaf, cpixel, area_size, AxisSense, A_TOPLEFT };

use super::DrawingSpec;

#[derive(Clone,Debug)]
pub struct TextArtist {
    pub chars: String,
    pub font: FCFont,
    pub colour: Colour,
    pub background: Colour
}

impl TextArtist {
    fn new(chars: &str, font: &FCFont, colour: &Colour, background: &Colour) -> TextArtist {
        TextArtist {
            chars: chars.to_string(),
            font: font.clone(),
            colour: colour.clone(),
            background: background.clone()
        }
    }
}

pub fn text_texture(chars: &str,font: &FCFont, col: &Colour, bg: &Colour) -> DrawingSpec {
    DrawingSpec::Text(TextArtist::new(chars,font,col,bg))
}
