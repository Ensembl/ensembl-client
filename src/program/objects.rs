use texture::TextureDrawRequestHandle;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
};

use wglraw;

use program::ProgramCode;

use arena::{
    Stage,
    ArenaData,
    ArenaDims,
};

use coord::{
    Input,
};

/* This is the meat of each Object implementation */
pub trait Object {
    fn add_f32(&mut self, _values: &[f32]) {}
    fn add_tdr(&mut self, _value: &TextureDrawRequestHandle) {}

    fn get_tdr(&self) -> Vec<TextureDrawRequestHandle> {
        Vec::<TextureDrawRequestHandle>::new()
    }

    fn add_data(&mut self, _values: &[&Input]) {}
    fn populate(&mut self, _adata: &ArenaData) {}
    fn link(&self, _adata : &ArenaData, 
            _pcode: &ProgramCode,
            _stage: &Stage, _dims: &ArenaDims) {}
}

pub struct ObjectStage {
}

impl ObjectStage {
    pub fn new() -> ObjectStage {
        ObjectStage {}
    }
}

impl Object for ObjectStage {    
    fn link(&self, adata : &ArenaData, pcode: &ProgramCode,
            stage: &Stage, dims: &ArenaDims) {
        let ctx = &adata.ctx;
        pcode.set_uniform_1f(ctx,"uStageHpos",stage.pos.0);
        pcode.set_uniform_1f(ctx,"uStageVpos",(stage.pos.1 + dims.height_px as f32)/2.);
        pcode.set_uniform_1f(ctx,"uStageZoom",stage.zoom);
        pcode.set_uniform_1f(ctx,"uAspect",dims.aspect);
        pcode.set_uniform_2f(ctx,"uSize",[
            dims.width_px as f32/2.,
            dims.height_px as f32/2.]);
    }
}

/* ObjectCanvasTexture = Object for canvas-origin textures */
pub struct ObjectCanvasTexture {
    name: String,
    texture: Option<gltex>,
}

impl ObjectCanvasTexture {
    pub fn new(name: &str) -> ObjectCanvasTexture {
        ObjectCanvasTexture {
            name: name.to_string(),
            texture: None
        }
    }
}

const TEXIDS : [u32;8] = [
    glctx::TEXTURE0, glctx::TEXTURE1, glctx::TEXTURE2,
    glctx::TEXTURE3, glctx::TEXTURE4, glctx::TEXTURE5,
    glctx::TEXTURE6, glctx::TEXTURE7
];

impl Object for ObjectCanvasTexture {
    fn populate(&mut self, adata: &ArenaData) {
        let canvases = &adata.canvases;
        self.texture = Some(wglraw::canvas_texture(&adata.ctx,canvases.flat.element()));
    }

    fn link(&self, adata : &ArenaData, pcode: &ProgramCode,
            _stage: &Stage, _dims: &ArenaDims) {
        let canvases = &adata.canvases;
        if let Some(ref texture) = self.texture {
            adata.ctx.active_texture(TEXIDS[canvases.idx as usize]);
            adata.ctx.bind_texture(glctx::TEXTURE_2D,Some(&texture));
            pcode.set_uniform_1i(&adata.ctx,&self.name,canvases.idx);
        }
    }

    fn add_data(&mut self, _values: &[&Input]) {}
}

pub struct ObjectAttrib {
    idx_vec : Vec<u16>,
    vec : Vec<f32>,
    buf: glbuf,
    idx_buf: glbuf,
    name: String,
    size: u8,
}

impl ObjectAttrib {
    pub fn new(adata: &ArenaData, name: &str, size: u8) -> ObjectAttrib {
        ObjectAttrib {
            idx_vec: Vec::<u16>::new(),
            vec: Vec::<f32>::new(),
            buf: wglraw::init_buffer(&adata.ctx),
            idx_buf: wglraw::init_buffer(&adata.ctx),
            name: name.to_string(),
            size
        }
    }
}

impl Object for ObjectAttrib {
    fn populate(&mut self, adata: &ArenaData) {
        wglraw::populate_buffer(&adata.ctx,glctx::ARRAY_BUFFER,
                                &self.buf,&self.vec);
        wglraw::populate_buffer_short(&adata.ctx,glctx::ELEMENT_ARRAY_BUFFER,
                                &self.idx_buf,&self.idx_vec);
        self.vec.clear();
    }

    fn link(&self, adata : &ArenaData, pcode: &ProgramCode, _stage: &Stage, _dims: &ArenaDims) {
        pcode.set_attribute(&adata.ctx,&self.name,&self.buf,
                            &self.idx_buf,self.size);
    }

    fn add_data(&mut self, values: &[&Input]) {
        for v in values {
            v.to_f32(self);
        }
    }

    fn add_f32(&mut self,values : &[f32]) {
        for i in 0..values.len() {
            self.idx_vec.push((self.vec.len()+i) as u16);
            let s = format!("{} {}\n",i,self.idx_vec[i]);
        }
        if self.vec.len() > 65536 {
            js! { console.log("too long!"); };
        }
        self.vec.extend_from_slice(values);
        let s = format!("{} {}\n",self.vec.len(),self.idx_vec.len());
    }
}
