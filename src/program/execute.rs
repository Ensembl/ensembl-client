use std::collections::HashMap;
use std::rc::Rc;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
    WebGLUniformLocation as gluni,
};

use arena::{ Stage, ArenaData };
use coord::Input;

use shape::SolidShapeManager;
use texture::TexShapeManager;

use program::source::{ Source, ProgramSource };
use program::objects::Object;
use program::data::DataBatch;

const BATCH_LIMIT : u32 = 65535;

struct DataGroup {
    batches: Vec<DataBatch>,    
    batch_num: u32,
    prog: Rc<glprog>,
    uniforms: Rc<HashMap<String,gluni>>,
}

impl DataGroup {
    pub fn new(adata: &ArenaData, prog: Rc<glprog>, 
                uniforms: Rc<HashMap<String,gluni>>) -> DataGroup {
        let mut out = DataGroup {
            batches: Vec::<DataBatch>::new(),
            batch_num: 0, prog, uniforms
        };
        out.new_batch(adata);
        out
    }
    
    pub fn new_batch(&mut self, adata: &ArenaData) {
        let idx = self.batches.len() as u32;
        self.batches.push(DataBatch::new(adata,idx,self.prog.clone(),self.uniforms.clone()));
        self.batch_num = 0;
    }

    fn batch_for(&mut self, adata: &ArenaData, more: u16) -> &mut DataBatch {
        if self.batch_num + more as u32 > BATCH_LIMIT {
            self.new_batch(adata);
        }
        self.batch_num += more as u32;
        self.batches.last_mut().unwrap()
    }
    
    pub fn add_vertices(&mut self, adata: &ArenaData, indexes: &[u16], points: u16) {
        let b = self.batch_for(adata,points);
        b.add_vertices(indexes,points);
    }

    pub fn add_data(&mut self, values: &[&Input], obj: &mut Box<Object>) {
        obj.add_data(self.batches.last_mut().unwrap(),values);
    }

    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage, objs: &Vec<Box<Object>>) {
        for b in self.batches.iter() {
            b.use_program(adata);
            for a in objs {
                a.execute(adata,b,stage,&adata.dims);
            }
            b.draw_triangles(adata);
        }
    }

    pub fn to_gl(&mut self, adata: &ArenaData, objs: &mut Vec<Box<Object>>) {
        for b in self.batches.iter_mut() {
            for a in &mut objs.iter_mut() {
                a.to_gl(b,adata);
            }
        }
    }
}

pub struct ProgramAttribs {
    group: DataGroup,
    objects: Vec<Box<Object>>,
    object_names: HashMap<String,usize>,
}

pub struct Program {
    data: ProgramAttribs,
    pub solid_shapes: SolidShapeManager,
    pub tex_shapes: TexShapeManager,
}

fn find_uniforms(ctx: &glctx, prog: &Rc<glprog>, vars: &Vec<Rc<Source>>) 
                                        -> Rc<HashMap<String,gluni>> {
    let mut udata = HashMap::<String,gluni>::new();
    for v in vars {
        v.preget(ctx,prog,&mut udata);
    }
    Rc::new(udata)
}

fn find_attribs(adata: &ArenaData, vars: &Vec<Rc<Source>>) 
                        -> (Vec<Box<Object>>,HashMap<String,usize>) {
    let mut attribs = Vec::<Box<Object>>::new();
    let mut attrib_names = HashMap::<String,usize>::new();
    for v in vars {
        if let Some((name,value)) = v.make_attribs(adata) {
            let loc = attribs.len();
            attribs.push(value);
            if let Some(name) = name {
                attrib_names.insert(name.to_string(),loc);
            }
        }
    }
    (attribs,attrib_names)
}

impl ProgramAttribs {
    pub fn add_attrib_data(&mut self, name: &str, values: &[&Input]) {
        let loc = self.object_names[name];
        self.group.add_data(values, &mut self.objects[loc]);
    }
    
    pub fn add_vertices(&mut self, adata: &ArenaData, indexes: &[u16], points: u16) {
        self.group.add_vertices(adata,indexes,points);
    }
}

impl Program {
    pub fn new(adata: &ArenaData, src: &ProgramSource) -> Program {
        let prog = Rc::new(src.prog(adata));
        adata.ctx.use_program(Some(&prog));
        let uniforms = find_uniforms(&adata.ctx,&prog,&src.uniforms);
        let (objects,object_names) = find_attribs(adata,&src.uniforms);
        Program {
            tex_shapes: TexShapeManager::new(),
            solid_shapes: SolidShapeManager::new(),
            data: ProgramAttribs {
                group: DataGroup::new(adata,prog.clone(),uniforms.clone()),
                objects, object_names,
            },
        }
    }
  
    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage) {
        self.data.group.draw(adata, stage, &self.data.objects);
    }
        
    pub fn shapes_to_gl(&mut self, adata: &mut ArenaData) {
        self.tex_shapes.into_objects(&mut self.data,adata);
        self.tex_shapes.clear();
        self.solid_shapes.into_objects(&mut self.data,adata);
        self.solid_shapes.clear();
        self.data.group.to_gl(adata,&mut self.data.objects);
    }
}
