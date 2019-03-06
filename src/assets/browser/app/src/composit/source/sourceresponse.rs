use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use shape::ShapeSpec;

pub struct SourceResponseImpl {
    source_name: String,
    shapes: HashMap<Option<String>,Vec<ShapeSpec>>,
    max_y: Option<i32>,
    done: bool
}

impl SourceResponseImpl {
    fn new(source_name: &str, parts: &[String]) -> SourceResponseImpl {
        let mut out = SourceResponseImpl {
            shapes: HashMap::<Option<String>,Vec<ShapeSpec>>::new(),
            max_y: None,
            done: false,
            source_name: source_name.to_string()
        };
        out.shapes.insert(None,Vec::<ShapeSpec>::new());
        for p in parts {
            out.shapes.insert(Some(p.to_string()),Vec::<ShapeSpec>::new());
        }
        out
    }

    pub fn get_source_name(&self) -> &str { &self.source_name }
    
    fn add_shape(&mut self, part: &Option<String>, item: ShapeSpec) {
        if let Some(ref mut list) = self.shapes.get_mut(part) {
            list.push(item);
        }
    }
    
    fn done(&mut self, max_y: i32) {
        self.max_y = Some(max_y);
        self.done = true;
    }
    
    fn get_max_y(&self) -> i32 { self.max_y.unwrap_or(0) }
    
    fn is_done(&self) -> bool { self.done }

    fn get_shapes(&self, part: &Option<String>) -> &Vec<ShapeSpec> {
        &self.shapes[part]
    }
        
    pub fn size(&self) -> usize {
        self.shapes.len()
    }
}

#[derive(Clone)]
pub struct SourceResponse(Rc<RefCell<SourceResponseImpl>>);

impl SourceResponse {
    pub fn new(source_name: &str, parts: &[String]) -> SourceResponse {
        SourceResponse(Rc::new(RefCell::new(SourceResponseImpl::new(source_name,parts))))
    }
    
    pub fn add_shape(&mut self, part: &Option<String>, item: ShapeSpec) {
        self.0.borrow_mut().add_shape(part,item);
    }
    
    pub fn get_source_name(&self) -> String {
        self.0.borrow().get_source_name().to_string()
    }
    
    pub fn done(&mut self, max_y: i32) {
        self.0.borrow_mut().done(max_y);
    }
    
    pub fn is_done(&self) -> bool { self.0.borrow().is_done() }
    pub fn get_max_y(&self) -> i32 { self.0.borrow().get_max_y() }
        
    pub fn size(&self) -> usize { self.0.borrow_mut().size() }

    pub fn get_shapes(&self, part: &Option<String>) -> Vec<ShapeSpec> {
        self.0.borrow_mut().get_shapes(part).clone()
    }
}
