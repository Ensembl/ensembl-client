/// A  unique value which can be created by an executor and associated with a task.
/// 
/// Should another task be added with the same RunSlot only one will run. If push is true for the RunSlot, the old task
/// will be killed. If push is false, the new slot will be killed.
#[derive(Clone)]
pub struct RunSlot { 
    identity: u64,
    push: bool
}

identitynumber!(IDENTITY);

impl RunSlot {
    pub(crate) fn new(push: bool) -> RunSlot {
        let identity = IDENTITY.next();
        RunSlot{ identity, push }
    }

    pub(crate) fn is_push(&self) -> bool { self.push }
}

hashable!(RunSlot,identity);

#[cfg(test)]
mod test {
    use std::sync::{ Arc, Mutex };
    use crate::executor::executor::Executor;
    use crate::integration::testintegration::TestIntegration;
    use crate::task::runconfig::RunConfig;
    use crate::task::task::{ KillReason, TaskResult };

    #[test]
    pub fn test_slots() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg1 = RunConfig::new(Some(x.new_slot(true)),3,None);
        let cfg2 = RunConfig::new(None,3,None);
        let cfg3 = RunConfig::new(Some(x.new_slot(true)),3,None);
        let cfg4 = RunConfig::new(Some(x.new_slot(false)),3,None);
        let mut handles = vec![];
        for i in 0..6 {
            let cfg = match i {
                0 => &cfg1,
                1 => &cfg2,
                2 => &cfg1,
                3 => &cfg3,
                _ => &cfg4
            };
            let name = format!("name-{}",i);
            let agent = x.new_agent(cfg,&name);
            let agent2 = agent.clone();
            let step = async move {
                agent2.tick(1).await;
                let agent3 = agent2.clone();
                agent2.named_wait(async move {
                    agent3.tick(1).await;
                },"test").await;
            };
            handles.push(x.add(step,agent));
        }
        x.tick(1.);
        assert_eq!(vec![TaskResult::Killed(KillReason::NotNeeded),
                        TaskResult::Ongoing,TaskResult::Ongoing,TaskResult::Ongoing,
                        TaskResult::Ongoing,
                        TaskResult::Killed(KillReason::NotNeeded)],
                    handles.iter().map(|x| x.task_state()).collect::<Vec<_>>());
    }

    #[allow(unused_must_use)]
    #[test]
    pub fn test_slot_wait() {
        let integration = TestIntegration::new();
        let mut x = Executor::new(integration.clone());
        let cfg = RunConfig::new(Some(x.new_slot(true)),3,None);
        let flag = Arc::new(Mutex::new(false));
        let agenta = x.new_agent(&cfg,"A");
        let agenta2 = agenta.clone();
        let flag2 = flag.clone();
        let stepa = async move {
            let agenta3 = agenta2.clone();
            agenta2.tidy(async move {
                agenta3.tick(1).await;
                assert!(!*flag2.lock().unwrap());
                ()
            });
            agenta2.tick(10).await;
        };
        x.add(stepa,agenta);
        x.tick(1.);
        let agentb = x.new_agent(&cfg,"B");
        let agentb2 = agentb.clone();
        let stepb = async move {
            *flag.lock().unwrap() = true;
            agentb2.tick(10).await;
        };
        x.add(stepb,agentb);
        for _ in 0..20 {
            x.tick(1.);
        }
    }
}
