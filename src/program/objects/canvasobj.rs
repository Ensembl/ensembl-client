use std::collections::HashMap;
use stdweb::web::html_element::CanvasElement;
use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLTexture as gltex,
    GLint, GLenum,
};

use arena::ArenaData;
use program::data::DataBatch;
use program::objects::Object;

#[derive(Clone)]
pub enum CanvasWeave {
    Pixelate,
    Blur
}

impl CanvasWeave {
    fn apply(&self, ctx: &glctx) {
        let (minf,magf,wraps,wrapt) = match self {
            CanvasWeave::Pixelate =>
                (glctx::NEAREST,glctx::NEAREST,
                 glctx::CLAMP_TO_EDGE,glctx::CLAMP_TO_EDGE),
            CanvasWeave::Blur =>
                (glctx::LINEAR,glctx::LINEAR,
                 glctx::CLAMP_TO_EDGE,glctx::CLAMP_TO_EDGE)
        };
        ctx.tex_parameteri(glctx::TEXTURE_2D,
                           glctx::TEXTURE_MIN_FILTER,
                           minf as i32);
        ctx.tex_parameteri(glctx::TEXTURE_2D,
                           glctx::TEXTURE_MAG_FILTER,
                           magf as i32);
        ctx.tex_parameteri(glctx::TEXTURE_2D,
                           glctx::TEXTURE_WRAP_S,
                           wraps as i32);
        ctx.tex_parameteri(glctx::TEXTURE_2D,
                           glctx::TEXTURE_WRAP_T,
                           wrapt as i32);
    }
}

fn fix_tex_image2_d_cnv(ctx: &glctx, 
                    target: GLenum, level: GLint, internalformat: GLint,
                    format: GLenum, type_: GLenum, canvas: &CanvasElement) {
    js! {
        @{ctx.as_ref()}.texImage2D(@{target}, @{level}, @{internalformat}, 
                           @{format}, @{type_}, @{canvas});
    };
}

fn canvas_texture(ctx: &glctx,cnv : &CanvasElement) -> gltex {
    let texture = ctx.create_texture().unwrap();
    ctx.bind_texture(glctx::TEXTURE_2D, Some(&texture));
    fix_tex_image2_d_cnv(&ctx,
        glctx::TEXTURE_2D,0,glctx::RGBA as i32,
        glctx::RGBA,glctx::UNSIGNED_BYTE,cnv);
    CanvasWeave::Pixelate.apply(ctx);
    texture    
}

/* ObjectCanvasTexture = Object for canvas-origin textures */
pub struct ObjectCanvasTexture {
    textures: HashMap<u32,gltex>,
}

impl ObjectCanvasTexture {
    pub fn new() -> ObjectCanvasTexture {
        ObjectCanvasTexture {
            textures: HashMap::<u32,gltex>::new()
        }
    }
}

impl Object for ObjectCanvasTexture {
    fn obj_final(&mut self, _batch: &DataBatch, adata: &ArenaData) {
        // TODO: make into iterator
        let mut i = 0;
        loop {
            let c = adata.get_canvas(i);
            if let Some(c) = c {
                self.textures.insert(
                    c.index() as u32,
                    canvas_texture(&adata.ctx,c.canvas().element())
                );
                i += 1;
            } else {
                break;
            }
        }
    }

    fn execute(&self, adata : &ArenaData, _batch: &DataBatch) {
        for (i,t) in self.textures.iter() {
            adata.ctx.active_texture(glctx::TEXTURE0+*i);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&t));
        }
    }    
}
