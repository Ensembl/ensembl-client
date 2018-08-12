use std::collections::HashMap;
use std::rc::Rc;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLBuffer as glbuf,
    WebGLTexture as gltex,
    WebGLShader as glshader,
    WebGLUniformLocation as gluni,
    GLenum,
    GLint,
};

pub trait Variable {
    fn declare(&self, frag: bool) -> String;
    fn preget(&self, ctx: &glctx, prog: &glprog,
              udata: &mut HashMap<String,gluni>);
    fn statement(&self, frag: bool) -> String;
}

pub struct Uniform {
    size: String,
    pub name: String,
    frag: bool,
}

impl Uniform {
    pub fn new_vertex(size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(size,name,false)
    }
    
    pub fn new_fragment(size: &str, name: &str) -> Rc<Uniform> {
        Uniform::new(size,name,true)
    }
    
    fn new(size: &str, name: &str, frag: bool) -> Rc<Uniform> {
        Rc::new(Uniform {
            size: size.to_string(), name: name.to_string(),
            frag
        })
    }
}

impl Variable for Uniform {
    fn declare(&self,frag: bool) -> String {
        if frag == self.frag {
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
    
    fn statement(&self, frag: bool) -> String { String::new() }
}

#[derive(Clone)]
pub struct Attribute {
    size: String,
    pub name: String,
}

impl Attribute {
    pub fn new(size: &str, name: &str) -> Rc<Attribute> {
        Rc::new(Attribute { size: size.to_string(), name: name.to_string() })
    }
}

impl Variable for Attribute {
    fn declare(&self,frag: bool) -> String {
        if frag {
            String::new()
        } else {
            format!("attribute {} {};\n",self.size,self.name).to_string()
        }
    }

    fn preget(&self, ctx: &glctx, prog: &glprog, udata: &mut HashMap<String,gluni>) {}
    fn statement(&self, frag: bool) -> String { String::new() }
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
    fn declare(&self,frag: bool) -> String {
        format!("varying {} {} {};\n",
            self.prec,self.size,self.name).to_string()
    }

    fn preget(&self, ctx: &glctx, prog: &glprog, udata: &mut HashMap<String,gluni>) {}
    fn statement(&self, frag: bool) -> String { String::new() }
}

#[derive(Clone)]
pub struct Statement {
    src: String,
    frag: bool,
}

impl Statement {
    fn new(src: &str, frag: bool) -> Rc<Statement> {
        Rc::new(Statement {
            src: src.to_string(),
            frag
        })
    }
    
    pub fn new_vertex(src: &str) -> Rc<Statement> { Statement::new(src,false) }
    pub fn new_fragment(src: &str) -> Rc<Statement> { Statement::new(src,true) }
}

impl Variable for Statement {
    fn declare(&self,frag: bool) -> String { String::new() }
    fn preget(&self, ctx: &glctx, prog: &glprog, udata: &mut HashMap<String,gluni>) {}
    fn statement(&self, frag: bool) -> String {
        if frag == self.frag {
            format!("{};\n",self.src)
        } else {
            String::new()
        }
    }
}

fn declare(variables: &Vec<Rc<Variable>>, fragment: bool) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.declare(fragment)[..];
    }
    out
}

fn statements(variables: &Vec<Rc<Variable>>, fragment: bool) -> String {
    let mut out = String::new();
    for v in variables {
        out += &v.statement(fragment)[..];
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


fn make_source(uniforms: &Vec<Rc<Variable>>, frag: bool) -> String {
    format!("{}\n\nvoid main() {{\n{}\n}}",
        declare(uniforms,frag),
        statements(uniforms,frag))
}

impl GLSource {
    pub fn new(src: Vec<Rc<Variable>>) -> GLSource {
        GLSource { uniforms: src }
    }

    pub fn prog(&self, ctx: &glctx) -> glprog {
        let prog = ctx.create_program().unwrap();
        let vertex = make_source(&self.uniforms,false);
        let fragment = make_source(&self.uniforms,true);
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
        Uniform::new_vertex("float","uAspect"),
        Uniform::new_vertex("float","uStageHpos"),
        Uniform::new_vertex("float","uStageVpos"),
        Uniform::new_vertex("float","uStageZoom"),
        Uniform::new_vertex("vec2","uSize"),
        Attribute::new("vec2","aVertexPosition"),
        Attribute::new("vec2","aOrigin"),
    })
}

pub fn shader_solid(pos: &GLSource) -> GLSource {
    shader_standard().merge(pos).merge(
        &GLSource::new(vec! {
            Attribute::new("vec3","aVertexColour"),
            Varying::new("lowp","vec3","vColour"),
            Statement::new_vertex("vColour = aVertexColour"),
            Statement::new_fragment("gl_FragColor = vec4(vColour, 1.0)"),
        })
    )
}

pub fn shader_texture(pos: &GLSource) -> GLSource {
    shader_standard().merge(pos).merge(
        &GLSource::new(vec! {
            Uniform::new_fragment("sampler2D","uSampler"),
            Attribute::new("vec2","aTextureCoord"),
            Varying::new("highp","vec2","vTextureCoord"),
            Statement::new_vertex("vTextureCoord = aTextureCoord"),
            Statement::new_fragment("gl_FragColor = texture2D(uSampler, vTextureCoord)"),
        })
    )
}
