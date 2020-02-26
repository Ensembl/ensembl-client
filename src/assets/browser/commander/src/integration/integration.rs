/* An integration must be supplied to the Executor at construction. This provides
 * the minimal services required by the Executor to function correctly. The sleep
 * method instructs the poller that it should sleep for a given time. Subesquent
 * calls supersede previous.
 *
 * None indicates that the executor wishes to be called again at the next poll.
 * Time indicates that the given number of time units may be waited for before 
 *   recalling.
 * Forever indicates that the executor does not wish to be called (until another
 *   call to sleep countermanding this).
 */

/// How long an integration may hold off polling until further notice.
/// 
/// Used in `Integration.sleep()` to indicate how long polling may be suspended.
#[derive(PartialEq,Clone,Debug)]
pub enum SleepQuantity {
    /// Do not suspend. Carry on polling.
    None,
    /// Polling may be suspnded for time given (in integration time units).
    Time(f64),
    /// Polling may be suspended indefinitely (until this method is called again).
    Forever
}

/// The integration needs to provide these methods to the executor.
pub trait Integration : Send {
    /// What is the current time? (in units of your choosing).
    fn current_time(&self) -> f64;
    /// You may suspend polling for the given period.
    /// 
    /// See `SleepQuantity` for details.
    fn sleep(&self, amount: SleepQuantity);
}
