mod text;
mod bitmap;
mod textureimpl;

pub use texture::textureimpl::{
    /* Different KINDS OF THING to be drawn */
    TextureDrawRequestHandle,
    TextureSourceManager,
    
    /* Different INSTANCES OF THINGS To be drawn */
    TexPosItem,
    TextureTargetManager,
    TexPart,
};

pub use texture::text::text_texture;
pub use texture::bitmap::bitmap_texture;
