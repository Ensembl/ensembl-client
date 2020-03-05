use commander::{ Agent, CommanderStream, PromiseFuture, RunConfig };
use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::{ XmlHttpRequest, XhrReadyState };
use crate::controller::scheduler::Commander;

identitynumber!(ID);

struct HttpRequest {
    id: u64,
    xml: XmlHttpRequest,
    promise: PromiseFuture<XmlHttpRequest>
}

impl HttpRequest {
    fn new(xml: XmlHttpRequest, promise: PromiseFuture<XmlHttpRequest>) -> HttpRequest {
        let id = ID.next();
        blackbox_log!("http-manager","request {} added",id);
        blackbox_start!("http-manager","latency",&format!("{}",id));
        HttpRequest { xml, promise, id }
    }

    fn is_done(&self) -> bool {
        self.xml.ready_state() == XhrReadyState::Done
    }

    fn finish(mut self) {
        blackbox_log!("http-manager","request {} finished",self.id);
        blackbox_end!("http-manager","latency",&format!("{}",self.id));
        self.promise.satisfy(self.xml);
    }
}

pub trait HttpResponseConsumer {
    fn consume(&mut self,req: XmlHttpRequest, agent: &Agent);
}

#[derive(Clone)]
pub struct HttpManager {
    requests: CommanderStream<HttpRequest>,
    legacy: CommanderStream<(XmlHttpRequest,Box<dyn HttpResponseConsumer>)>,
    commander: Commander
}

impl HttpManager {
    pub fn new(commander: &Commander) -> HttpManager {
        let out = HttpManager {
            requests: CommanderStream::new(),
            legacy: CommanderStream::new(),
            commander: commander.clone()
        };
        out.legacy_init();
        out
    }

    pub async fn go(&self, req: XmlHttpRequest, data: Option<&[u8]>) -> XmlHttpRequest {
        if let Some(data) = data {
            req.send_with_bytes(data);
        } else {
            req.send();
        }
        let promise = PromiseFuture::new();
        self.requests.add(HttpRequest::new(req,promise.clone()));
        promise.await
    }

    fn legacy_init(&self) {
        let mut exe = self.commander.executor();
        let rc = RunConfig::new(None,0,None);
        let agent = exe.new_agent(&rc,"legacy-http-request");
        exe.add(self.clone().legacy_go(agent.clone()),agent);
    }

    async fn legacy_go(self,agent: Agent) {
        loop {
            let (request,mut consumer) = self.legacy.get().await;
            let promise = PromiseFuture::new();
            self.requests.add(HttpRequest::new(request,promise.clone()));
            let request = promise.await;    
            consumer.consume(request,&agent);
        }
    }

    #[deprecated(note="use go() instead")]
    pub fn add_request(&self, req: XmlHttpRequest, data: Option<&[u8]>,
                       mut consumer: Box<dyn HttpResponseConsumer>) {
        if let Some(data) = data {
            req.send_with_bytes(data);
        } else {
            req.send();
        }
        self.legacy.add((req,consumer));
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
                r.finish();
            }
            agent.tick(1).await;
        }
    }
}
