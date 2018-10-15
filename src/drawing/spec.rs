use drawing::{ TextArtist, BitmapArtist, CollageArtist };

#[derive(Clone,Debug)]
pub enum DrawingSpec {
    Text(TextArtist),
    Bitmap(BitmapArtist),
    Collage(CollageArtist)
}
