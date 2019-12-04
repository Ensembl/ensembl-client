/* Macros reduce time- and space-expending options to nothing when blackbox is not in use.
 * Unlike the rest of the blackbox code, they only do something when either "test" or 
 * "blackbox" is given as a compile option. Things which are not expected to be in the
 * critical path (eg setup, configs) don't have macros. There are a few diagnostics thrown
 * in here, though, which don't really need it, because all their "friends" are here and
 * it's best not to have too ocnfusing an API by having different access methods.
 */

/* logs */

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_log {
    ($stream:expr,$($arg:tt)*) => {{
        if $crate::blackbox_is_enabled($stream) {
            let s = format!($($arg)*);
            $crate::blackbox_log($stream,&s);
        }
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_log {
    ($stream:expr,$($arg:tt)*) => {}
}

/* stack */

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_stack {
    ($level:expr,$code:block) => {{
        $crate::blackbox_push($level);
        let ret = (|| { $code })();
        $crate::blackbox_pop();
        ret
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_stack {
    ($level:expr,$code:block) => {{
        $code
    }}
}

/* counts */

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_count {
    ($stream:expr,$name:expr,$amt:expr) => {{
        $crate::blackbox_count($stream,$name,$amt);
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_count {
        ($stream:expr,$name:expr,$amt:expr) => {{}}
}

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_set_count {
    ($stream:expr,$name:expr,$amt:expr) => {{
        $crate::blackbox_set_count($stream,$name,$amt);
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_set_count {
        ($stream:expr,$name:expr,$amt:expr) => {{}}
}

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_reset_count {
    ($stream:expr,$name:expr) => {{
        $crate::blackbox_reset_count($stream,$name);
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_reset_count {
        ($stream:expr,$name:expr) => {{}}
}

/* elapsed */

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_time {
    ($stream:expr,$name:expr,$code:block) => {{
        $crate::blackbox_start($stream,$name);
        let ret = (|| { $code })();
        $crate::blackbox_end($stream,$name);
        ret
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_time {
    ($stream:expr,$name:expr,$code:block) => {{
        $code
    }}
}

#[macro_export]
#[cfg(any(blackbox,test))]
macro_rules! blackbox_metronome {
    ($stream:expr,$name:expr) => {{
        $crate::blackbox_metronome($stream,$name);
    }}
}

#[macro_export]
#[cfg(not(any(blackbox,test)))]
macro_rules! blackbox_metronome {
        ($stream:expr,$name:expr) => {{}}
}
