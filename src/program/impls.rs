use arena::ArenaData;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx
};

use program::{
    ProgramSource,
    Program,
    Statement,
    Uniform,
    Attribute,
    Varying,
    Canvas,
    Main,
    Precision,
    Arity,
};

#[derive(Clone,Copy,Debug,PartialEq,Eq,Hash)]
pub enum PTGeom { Pin, Stretch, Fix, Page }

#[derive(Clone,Copy,Debug,PartialEq,Eq,Hash)]
pub enum PTMethod { Triangle, Strip }

#[derive(Clone,Copy,Debug,PartialEq,Eq,Hash)]
pub enum PTSkin { Colour, Spot, Texture }

#[derive(Clone,Copy,Debug,PartialEq,Eq,Hash)]
pub struct ProgramType(pub PTGeom,pub PTMethod,pub PTSkin);

impl PTGeom {
    fn to_source(&self) -> ProgramSource {
        ProgramSource::new(match self {
            PTGeom::Stretch => vec! {
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageHpos"),
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageVpos"),
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageZoom"),
                Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
                Statement::new_vert("
                    gl_Position = vec4(
                        (aVertexPosition.x - uStageHpos/uSize.x) * uStageZoom,
                        - (aVertexPosition.y - uStageVpos) / uSize.y,
                        0.0, 1.0)")
            },
            PTGeom::Pin => vec! {
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageHpos"),
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageVpos"),
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageZoom"),
                Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aOrigin"),
                Statement::new_vert("
                    gl_Position = vec4(
                        (aOrigin.x -uStageHpos/uSize.x) * uStageZoom + 
                                    aVertexPosition.x / uSize.x,
                        - (aOrigin.y - uStageVpos + aVertexPosition.y) / uSize.y, 
                        0.0, 1.0)")

            },
            PTGeom::Fix => vec! {
                Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
                Statement::new_vert("
                    gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                                       1.0 - aVertexPosition.y / uSize.y,
                                       0.0, 1.0)")
            },
            PTGeom::Page => vec! {
                Uniform::new_vert(&PR_DEF,Arity::Vec2,"uSize"),
                Uniform::new_vert(&PR_DEF,Arity::Scalar,"uStageVpos"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aVertexPosition"),
                Statement::new_vert("
                    gl_Position = vec4(aVertexPosition.x / uSize.x - 1.0,
                                       - (aVertexPosition.y - uStageVpos) / uSize.y, 
                                       0.0, 1.0)")
            }
        })
    }
}

impl PTMethod {
    fn to_source(&self) -> ProgramSource {
        ProgramSource::new(match self {
            PTMethod::Triangle => vec! { Main::new(glctx::TRIANGLES) },
            PTMethod::Strip => vec! { Main::new(glctx::TRIANGLE_STRIP) }
        })
    }
}

impl PTSkin {
    fn to_source(&self) -> ProgramSource {
        ProgramSource::new(match self {
            PTSkin::Colour => vec! {
                Attribute::new(&PR_LOW,Arity::Vec3,"aVertexColour"),
                Varying::new(&PR_LOW,Arity::Vec3,"vColour"),
                Statement::new_vert("vColour = vec3(aVertexColour)"),
                Statement::new_frag("gl_FragColor = vec4(vColour, 1.0)"),
            },
            PTSkin::Spot => vec! {
                Uniform::new_frag(&PR_LOW,Arity::Vec3,"uColour"),
                Statement::new_frag("gl_FragColor = vec4(uColour, 1.0)"),
            },
            PTSkin::Texture => vec! {
                Canvas::new(),
                Uniform::new_frag(&PR_DEF,Arity::Sampler2D,"uSampler"),
                Attribute::new(&PR_DEF,Arity::Vec2,"aTextureCoord"),
                Varying::new(&PR_DEF,Arity::Vec2,"vTextureCoord"),
                Statement::new_vert("vTextureCoord = aTextureCoord"),
                Statement::new_frag("gl_FragColor = texture2D(uSampler, vTextureCoord)"),
            }
        })
    }
}

const GEOM_ORDER : [PTGeom;4] = [
    PTGeom::Stretch, PTGeom::Pin, PTGeom::Page, PTGeom::Fix
];

const SKINMETH_ORDER : [(PTSkin,PTMethod);5] = [
    (PTSkin::Spot,    PTMethod::Strip),
    (PTSkin::Colour,  PTMethod::Strip),
    (PTSkin::Spot,    PTMethod::Triangle),
    (PTSkin::Colour,  PTMethod::Triangle),
    (PTSkin::Texture, PTMethod::Triangle),
];

impl ProgramType {
    pub fn to_program(&self, adata: &ArenaData) -> Program {
        let src = self.0.to_source().merge(&self.1.to_source()).merge(&self.2.to_source());
        Program::new(adata,&src)
    }
    
    pub fn all() -> Vec<ProgramType> {
        let mut out = Vec::<ProgramType>::new();
        for gt in GEOM_ORDER.iter() {
            for (st,mt) in SKINMETH_ORDER.iter() {
                out.push(ProgramType(*gt,*mt,*st));
            }
        }
        out
    }
}

pub static PR_DEF : Precision = Precision::Float(25,16);
pub static PR_LOW : Precision = Precision::Float(5,8);
