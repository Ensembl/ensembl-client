use std::collections::HashMap;
use std::rc::Rc;

use arena::ArenaData;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

use program::objects::{
    Object,
    ObjectAttrib,
    ObjectCanvasTexture,
    ObjectStage,
};

use program::gpuspec::Precision;

#[derive(PartialEq,Clone,Eq)]
pub enum Phase {
    Vertex,
    Fragment,
}

pub trait Source {
    fn declare(&self, _adata: &ArenaData, _phase: &Phase) -> String { String::new() }
    fn preget(&self, _ctx: &glctx, _prog: &glprog,
              _udata: &mut HashMap<String,gluni>) {}
    fn make_attribs(&self, _adata: &ArenaData) 
                            -> Option<(Option<&str>,Box<Object>)> {
        None
    }
    fn statement(&self, _phase: &Phase) -> String { String::new() }
}

pub struct Uniform {
    size: String,
    pub name: String,
    phase: Phase,
    prec: Precision,
}

impl Uniform {
    fn new(prec: &Precision, size: &str, name: &str, phase: Phase) -> Rc<Uniform> {
        Rc::new(Uniform {
            size: size.to_string(), name: name.to_string(), phase, 
            prec: *prec
        })
    }
    
    pub fn new_frag(prec: &Precision, size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(prec,size, name, Phase::Fragment)
    }

    pub fn new_vert(prec: &Precision, size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(prec,size, name, Phase::Vertex)
    }
}

impl Source for Uniform {
    fn declare(&self, adata: &ArenaData, phase: &Phase) -> String {
        if *phase == self.phase {
            let prec = match self.phase {
                Phase::Vertex =>
                    adata.gpuspec.best_float_vert(&self.prec),
                Phase::Fragment =>
                    adata.gpuspec.best_float_frag(&self.prec)
            };
            format!("uniform {} {} {};\n",
                prec.as_string(),
                self.size,
                self.name).to_string()
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
    prec: Precision,
    pub name: String,
}

impl Attribute {
    pub fn new(prec: &Precision,size: u8, name: &str) -> Rc<Attribute> {
        Rc::new(Attribute {
            size, name: name.to_string(), prec: *prec
        })
    }
}

const ATTRIB_NAME : [&str;4] = ["float","vec2","vec3","vec4"];

impl Source for Attribute {
    fn declare(&self, adata: &ArenaData, phase: &Phase) -> String {
        if *phase != Phase::Vertex { return String::new(); }
        format!("attribute {} {} {};\n",
            adata.gpuspec.best_float_vert(&self.prec).as_string(),
            ATTRIB_NAME[(self.size-1) as usize],
            self.name).to_string()
    }

    fn make_attribs(&self, adata: &ArenaData)
                            -> Option<(Option<&str>,Box<Object>)> {
        let gt = ObjectAttrib::new(adata,&self.name,self.size);
        Some((Some(&self.name),Box::new(gt)))
    }
}

#[derive(Clone)]
pub struct Varying {
    prec: Precision,
    size: String,
    name: String,
}

impl Varying {
    pub fn new(prec: &Precision, size: &str, name: &str) -> Rc<Varying> {
        Rc::new(Varying {
            prec: *prec,
            size: size.to_string(),
            name: name.to_string()
        })
    }
}

impl Source for Varying {
    fn declare(&self, adata: &ArenaData, _phase: &Phase) -> String {
        format!("varying {} {} {};\n",
            adata.gpuspec.best_float_frag(&self.prec).as_string(),
            self.size,self.name).to_string()
    }
}

#[derive(Clone)]
pub struct Statement {
    src: String,
    phase: Phase,
}

impl Statement {
    fn new(src: &str, phase: Phase) -> Rc<Statement> {
        Rc::new(Statement {
            src: src.to_string(),
            phase
        })
    }
    
    pub fn new_vert(src: &str) -> Rc<Statement> {
        Statement::new(src, Phase::Vertex)
    }

    pub fn new_frag(src: &str) -> Rc<Statement> {
        Statement::new(src, Phase::Fragment)
    }
}

impl Source for Statement {
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

impl Source for Canvas {
    fn make_attribs(&self, _adata: &ArenaData)
                        -> Option<(Option<&str>,Box<Object>)> {
        Some((None,Box::new(ObjectCanvasTexture::new(&self.name))))
    }
}

pub struct Stage {}

impl Stage {
    pub fn new() -> Rc<Stage> {
        Rc::new(Stage {})
    }
}

impl Source for Stage {
    fn make_attribs(&self, _adata: &ArenaData) 
                            -> Option<(Option<&str>,Box<Object>)> {
        Some((None,Box::new(ObjectStage::new())))
    }
}

fn declare(adata: &ArenaData, variables: &Vec<Rc<Source>>, phase: &Phase) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.declare(adata,phase)[..];
    }
    out
}

fn statements(variables: &Vec<Rc<Source>>, phase: &Phase) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.statement(phase)[..];
    }
    out
}

pub struct ProgramSource {
    pub uniforms: Vec<Rc<Source>>
}

fn make_shader(ctx: &glctx, program: &glprog, kind: u32, src: &str) {
    let shader = ctx.create_shader(kind).unwrap();
    ctx.shader_source(&shader, src);
    ctx.compile_shader(&shader);
    ctx.attach_shader(program, &shader);
}


fn make_source(adata: &ArenaData, uniforms: &Vec<Rc<Source>>, frag: &Phase) -> String {
    format!("{}\n\nvoid main() {{\n{}\n}}",
        declare(adata,uniforms,&frag),
        statements(uniforms,&frag))
}

impl ProgramSource {
    pub fn new(src: Vec<Rc<Source>>) -> ProgramSource {
        ProgramSource { uniforms: src }
    }

    pub fn prog(&self, adata: &ArenaData) -> glprog {
        let prog = adata.ctx.create_program().unwrap();
        let vertex = make_source(adata,&self.uniforms,&Phase::Vertex);
        let fragment = make_source(adata,&self.uniforms,&Phase::Fragment);
        make_shader(&adata.ctx,&prog,glctx::VERTEX_SHADER,&vertex);
        make_shader(&adata.ctx,&prog,glctx::FRAGMENT_SHADER,&fragment);
        adata.ctx.link_program(&prog);        
        prog
    }
    
    pub fn merge(&self, other: &ProgramSource) -> ProgramSource {
        ProgramSource::new([
            &self.uniforms[..],
            &other.uniforms[..]
        ].concat())
    }
}
