use std::cell::RefCell;
use std::fmt;
use std::rc::Rc;
use std::char;

pub enum ValueImpl {
    Float(Vec<f64>),
    String(String)
}

impl ValueImpl {
    pub fn as_string<F,R>(&self, cb: F) -> R 
                where F: FnOnce(&String) -> R {
        match self {
            ValueImpl::Float(f) => cb(&float_to_string(&f)),
            ValueImpl::String(s) => cb(&s)
        }
    }
    
    pub fn as_floats<F,R>(&self, cb: F) -> R
                where F: FnOnce(&Vec<f64>) -> R {
        match self {
            ValueImpl::Float(f) => cb(&f),
            ValueImpl::String(s) => cb(&string_to_float(&s))
        }        
    }
    
    pub fn len(&self) -> usize {
        match self {
            ValueImpl::Float(f) => f.len(),
            ValueImpl::String(s) => s.len()
        }
    }
}

fn float_to_string(data: &Vec<f64>) -> String {
    data.iter().map(|s| char::from_u32(*s as u32).unwrap_or(' ')).collect()
}

fn string_to_float(data: &String) -> Vec<f64> {
    data.chars().map(|s| s as u32 as f64).collect()
}

#[derive(Clone)]
pub struct Value(Rc<RefCell<ValueImpl>>);

impl Value {
    pub fn new_null() -> Value {
        Value::new_from_float(vec!{})
    }
    
    pub fn new_from_float(data: Vec<f64>) -> Value {
        Value(Rc::new(RefCell::new(ValueImpl::Float(data))))
    }
    
    pub fn new_from_string(data: String) -> Value {
        Value(Rc::new(RefCell::new(ValueImpl::String(data))))
    }

    pub fn len(&self) -> usize {
        self.0.borrow().len()
    }

    pub fn as_string<F,R>(&self, cb: F) -> R 
                where F: FnOnce(&String) -> R {
        self.0.borrow().as_string(cb)                    
    }

    pub fn as_floats<F,R>(&self, cb: F) -> R
                where F: FnOnce(&Vec<f64>) -> R {
        self.0.borrow().as_floats(cb)
    }

    fn update(&mut self, v: Option<ValueImpl>) {
        if let Some(v) = v {
            *self.0.borrow_mut() = v;
        }
    }
        
    pub fn coerce_to_string(&mut self) {
        let v = {
            match *self.0.borrow() {
                ValueImpl::Float(ref f) =>
                    Some(ValueImpl::String(float_to_string(&f))),
                ValueImpl::String(_) => None
            }
        };
        self.update(v);
    }

    pub fn coerce_to_float(&mut self) {
        let v = {
            match *self.0.borrow() {
                ValueImpl::String(ref s) =>
                    Some(ValueImpl::Float(string_to_float(&s))),
                ValueImpl::Float(_) => None
            }
        };
        self.update(v);
    }
}

impl fmt::Debug for Value {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self.0.borrow() {
            ValueImpl::String(ref s) => {
                write!(f,"{:?}",s)
            },
            ValueImpl::Float(ref v) => {
                write!(f,"{:?}",v)
            }
        }
    }
}

#[cfg(test)]
mod test {
    use super::Value;
    
    #[test]
    fn interconvert() {
        let v_f = Value::new_from_float(vec!{
            104.,101.,108.,108.,111.,32.,
            116.,225.,110.,97.,105.,115.,116.,101.
        });
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_f.as_string(|s| s.clone())));
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",v_f.as_floats(|f| format!("{:?}",f)));
        let v_s = Value::new_from_string("hello tánaiste".to_string());
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_s));
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_s.as_string(|s| s.clone())));
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",v_s.as_floats(|f| format!("{:?}",f)));
        let mut vc_s = Value::new_from_string("hello tánaiste".to_string());
        vc_s.coerce_to_float();
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",format!("{:?}",vc_s));
        let mut vc_f = Value::new_from_float(vec!{
            104.,101.,108.,108.,111.,32.,
            116.,225.,110.,97.,105.,115.,116.,101.
        });
        vc_f.coerce_to_string();
        assert_eq!("\"hello tánaiste\"",format!("{:?}",vc_f));
    }
}
