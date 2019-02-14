pub use tánaiste::Value;

pub struct XferResponse {
    code: String,
    data: Vec<Option<Value>>
}

impl XferResponse {
    pub fn new(code: String, mut data: Vec<Value>) -> XferResponse {
        XferResponse {
            code,
            data: data.drain(..).map(|x| Some(x)).collect()
        }
    }

    pub fn get_code(&self) -> &String { &self.code }
    pub fn take_data(&mut self, idx: usize) -> Value {
        self.data[idx].take().unwrap()
    }
}
