#[derive(Clone)]
pub struct RunSlot { 
    identity: u64,
    push: bool
}

sequence!(IDENTITY);

impl RunSlot {
    pub(crate) fn new(push: bool) -> RunSlot {
        let identity = IDENTITY.next();
        RunSlot{ identity, push }
    }

    pub(crate) fn is_push(&self) -> bool { self.push }
}

hashable!(IDENTITY,RunSlot,identity);

#[cfg(test)]
#[allow(unused)]
mod test {
    use super::*;

    use crate::executor::Executor;
    use crate::runconfig::RunConfig;
    use crate::task::{ KillReason, TaskResult };
    use crate::testintegration::TestIntegration;

    #[test]
    pub fn test_slots() {
        let mut integration = TestIntegration::new();
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
            let agent = x.make_context(cfg,&name);
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
                    handles.iter().map(|x| x.peek_result()).collect::<Vec<_>>());
    }
}