use std::rc::Rc;
use super::{ DrawingHash, DrawingSpec };

use types::CPixel;

#[derive(Clone,Debug)]
pub struct BitmapArtist {
    pub data: Rc<Vec<u8>>,
    pub size: CPixel,
    pub blur: bool,
    pub hash: Option<DrawingHash>
}

impl BitmapArtist {
    fn new(data: Vec<u8>, size: CPixel, blur: bool, hash: Option<DrawingHash>) -> BitmapArtist {
        BitmapArtist { data: Rc::new(data), size, blur, hash }
    }
}

pub fn bitmap_texture(data: Vec<u8>, size: CPixel, blur: bool, hash: Option<DrawingHash>) -> DrawingSpec {
    DrawingSpec::Bitmap(BitmapArtist::new(data,size,blur,hash))
}
