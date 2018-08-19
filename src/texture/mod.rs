/* A set of modules for drawing onto a 2d-canvas to be used as a 
 * texture in a geometry for text, images, heatmaps, etc.
 *
 * The low-level drawing procedures are elsewhere, this module handles
 * the allocation of space in a texture, the drawing, mapping, etc,
 * making sure the WebGL attributes are updated at the right time, etc,
 * while keeping textures generically independent of the geometry
 * used.
 */

pub mod text;
pub mod bitmap;
mod textureimpl;

pub use texture::textureimpl::{
    /* *** Different KINDS OF THING to be drawn *** */
    
    /* A single request to draw a kind of thing in the backing canvas */
    TextureDrawRequestHandle,
    /* One per canvas, usually in arena, to manage that canvas */
    TextureSourceManager,
    
    /* *** Different INSTANCES OF THINGS To be drawn *** */
    
    /* A single request to place an instance of a thing on the arena */
    TexPosItem,
    
    /* One per geometry, to  manage placement requests */
    TextureTargetManager,

    /* A rectangle in the canvas */
    TexPart,
};
