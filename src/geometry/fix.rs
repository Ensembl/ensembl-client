use geometry::{
    Geometry,
    GLProgram,
    GType,
    PCoord,
    Colour,
};

use geometry::wglprog::{
    GLSource,
    Statement,
    shader_solid,
    Uniform,
    Attribute,
};

use geometry;
use geometry::wglprog;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

use arena::{
    ArenaData,
    ArenaDims,
    Stage
};

pub struct FixGeometry {
    std : GLProgram,
}

impl Geometry for FixGeometry {
    fn populate(&mut self, adata: &mut ArenaData) { self.std.populate(adata); }
    fn draw(&mut self, adata: &mut ArenaData, stage:&Stage) { self.std.draw(adata,stage); }
}

impl FixGeometry {
    pub fn new(adata: &ArenaData) -> FixGeometry {
        let source = shader_solid(&GLSource::new(vec! {
            Uniform::new_vertex("vec2","uSize"),
            Attribute::new(2,"aVertexPosition"),
            Statement::new_vertex("
                gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                                   aVertexPosition.y / uSize.y - 1.0,
                                   0.0, 1.0)")
        }));
        FixGeometry {
            std: GLProgram::new(adata,&source),
        }
    }

    pub fn triangle(&mut self,p: &[PCoord;3], colour: &Colour) {
        self.std.add_attrib_data("aVertexPosition",&[&p[0], &p[1], &p[2]]);
        self.std.add_attrib_data("aVertexColour",&[colour,colour,colour]);
        self.std.advance(3);
    }
    
    pub fn rectangle(&mut self,p:&[PCoord;2],colour:&Colour) {
        let mix = &p[0].mix(p[1]);
        self.triangle(&[p[0], mix.1, mix.0],colour);
        self.triangle(&[p[1], mix.0, mix.1],colour);
    }
}
