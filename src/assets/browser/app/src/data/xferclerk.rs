use data::{ XferRequest, XferResponse };

pub trait XferConsumer {
    fn consume(&mut self, response: XferResponse);
}

pub trait XferClerk {
    fn satisfy(&mut self, request: XferRequest, consumer: Box<XferConsumer>);
}
