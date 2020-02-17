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

#[derive(PartialEq,Clone)]
#[cfg_attr(test,derive(Debug))]
pub enum SleepQuantity {
    None,
    Time(f64),
    Forever
}

pub trait Integration : Send {
    fn current_time(&mut self) -> f64;
    fn sleep(&self, amount: SleepQuantity);
}
