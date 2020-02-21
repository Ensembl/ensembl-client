/* Task contains various auxilliary datastructures visible outside the
 * crate to describe task status.
 * 
 * TaskSummary provides a ps-like summary of ongoing tasks.
 * TaskResult is an enum which gives the result state of the task.
 * KillReason is an enum which gives a reason the task was killed.
 */

/// Summary of a given running task.
/// 
/// For diagnostics. The equivalent of a row in ps, top, TaskManager, etc.
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

    /// Retrieve unique identity (which is never reused).
    pub fn identity(&self) -> u64 { self.identity }

    /// Get current name of task.
    pub fn get_name(&self) -> &str { &self.name }

    /// Get name of any current "waits".
    pub fn get_waits(&self) -> &Vec<String> { &self.waits }

    /// Compose contents of this object into a text line, for logging etc.
    pub fn make_line(&self) -> String {
        format!("[{}] '{}' [{}]",self.identity,self.name,self.waits.join(","))
    }
}

/// Reason a task was killed (rather than being ongoing or finishing normally).
/// 
/// Note that these reasons can also be passed by calls to `TaskHandle` and `Agent`, so beware of assuming too much
/// based on their intended and automatic uses.
#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum KillReason {
    /// The task timer expired.
    Timeout,
    /// Only used manually. Exists to allow an unambiguous manual invocation.
    Cancelled,
    /// Not needed following slot being occupied by another task.
    NotNeeded
}

/// What happened to a task in the end.
#[cfg_attr(test,derive(Debug))]
#[derive(Clone,PartialEq,Eq)]
pub enum TaskResult {
    /// The task has not yet finished.
    Ongoing,
    /// The task finished normally and yielded a result.
    Done,
    /// The task was killed by a signal.
    Killed(KillReason)
}
