use tánaiste::Value;

use data::{ XferClerk, XferConsumer, XferRequest, XferResponse };

#[derive(Clone)]
pub struct DebugXferClerk {
}

impl DebugXferClerk {
    pub fn new() -> DebugXferClerk {
        DebugXferClerk {}
    }
}

const src: &str = r#"
    const #3, [428]
    const #4, [6]
    const #5, [255,120,0,120,255,0]
    strect #1, #2, #3, #4, #5
"#;

impl XferClerk for DebugXferClerk {
    fn satisfy(&mut self, request: XferRequest, mut consumer: Box<XferConsumer>) {
        let gc_xfer_res = XferResponse::new(request,src.to_string(),vec!{
            Value::new_from_float(vec![10000.,17000.,20000.,30000.,40000.]),
            Value::new_from_float(vec![4000.,1000.,6000.]),
        }.clone());
        consumer.consume(gc_xfer_res);
    }
}
