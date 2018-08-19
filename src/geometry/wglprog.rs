use std::collections::HashMap;
use std::rc::Rc;

use arena::ArenaData;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

use geometry::gtype::{
    GType,
    GTypeAttrib,
    GTypeCanvasTexture,
    GTypeStage,
    GLiveProgram,
};

#[derive(PartialEq,Clone,Eq)]
pub enum Phase {
    PrePopulate,
    Vertex,
    Fragment,
}

pub trait Variable {
    fn declare(&self, _phase: &Phase) -> String { String::new() }
    fn preget(&self, _ctx: &glctx, _prog: &glprog,
              _udata: &mut HashMap<String,gluni>) {}
    fn make_attribs(&self, _adata: &ArenaData) 
                            -> Option<(Option<&str>,Phase,Box<GType>)> {
        None
    }
    fn make_liveprog(&self) -> Option<Rc<Box<GLiveProgram>>> { None }
    fn statement(&self, _phase: &Phase) -> String { String::new() }
}

pub struct Uniform {
    size: String,
    pub name: String,
    phase: Phase,
}

impl Uniform {
    pub fn new(size: &str, name: &str, phase: Phase) -> Rc<Uniform> {
        Rc::new(Uniform {
            size: size.to_string(), name: name.to_string(), phase
        })
    }
}

impl Variable for Uniform {
    fn declare(&self, phase: &Phase) -> String {
        if *phase == self.phase {
            format!("uniform {} {};\n",self.size,self.name).to_string()
        } else {
            String::new()
        }
    }

    fn preget(&self, ctx: &glctx, prog: &glprog, udata: &mut HashMap<String,gluni>) {
        let loc = ctx.get_uniform_location(&prog,&self.name);
        if loc.is_some() {
            udata.insert(self.name.to_string(),loc.unwrap());
        }
    }
}

#[derive(Clone)]
pub struct Attribute {
    size: u8,
    pub name: String,
    phase: Phase,
}

impl Attribute {
    pub fn new(size: u8, name: &str, phase: Phase) -> Rc<Attribute> {
        Rc::new(Attribute {
            phase, size, name: name.to_string()
        })
    }
}

const ATTRIB_NAME : [&str;4] = ["float","vec2","vec3","vec4"];

impl Variable for Attribute {
    fn declare(&self, phase: &Phase) -> String {
        match phase {
            Phase::Vertex =>
                format!("attribute {} {};\n",ATTRIB_NAME[(self.size-1) as usize],self.name).to_string(),
            _ =>
                String::new()
        }
    }

    fn make_attribs(&self, adata: &ArenaData)
                            -> Option<(Option<&str>,Phase,Box<GType>)> {
        let gt = if self.phase == Phase::PrePopulate {
            GTypeAttrib::new_pre(adata,&self.name,self.size)
        } else {
            GTypeAttrib::new(adata,&self.name,self.size)
        };
        Some((Some(&self.name),self.phase.clone(),Box::new(gt)))
    }
}

#[derive(Clone)]
pub struct Varying {
    prec: String,
    size: String,
    name: String,
}

impl Varying {
    pub fn new(prec: &str, size: &str, name: &str) -> Rc<Varying> {
        Rc::new(Varying {
            prec: prec.to_string(),
            size: size.to_string(),
            name: name.to_string()
        })
    }
}

impl Variable for Varying {
    fn declare(&self, phase: &Phase) -> String {
        match phase {
            Phase::Fragment | Phase::Vertex =>
                format!("varying {} {} {};\n",
                    self.prec,self.size,self.name).to_string(),
            _ =>
                String::new()
        }
    }
}

#[derive(Clone)]
pub struct Statement {
    src: String,
    phase: Phase,
}

impl Statement {
    pub fn new(src: &str, phase: Phase) -> Rc<Statement> {
        Rc::new(Statement {
            src: src.to_string(),
            phase
        })
    }
}

impl Variable for Statement {
    fn statement(&self, phase: &Phase) -> String {
        if *phase == self.phase {
            format!("{};\n",self.src)
        } else {
            String::new()
        }
    }
}

pub struct Canvas {
    name: String,
}

impl Canvas {
    pub fn new(name: &str) -> Rc<Canvas> {
        Rc::new(Canvas { name: name.to_string() })
    }
}

impl Variable for Canvas {
    fn make_attribs(&self, _adata: &ArenaData)
                        -> Option<(Option<&str>,Phase,Box<GType>)> {
        Some((None,Phase::Vertex,Box::new(GTypeCanvasTexture::new(&self.name))))
    }
}

pub struct Stage {}

impl Stage {
    pub fn new() -> Rc<Stage> {
        Rc::new(Stage {})
    }
}

impl Variable for Stage {
    fn make_attribs(&self, _adata: &ArenaData) 
                            -> Option<(Option<&str>,Phase,Box<GType>)> {
        Some((None,Phase::Vertex,Box::new(GTypeStage::new())))
    }
}

fn declare(variables: &Vec<Rc<Variable>>, phase: &Phase) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.declare(phase)[..];
    }
    out
}

fn statements(variables: &Vec<Rc<Variable>>, phase: &Phase) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.statement(phase)[..];
    }
    out
}

pub struct GLSource {
    pub uniforms: Vec<Rc<Variable>>
}

fn make_shader(ctx: &glctx, program: &glprog, kind: u32, src: &str) {
    let shader = ctx.create_shader(kind).unwrap();
    ctx.shader_source(&shader, src);
    ctx.compile_shader(&shader);
    ctx.attach_shader(program, &shader);
}


fn make_source(uniforms: &Vec<Rc<Variable>>, frag: &Phase) -> String {
    format!("{}\n\nvoid main() {{\n{}\n}}",
        declare(uniforms,&frag),
        statements(uniforms,&frag))
}

impl GLSource {
    pub fn new(src: Vec<Rc<Variable>>) -> GLSource {
        GLSource { uniforms: src }
    }

    pub fn prog(&self, ctx: &glctx) -> glprog {
        let prog = ctx.create_program().unwrap();
        let vertex = make_source(&self.uniforms,&Phase::Vertex);
        let fragment = make_source(&self.uniforms,&Phase::Fragment);
        make_shader(ctx,&prog,glctx::VERTEX_SHADER,&vertex);
        make_shader(ctx,&prog,glctx::FRAGMENT_SHADER,&fragment);
        ctx.link_program(&prog);        
        prog
    }
    
    pub fn merge(&self, other: &GLSource) -> GLSource {
        GLSource::new([
            &self.uniforms[..],
            &other.uniforms[..]
        ].concat())
    }
}

fn shader_standard() -> GLSource {
    GLSource::new(vec! {
        Stage::new()
    })
}

pub fn shader_solid(pos: &GLSource) -> GLSource {
    shader_standard().merge(pos).merge(
        &GLSource::new(vec! {
            Attribute::new(3,"aVertexColour",Phase::Vertex),
            Varying::new("lowp","vec3","vColour"),
            Statement::new("vColour = aVertexColour",Phase::Vertex),
            Statement::new("gl_FragColor = vec4(vColour, 1.0)",Phase::Fragment),
        })
    )
}

pub fn shader_texture(pos: &GLSource) -> GLSource {
    shader_standard().merge(pos).merge(
        &GLSource::new(vec! {
            Canvas::new("uSampler"),
            Uniform::new("sampler2D","uSampler",Phase::Fragment),
            Attribute::new(2,"aTextureCoord",Phase::Vertex),
            Varying::new("highp","vec2","vTextureCoord"),
            Statement::new("vTextureCoord = aTextureCoord",Phase::Vertex),
            Statement::new("gl_FragColor = texture2D(uSampler, vTextureCoord)",Phase::Fragment),
        })
    )
}
