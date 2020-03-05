use commander::{ Agent, CommanderStream };
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{ XmlHttpRequest, XhrReadyState };

identitynumber!(ID);

struct HttpRequest {
    id: u64,
    xml: XmlHttpRequest,
    consumer: Box<dyn HttpResponseConsumer>
}

impl HttpRequest {
    fn new(xml: XmlHttpRequest, consumer: Box<dyn HttpResponseConsumer>) -> HttpRequest {
        let id = ID.next();
        blackbox_log!("http-manager","request {} added",id);
        blackbox_start!("http-manager","latency",&format!("{}",id));
        HttpRequest { xml, consumer, id }
    }

    fn is_done(&self) -> bool {
        self.xml.ready_state() == XhrReadyState::Done
    }

    fn finish(mut self, agent: &Agent) {
        blackbox_log!("http-manager","request {} finished",self.id);
        blackbox_end!("http-manager","latency",&format!("{}",self.id));
        self.consumer.consume(self.xml,agent);
    }
}

pub trait HttpResponseConsumer {
    fn consume(&mut self,req: XmlHttpRequest, agent: &Agent);
}

#[derive(Clone)]
pub struct HttpManager {
    requests: CommanderStream<HttpRequest>
}

impl HttpManager {
    pub fn new() -> HttpManager {
        HttpManager {
            requests: CommanderStream::new()
        }
    }

    // TODO error handling
    pub fn add_request(&self, req: XmlHttpRequest, data: Option<&[u8]>,
                       consumer: Box<dyn HttpResponseConsumer>) {
        if let Some(data) = data {
            req.send_with_bytes(data);
        } else {
            req.send();
        }
        self.requests.add(HttpRequest::new(req,consumer));
    }
    
    async fn get_done(&self) -> Vec<HttpRequest> {
        let mut finished = Vec::new();
        let mut unfinished = Vec::new();
        let mut reqs = self.requests.get_multi().await;
        for r in reqs.drain(..) {
            if r.is_done() {
                finished.push(r);
            } else {
                unfinished.push(r);
            };
        }
        for r in unfinished.drain(..) {
            self.requests.add(r);
        }
        finished
    }
    
    pub async fn main_loop(mut self, agent: Agent) {
        loop {
            for r in self.get_done().await {
                r.finish(&agent);
            }
            agent.tick(1).await;
        }
    }
}
