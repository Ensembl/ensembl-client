use std::cell::RefCell;
use std::fmt;
use std::rc::Rc;
use std::char;

pub enum ValueImpl {
    Float(Vec<f64>),
    String(String)
}

impl ValueImpl {
    pub fn value_string(&self) -> Option<&String> {
        match self {
            ValueImpl::Float(_) => None,
            ValueImpl::String(s) => Some(&s)
        }
    }

    pub fn value_float(&self) -> Option<&Vec<f64>> {
        match self {
            ValueImpl::Float(f) => Some(&f),
            ValueImpl::String(_) => None
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

fn string_to_float(data: String) -> Vec<f64> {
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

    pub fn value(&self) -> Rc<RefCell<ValueImpl>> {
        self.0.clone()
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
        let v = {
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
        let v = {
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
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_f.to_string()));
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",format!("{:?}",v_f));
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",format!("{:?}",v_f.to_float()));
        let v_s = Value::new_from_string("hello tánaiste".to_string());
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_s));
        assert_eq!("\"hello tánaiste\"",format!("{:?}",v_s.to_string()));
        assert_eq!("[104.0, 101.0, 108.0, 108.0, 111.0, 32.0, 116.0, 225.0, 110.0, 97.0, 105.0, 115.0, 116.0, 101.0]",format!("{:?}",v_s.to_float()));
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
