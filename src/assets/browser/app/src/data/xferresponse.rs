pub use tánaiste::Value;
use super::XferRequest;

/* XXX clone during dev only! */

#[derive(Clone)]
pub struct XferResponse {
    request: XferRequest,
    code: String,
    data: Vec<Option<Value>>
}

impl XferResponse {
    pub fn new(request: XferRequest, code: String, mut data: Vec<Value>) -> XferResponse {
        XferResponse {
            code, request,
            data: data.drain(..).map(|x| Some(x)).collect()
        }
    }

    pub fn get_code(&self) -> &String { &self.code }
    pub fn len(&self) -> usize { self.data.len() }
    pub fn take_data(&mut self, idx: usize) -> Value {
        self.data[idx].take().unwrap()
    }
}
