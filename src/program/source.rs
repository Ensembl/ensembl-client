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
    fn declare(&self, _phase: &Phase) -> String { String::new() }
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
}

impl Uniform {
    fn new(size: &str, name: &str, phase: Phase) -> Rc<Uniform> {
        Rc::new(Uniform {
            size: size.to_string(), name: name.to_string(), phase
        })
    }
    
    pub fn new_frag(size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(size, name, Phase::Fragment)
    }

    pub fn new_vert(size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(size, name, Phase::Vertex)
    }
}

impl Source for Uniform {
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
}

impl Attribute {
    pub fn new(_p: &Precision,size: u8, name: &str) -> Rc<Attribute> {
        Rc::new(Attribute {
            size, name: name.to_string()
        })
    }
}

const ATTRIB_NAME : [&str;4] = ["float","vec2","vec3","vec4"];

impl Source for Attribute {
    fn declare(&self, phase: &Phase) -> String {
        match phase {
            Phase::Vertex =>
                format!("attribute {} {};\n",ATTRIB_NAME[(self.size-1) as usize],self.name).to_string(),
            _ =>
                String::new()
        }
    }

    fn make_attribs(&self, adata: &ArenaData)
                            -> Option<(Option<&str>,Box<Object>)> {
        let gt = ObjectAttrib::new(adata,&self.name,self.size);
        Some((Some(&self.name),Box::new(gt)))
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

impl Source for Varying {
    fn declare(&self, _phase: &Phase) -> String {
        format!("varying {} {} {};\n",
            self.prec,self.size,self.name).to_string()
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

fn declare(variables: &Vec<Rc<Source>>, phase: &Phase) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.declare(phase)[..];
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


fn make_source(uniforms: &Vec<Rc<Source>>, frag: &Phase) -> String {
    format!("{}\n\nvoid main() {{\n{}\n}}",
        declare(uniforms,&frag),
        statements(uniforms,&frag))
}

impl ProgramSource {
    pub fn new(src: Vec<Rc<Source>>) -> ProgramSource {
        ProgramSource { uniforms: src }
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
    
    pub fn merge(&self, other: &ProgramSource) -> ProgramSource {
        ProgramSource::new([
            &self.uniforms[..],
            &other.uniforms[..]
        ].concat())
    }
}
