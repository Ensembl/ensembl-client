use std::future::Future;
use std::sync::{ Arc, Mutex };
use crate::corefutures::flagfuture::FlagFuture;

#[derive(Clone)]
pub struct SemaphoreFutureMaker(Arc<Mutex<FlagFuture>>);

impl SemaphoreFutureMaker {
    pub fn new() -> SemaphoreFutureMaker {
        SemaphoreFutureMaker(Arc::new(Mutex::new(FlagFuture::new())))
    }

    pub fn signal(&self) {
        let mut flag = self.0.lock().unwrap();
        flag.flag();
        *flag = FlagFuture::new();
    }

    pub fn wait(&self) -> impl Future<Output=()> {
        self.0.lock().unwrap().clone()
    }
}

#[cfg(test)]
mod test {
    use crate::agent::agent::Agent;
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;
    use super::*;

    async fn smoke_1(agent: Agent, s: SemaphoreFutureMaker) {
        agent.tick(3).await;
        s.signal(); // signal A on tick 4
        agent.tick(1).await;
        s.signal(); // signal B on tick 5
        agent.tick(1).await;
        s.signal(); // signal C on tick 6
        s.signal(); // signal D on tick 6
        agent.tick(2).await;
        s.signal(); // signal E on tick 8
    }

    async fn smoke_2(agent: Agent, s: SemaphoreFutureMaker, mut b: Vec<Arc<Mutex<bool>>>) {
        s.wait().await; // signal A on tick 4
        *b[0].lock().unwrap() = true;
        s.wait().await; // signal B on tick 5
        *b[1].lock().unwrap() = true;
        s.wait().await; // signal D on tick 6
        *b[2].lock().unwrap() = true;
        agent.tick(1).await;
        let w = s.wait(); // w captured on tick 7
        agent.tick(3).await;
        w.await; // signal E on tick 10
        *b[3].lock().unwrap() = true;
    }

    #[test]
    pub fn test_semaphore_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let mut b1 = Vec::new();
        let mut b2 = Vec::new();
        for _ in 0..4 {
            b1.push(Arc::new(Mutex::new(false)));
            b2.push(None);
        }
        let s = SemaphoreFutureMaker::new();
        let agent = x.new_agent(&cfg,"test");
        x.add(smoke_1(agent.clone(),s.clone()),agent);
        let agent = x.new_agent(&cfg,"test");
        x.add(smoke_2(agent.clone(),s.clone(),b1.clone()),agent);
        for i in 0..100 {
            for (j,v) in b1.iter().enumerate() {
                if b2[j].is_none() && *v.lock().unwrap() {
                    b2[j] = Some(i);
                }
            }
            x.tick(10.);
        }
        assert_eq!(vec![Some(4),Some(5),Some(6),Some(10)],b2);
    }
}