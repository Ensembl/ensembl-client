use std::collections::VecDeque;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use crate::corefutures::promisefuture::PromiseFuture;

struct CommanderStreamState<T> {
    data: VecDeque<T>,
    waiters: VecDeque<PromiseFuture<T>>
}

impl<T> CommanderStreamState<T> {
    fn new() -> CommanderStreamState<T> {
        CommanderStreamState {
            data: VecDeque::new(),
            waiters: VecDeque::new()
        }
    }

    fn add(&mut self, item: T) {
        if let Some(waiter) = self.waiters.pop_front() {
            waiter.satisfy(item);
        } else {
            self.data.push_back(item);
        }
    }

    fn get(&mut self) -> impl Future<Output=T> {
        let out = PromiseFuture::new();
        if let Some(value) = self.data.pop_front() {
            out.satisfy(value);
        } else {
            self.waiters.push_back(out.clone());
        }
        out
    }

    fn get_nowait(&mut self) -> Option<T> {
        self.data.pop_front()
    }
}


/// A blocking queue using futures. Add elements at one end and wait for them at the other with futures.
pub struct CommanderStream<T>(Arc<Mutex<CommanderStreamState<T>>>);

// Rust bug means dan't derive Clone on polymorphic types
impl<T> Clone for CommanderStream<T> {
    fn clone(&self) -> Self {
        CommanderStream(self.0.clone())
    }
}

impl<T> CommanderStream<T> {
    /// Create new queue.
    pub fn new() -> CommanderStream<T> {
        CommanderStream(Arc::new(Mutex::new(CommanderStreamState::new())))
    }

    /// Add to queue.
    pub fn add(&self, item: T) {
        self.0.lock().unwrap().add(item);
    }

    /// Get head of queue or wait.
    pub fn get(&self) -> impl Future<Output=T> {
        self.0.lock().unwrap().get()
    }

    /// Get head of queue or None.
    pub fn get_nowait(&self) -> Option<T> {
        self.0.lock().unwrap().get_nowait()
    }

    /// Return at least one queue member. Wait if none present. If multiple are present, return all.
    pub async fn get_multi(&self) -> Vec<T> {
        let mut out = Vec::new();
        while let Some(value) = self.get_nowait() {
            out.push(value);
        }
        if out.len() == 0 {
            out.push(self.get().await);
        }
        out
    }
}

#[cfg(test)]
mod test {
    use crate::agent::agent::Agent;
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;
    use super::*;

    /* 0: 0 pushed, 1 pushed
     * 2: 0 pulled
     * 3: 1 pulled
     * 4: wait
     * 5: 2 pushed, pulled
     * 6: wait, wait
     * 8: 3 pushed, 4 pushed, 5 pushed => 3, 4 pulled
     * 9: wait
     * 10: waits created
     * 11: 6 pushed
     * 12: waits waited upon => 6 pulled
     * 13: 7 pushed, pulled
     * 14: 8 pushed, 9 pushed
     * 15: 8,9 pulled (nowait)
     * 16: 10,11 pushed
     * 17: 10,11 pulled (multi)
     * 19: 12 pushed, pulled (multi)
     * 
     */

    async fn smoke_1(agent: Agent, s: CommanderStream<i32>) {
        s.add(0);
        s.add(1);
        agent.tick(5).await;
        s.add(2);
        agent.tick(3).await;
        s.add(3);
        s.add(4);
        s.add(5);
        agent.tick(3).await;
        s.add(6);
        agent.tick(2).await;
        s.add(7);
        agent.tick(1).await;
        s.add(8);
        s.add(9);
        agent.tick(2).await;
        s.add(10);
        s.add(11);
        agent.tick(3).await;
        s.add(12);

    }

    fn smoke2_record(out: &mut Vec<(u64,i32)>, start: u64, agent: &Agent, v: i32) {
        out.push((agent.get_tick_index()-start,v));
    }

    async fn smoke_2(agent: Agent, s: CommanderStream<i32>) -> Vec<(u64,i32)> {
        let start = agent.get_tick_index();
        let mut out = Vec::new();
        agent.tick(2).await;
        let v = s.get().await;
        smoke2_record(&mut out,start,&agent,v);
        agent.tick(1).await;
        let v = s.get().await;
        smoke2_record(&mut out,start,&agent,v);
        agent.tick(1).await;
        let v = s.get().await;
        smoke2_record(&mut out,start,&agent,v);
        agent.tick(1).await;
        let v = s.get().await;
        let v2 = s.get().await;
        smoke2_record(&mut out,start,&agent,v);
        smoke2_record(&mut out,start,&agent,v2);
        agent.tick(1).await;
        let v = s.get().await;
        smoke2_record(&mut out,start,&agent,v);
        agent.tick(1).await;
        let v = s.get();
        let v2 = s.get();
        agent.tick(2).await;
        let v = v.await;
        smoke2_record(&mut out,start,&agent,v);
        let v2 = v2.await;
        smoke2_record(&mut out,start,&agent,v2);
        agent.tick(2).await;
        smoke2_record(&mut out,start,&agent,s.get_nowait().unwrap());
        smoke2_record(&mut out,start,&agent,s.get_nowait().unwrap());
        assert_eq!(None,s.get_nowait());
        agent.tick(2).await;
        assert_eq!(vec![10,11],s.get_multi().await);
        smoke2_record(&mut out,start,&agent,10);
        smoke2_record(&mut out,start,&agent,11);
        agent.tick(1).await;
        smoke2_record(&mut out,start,&agent,s.get().await);
        out
    }

    #[test]
    pub fn test_commanderstream_smoke() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(None,3,None);
        let s = CommanderStream::new();
        let agent = x.new_agent(&cfg,"test");
        x.add(smoke_1(agent.clone(),s.clone()),agent);
        let agent = x.new_agent(&cfg,"test");
        let th = x.add(smoke_2(agent.clone(),s.clone()),agent);
        for _ in 0..20 {
            x.tick(10.);
        }
        let out = th.take_result();
        assert_eq!(Some(vec![
            (2,0),(3,1),(5,2),(8,3),(8,4),(9,5),(12,6),(13,7),(15,8),(15,9),(17,10),(17,11),(19,12)
        ]),out);
    }
}