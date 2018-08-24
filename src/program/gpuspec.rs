use std::cmp::{ min, Ordering };
use arena::ArenaData;
use std::collections::HashMap;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    GLenum,
};

#[derive(PartialEq,Clone,Copy)]
pub struct Precision(pub i32,pub i32);

impl PartialOrd for Precision {
    fn partial_cmp(&self, other: &Precision) -> Option<Ordering> {
        let less =
            (self.0 < other.0 && self.1 <= other.1) ||
            (self.1 < other.1 && self.0 <= other.0);
        if less {
            Some(Ordering::Less)
        } else if other < self {
            Some(Ordering::Greater)
        } else if other == self {
            Some(Ordering::Equal)
        } else {
            None
        }
    }
}

#[derive(PartialEq,Eq,Hash,Clone,Copy)]
pub enum GLSize {
    FloatHigh,
    FloatMed,
    FloatLow,
    IntHigh,
    IntMed,
    IntLow
}

lazy_static! {
    static ref PREC_STR : HashMap<GLSize,&'static str> = hashmap! {
        GLSize::FloatHigh => "highp", GLSize::IntHigh => "highp",
        GLSize::FloatMed => "mediump", GLSize::IntMed => "mediump",
        GLSize::FloatLow => "lowp", GLSize::IntLow => "lowp"
    };
}

impl GLSize {
    pub fn as_string(&self) -> &str {
        PREC_STR[self]
    }
}

const FLOATS: &[GLSize] = &[GLSize::FloatLow, GLSize::FloatMed, GLSize::FloatHigh];

pub struct GPUSpecImpl {
    vert_precs: HashMap<GLSize,Precision>,
    frag_precs: HashMap<GLSize,Precision>
}

pub struct GPUSpec(Option<GPUSpecImpl>);

impl GPUSpec {
    pub fn new() -> GPUSpec { GPUSpec(None) }
    
    pub fn populate(&mut self, adata: &ArenaData) {
        self.0 = Some(GPUSpecImpl::new(adata));
    }
    
    pub fn best_float_vert(&self, want: &Precision) -> GLSize {
        self.0.as_ref().unwrap().best_vert(want,FLOATS)
    }

    pub fn best_float_frag(&self, want: &Precision) -> GLSize {
        self.0.as_ref().unwrap().best_frag(want,FLOATS)
    }
}

fn get_prec(out: &mut HashMap<GLSize,Precision>, adata: &ArenaData,
            shader_en: GLenum, size: GLSize, type_en: GLenum) {
    let prec = adata.ctx.get_shader_precision_format(shader_en,type_en);
    if let Some(prec) = prec {
        let range = min(prec.range_min(),prec.range_max());
        out.insert(size,Precision(prec.precision(),range));
    }
}

fn get_precisions(adata: &ArenaData, shader_en: GLenum) 
                                        -> HashMap<GLSize,Precision> {
    let mut out = HashMap::<GLSize,Precision>::new();
    get_prec(&mut out,adata,shader_en,GLSize::FloatHigh,glctx::HIGH_FLOAT);
    get_prec(&mut out,adata,shader_en,GLSize::FloatMed,glctx::MEDIUM_FLOAT);
    get_prec(&mut out,adata,shader_en,GLSize::FloatLow,glctx::LOW_FLOAT);
    get_prec(&mut out,adata,shader_en,GLSize::IntHigh,glctx::HIGH_INT);
    get_prec(&mut out,adata,shader_en,GLSize::IntMed,glctx::MEDIUM_INT);
    get_prec(&mut out,adata,shader_en,GLSize::IntLow,glctx::LOW_INT);
    out
}

impl GPUSpecImpl {
    pub fn new(adata: &ArenaData) -> GPUSpecImpl {
        GPUSpecImpl {
            vert_precs: get_precisions(adata,glctx::VERTEX_SHADER),
            frag_precs: get_precisions(adata,glctx::FRAGMENT_SHADER)
        }
    }
    
    fn best(&self, want: &Precision, try: &[GLSize],
            precs: &HashMap<GLSize,Precision>) -> GLSize {
        for p in try {
            if precs[p] > *want { return *p; }
        }
        return *try.last().unwrap();
    }
    
    pub fn best_vert(&self, want: &Precision, try: &[GLSize]) -> GLSize {
        self.best(want,try,&self.vert_precs)
    }
    
    pub fn best_frag(&self, want: &Precision, try: &[GLSize]) -> GLSize {
        self.best(want,try,&self.frag_precs)
    }    
}
