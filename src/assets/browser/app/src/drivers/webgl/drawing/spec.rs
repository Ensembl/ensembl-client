use std::rc::Rc;

use super::{ TextArtist, BitmapArtist, CollageArtist, Artist };

#[derive(Clone)]
pub enum DrawingSpec {
    Text(TextArtist),
    Bitmap(BitmapArtist),
    Collage(CollageArtist)
}

impl DrawingSpec {
    pub fn to_artist(&self) -> Rc<Artist> {
        match self {
            DrawingSpec::Text(t) => Rc::new(t.clone()),
            DrawingSpec::Bitmap(b) => Rc::new(b.clone()),
            DrawingSpec::Collage(c) => Rc::new(c.clone())
        }
    }
}
