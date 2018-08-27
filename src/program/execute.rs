use std::collections::HashMap;
use std::rc::Rc;

use webgl_rendering_context::{
    WebGLProgram as glprog,
};

use arena::{ Stage, ArenaData };

use shape::SolidShapeManager;
use texture::TexShapeManager;

use program::source::{ Source, ProgramSource };
use program::objects::Object;
use program::data::{ DataBatch, DataGroupImpl };

pub struct ProgramAttribs {
//    max_batch: u32,
    group: DataGroupImpl,
    objects: Vec<Box<Object>>,
    main_idx: Option<usize>,
    object_names: HashMap<String,usize>,
}

pub struct Program {
    data: ProgramAttribs,
    pub solid_shapes: SolidShapeManager,
    pub tex_shapes: TexShapeManager,
    prog: Rc<glprog>,
}

fn find_attribs(adata: &ArenaData, vars: &Vec<Rc<Source>>,
                prog: Rc<glprog>) 
                        -> (Vec<Box<Object>>,Option<usize>,
                            HashMap<String,usize>) {
    let mut main = None;
    let mut attribs = Vec::<Box<Object>>::new();
    let mut attrib_names = HashMap::<String,usize>::new();
    for v in vars {
        if let Some((name,value)) = v.make_attribs(adata,prog.clone()) {
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
    pub fn get_object(&mut self, name: &str) -> &mut Box<Object> {
        self.objects.get_mut(self.object_names[name]).unwrap()
    }
    
    pub fn add_vertices(&mut self, indexes: &[u16], points: u16) -> DataBatch {
        let b = self.group.batch_for(points);
        if let Some(obj_idx) = self.main_idx {
            let mut main = &mut self.objects[obj_idx];
            main.add_index(b,indexes,points);
        }
        *b
    }
}

impl Program {
    pub fn new(adata: &ArenaData, src: &ProgramSource) -> Program {
        let prog = Rc::new(src.prog(adata));
        adata.ctx.use_program(Some(&prog));
        let (objects,main_idx,object_names) = find_attribs(adata,&src.uniforms,prog.clone());
        Program {
            tex_shapes: TexShapeManager::new(),
            solid_shapes: SolidShapeManager::new(),
            data: ProgramAttribs {
//                max_batch: 0,
                group: DataGroupImpl::new(),
                objects, object_names, main_idx,
            },
            prog,
        }
    }

    pub fn use_program(&self, adata : &ArenaData) {
        adata.ctx.use_program(Some(&self.prog));
    }
  
    pub fn draw(&mut self, adata: &ArenaData, stage:&Stage) {
        for obj in self.data.objects.iter_mut() {
            obj.stage_gl(adata,stage);
        }
        self.use_program(adata);
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
