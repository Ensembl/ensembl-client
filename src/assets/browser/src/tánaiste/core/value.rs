use std::cell::RefCell;
use std::rc::Rc;

pub enum ValueImpl {
    Float(Vec<f64>),
    String(String)
}

impl ValueImpl {
}

fn float_to_string(data: &Vec<f64>) -> String {
    let bytes : Vec<u8> = data.iter().map(|s| *s as u8).collect();
    String::from_utf8(bytes).unwrap_or_else(|_| "".to_string())
}

fn string_to_float(data: String) -> Vec<f64> {
    data.into_bytes().iter().map(|s| *s as f64).collect()
}

#[derive(Clone)]
pub struct Value(Rc<RefCell<ValueImpl>>);

impl Value {
    pub fn new_from_float(data: Vec<f64>) -> Value {
        Value(Rc::new(RefCell::new(ValueImpl::Float(data))))
    }
    
    pub fn new_from_string(data: String) -> Value {
        Value(Rc::new(RefCell::new(ValueImpl::String(data))))
    }
    
    pub fn to_string(&self) -> Value {
        let imp = self.0.borrow();
        match *imp {
            ValueImpl::Float(ref f) => Value::new_from_string(float_to_string(&f.clone())),
            ValueImpl::String(_) => self.clone()
        }
    }
    
    pub fn to_float(&self) -> Value {
        let imp = self.0.borrow();
        match *imp {
            ValueImpl::String(ref s) => Value::new_from_float(string_to_float(s.clone())),
            ValueImpl::Float(_) => self.clone()
        }
    }
    
    pub fn coerce_to_string(&mut self) {
        let mut v = {
            match *self.0.borrow() {
                ValueImpl::Float(ref f) =>
                    Some(ValueImpl::String(float_to_string(&f))),
                ValueImpl::String(_) => None
            }
        };
        if let Some(v) = v {
            *self.0.borrow_mut() = v;
        }
    }

    pub fn coerce_to_float(&mut self) {
        let mut v = {
            match *self.0.borrow() {
                ValueImpl::String(ref s) =>
                    Some(ValueImpl::Float(string_to_float(s.clone()))),
                ValueImpl::Float(_) => None
            }
        };
        if let Some(v) = v {
            *self.0.borrow_mut() = v;
        }
    }
}
