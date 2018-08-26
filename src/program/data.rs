use arena::ArenaData;
use wglraw;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLBuffer as glbuf,
};

pub struct DataBatch {
    idx_buf: glbuf,
    idx_vec: Vec<u16>,
    num_points: u16,
    id_val: u32,
}

impl DataBatch {
    pub fn new(adata: &ArenaData, id: u32) -> DataBatch {
        DataBatch {
            num_points: 0,
            idx_buf: wglraw::init_buffer(&adata.ctx),
            idx_vec: Vec::<u16>::new(),
            id_val: id
        }
    }

    pub fn draw_triangles(&self, adata: &ArenaData) {
        if self.idx_vec.len() > 0 {
            wglraw::populate_buffer_short(&adata.ctx,glctx::ELEMENT_ARRAY_BUFFER,
                                    &self.idx_buf,&self.idx_vec);
            adata.ctx.bind_buffer(glctx::ELEMENT_ARRAY_BUFFER,Some(&self.idx_buf));
            adata.ctx.draw_elements(glctx::TRIANGLES,self.idx_vec.len() as i32,
                                    glctx::UNSIGNED_SHORT,0);
        }
    }

    pub fn add_vertices(&mut self, indexes: &[u16], points: u16) {
        for v in indexes {
            self.idx_vec.push(self.num_points+*v);
        }
        self.num_points += points;
    }
    
    pub fn id(&self) -> u32 { self.id_val }
}

