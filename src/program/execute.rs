use std::collections::HashMap;
use std::rc::Rc;

use webgl_rendering_context::{
    WebGLRenderingContext as glctx,
    WebGLProgram as glprog,
};

use program::source::{ Source, ProgramSource };
use program::objects::Object;
use program::data::{ DataBatch, DataGroup, BatchManager };
use program::gpuspec::GPUSpec;
use drawing::AllCanvasMan;

pub struct ProgramAttribs {
    pub bman: BatchManager,
    default_group: DataGroup,
    pub objects: Vec<Box<Object>>,
    main_idx: Option<usize>,
    object_names: HashMap<String,usize>,
}

pub struct Program {
    pub data: ProgramAttribs,
    prog: Rc<glprog>,
}

fn find_attribs(ctx: &glctx, vars: &Vec<Rc<Source>>,
                prog: Rc<glprog>) 
                        -> (Vec<Box<Object>>,Option<usize>,
                            HashMap<String,usize>) {
    let mut main = None;
    let mut attribs = Vec::<Box<Object>>::new();
    let mut attrib_names = HashMap::<String,usize>::new();
    for v in vars {
        if let Some((name,value)) = v.make_attribs(ctx,prog.clone()) {
            if value.is_main() { main = Some(attribs.len()); }
            let loc = attribs.len();
            attribs.push(value);
            if let Some(name) = name {
                attrib_names.insert(name.to_string(),loc);
            }
        }
    }
    (attribs,main,attrib_names)
}

impl ProgramAttribs {
    pub fn get_object(&mut self, name: &str) -> Option<&mut Box<Object>> {
        if let Some(idx) = self.object_names.get(name) {
            self.objects.get_mut(*idx)
        } else {
            None
        }
    }

    fn clear(&mut self) {
        for a in &mut self.objects.iter_mut() {
            a.clear();
        }
    }

    pub fn objects_final(&mut self, ctx: &glctx, acm: &AllCanvasMan) {
        for b in self.bman.iter() {
            for a in &mut self.objects.iter_mut() {
                a.obj_final(&b,ctx,acm);
            }
        }
    }
    
    pub fn get_default_group(&self) -> DataGroup {
        self.default_group
    }
    
    pub fn new_group(&mut self) -> DataGroup {
        self.bman.new_group()
    }
    
    pub fn add_vertices(&mut self, group: DataGroup,
                        indexes: &[u16], points: u16) -> DataBatch {
        let b = self.bman.get_batch(group,points);
        if let Some(obj_idx) = self.main_idx {
            let mut main = &mut self.objects[obj_idx];
            main.add_index(&b,indexes,points);
        }
        b
    }
}

impl Program {
    pub fn new(gpuspec: &GPUSpec, ctx: &glctx, src: &ProgramSource) -> Program {
        let prog = Rc::new(src.prog(gpuspec,ctx));
        ctx.use_program(Some(&prog));
        let (objects,main_idx,object_names) = find_attribs(ctx,&src.uniforms,prog.clone());
        let mut bman = BatchManager::new();
        let default_group = bman.new_group();
        Program {
            data: ProgramAttribs {
                bman, default_group,
                objects, object_names, main_idx,
            },
            prog,
        }
    }

    pub fn clear(&mut self) {
        self.data.bman.reset();
        self.data.clear();
    }

    pub fn use_program(&self, ctx: &glctx) {
        ctx.use_program(Some(&self.prog));
    }
  
    pub fn get_object(&mut self, name: &str) -> Option<&mut Box<Object>> {
        self.data.get_object(name)
    }
  
    pub fn execute(&mut self, ctx: &glctx) {
        self.use_program(ctx);
        for b in self.data.bman.iter() {
            let mut main = None;
            for a in &self.data.objects {
                if a.is_main() {
                    main = Some(a);
                } else {
                    a.execute(ctx,&b);
                }
            }
            if let Some(a) = main {
                a.execute(ctx,&b);
            }
        }
    }
}
