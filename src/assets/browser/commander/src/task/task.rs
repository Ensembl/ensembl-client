/* Task contains various auxilliary datastructures visible outside the
 * crate to describe task status.
 * 
 * TaskSummary provides a ps-like summary of ongoing tasks.
 * TaskResult is an enum which gives the result state of the task.
 * KillReason is an enum which gives a reason the task was killed.
 */

#[cfg_attr(test,derive(Debug))]
#[derive(Clone)]
pub struct TaskSummary {
    identity: u64,
    name: String,
    waits: Vec<String>
}

impl TaskSummary {
    pub(crate) fn new(identity: u64, name: &str, waits: &Vec<String>) -> TaskSummary {
        TaskSummary {
            identity,
            name: name.to_string(),
            waits: waits.to_vec()
        }
    }

    pub fn identity(&self) -> u64 { self.identity }
    pub fn get_name(&self) -> &str { &self.name }
    pub fn get_waits(&self) -> &Vec<String> { &self.waits }

    pub fn make_line(&self) -> String {
        format!("[{}] '{}' [{}]",self.identity,self.name,self.waits.join(","))
    }
}

#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum KillReason {
    Timeout,
    Cancelled,
    NotNeeded
}

#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum TaskResult {
    Ongoing,
    Done,
    Killed(KillReason)
}
