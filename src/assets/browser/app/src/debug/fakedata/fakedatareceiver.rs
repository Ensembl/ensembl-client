use std::cell::RefCell;
use std::rc::Rc;
use tánaiste::Value;

use data::{ XferConsumer, XferRequest, XferResponse };

pub struct FakeDataReceiverImpl {
    code: String,
    request: Option<XferRequest>,
    consumer: Box<XferConsumer>,
    values: Vec<Option<Value>>,
    outstanding: usize,
    ready: bool
}

impl FakeDataReceiverImpl {
    pub fn new(request: XferRequest, code: &str, consumer: Box<XferConsumer>) -> FakeDataReceiverImpl {
        FakeDataReceiverImpl {
            code: code.to_string(),
            request: Some(request),
            values: Vec::<Option<Value>>::new(),
            consumer,
            outstanding: 0,
            ready: false
        }
    }
    
    fn send(&mut self) {
        let data = self.values.drain(..).map(|mut x| x.take().unwrap()).collect();
        let res = XferResponse::new(self.request.take().unwrap(),self.code.clone(),data);
        self.consumer.consume(res);
    }
    
    pub fn allocate(&mut self) -> usize {
        self.values.push(None);
        self.outstanding += 1;
        self.values.len()-1
    }
    
    pub fn set(&mut self, idx: usize, v: Value) {
        self.values[idx] = Some(v);
        self.outstanding -= 1;
        if self.outstanding == 0 && self.ready {
            self.send();
        }
    }
    
    pub fn ready(&mut self) {
        self.ready = true;
        if self.outstanding == 0 {
            self.send();
        }
    }
}

#[derive(Clone)]
pub struct FakeDataReceiver(Rc<RefCell<FakeDataReceiverImpl>>);

impl FakeDataReceiver {
    pub fn new(request: XferRequest, code: &str, consumer: Box<XferConsumer>) -> FakeDataReceiver {
        FakeDataReceiver(Rc::new(RefCell::new(FakeDataReceiverImpl::new(request,code,consumer))))
    }

    pub fn allocate(&self) -> usize {
        self.0.borrow_mut().allocate()
    }
    
    pub fn set(&self, idx: usize, v: Value) {
        self.0.borrow_mut().set(idx,v)
    }
    
    pub fn ready(&mut self) {
        self.0.borrow_mut().ready()
    }
}
