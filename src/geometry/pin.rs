use geometry::{
    Geometry,
    GLProgram,
    GType,
};

use geometry::wglprog::{
    GLSource,
    Statement,
    shader_solid,
    Uniform,
    Attribute,
};

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

use geometry;
use geometry::wglprog;
use geometry::{
    Colour,
    GCoord,
    PCoord
};

use arena::{
    ArenaData,
    ArenaDims,
    Stage
};

pub struct PinGeometry {
    std: GLProgram,
}

impl Geometry for PinGeometry {
    fn populate(&mut self, adata: &mut ArenaData) {
        self.std.populate(adata);
    }
    
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.std.draw(adata,stage); }
}

impl PinGeometry {
    pub fn new(adata: &ArenaData) -> PinGeometry {
        let source = shader_solid(&GLSource::new(vec! {
            Uniform::new_vertex("float","uStageHpos"),
            Uniform::new_vertex("float","uStageVpos"),
            Uniform::new_vertex("float","uStageZoom"),
            Uniform::new_vertex("vec2","uSize"),
            Attribute::new(2,"aVertexPosition"),
            Attribute::new(2,"aOrigin"),
            Statement::new_vertex("
                gl_Position = vec4(
                    (aOrigin.x - uStageHpos) * uStageZoom + 
                                aVertexPosition.x / uSize.x,
                    (aOrigin.y - uStageVpos) / uSize.y + 
                                aVertexPosition.y / uSize.y,
                    0.0, 1.0)")
        }));
        PinGeometry {
            std: GLProgram::new(adata,&source),
        }
    }
    
    pub fn triangle(&mut self, origin: &GCoord, p: &[PCoord;3], colour: &Colour) {
        self.std.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        self.std.add_attrib_data("aOrigin",&[origin,origin,origin]);
        self.std.add_attrib_data("aVertexColour",&[colour,colour,colour]);
        self.std.advance(3);
    }
}

