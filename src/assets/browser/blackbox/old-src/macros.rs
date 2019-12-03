#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_log {
    ($stream:expr,$($arg:tt)*) => {{
        if ::blackbox::blackbox_is_enabled($stream) {
            let s = format!($($arg)*);
            ::blackbox::blackbox_report($stream,&s);
        }
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_log {
    ($stream:expr,$($arg:tt)*) => {}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_count {
    ($stream:expr,$name:expr,$amt:expr) => {{
        ::blackbox::blackbox_count($stream,$name,$amt,false);
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_count {
        ($stream:expr,$name:expr,$amt:expr) => {{}}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_count_set {
    ($stream:expr,$name:expr,$amt:expr) => {{
        ::blackbox::blackbox_count($stream,$name,$amt,true);
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_count_set {
        ($stream:expr,$name:expr,$amt:expr) => {{}}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_reset_count {
    ($stream:expr,$name:expr) => {{
        ::blackbox::blackbox_reset_count($stream,$name);
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_reset_count {
        ($stream:expr,$name:expr) => {{}}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_time {
    ($stream:expr,$code:block) => {{
        let tmp_bb_enabled = ::data::blackbox::blackbox_is_enabled($stream);
        let tmp_bb_start = if tmp_bb_enabled {
             Some(::dom::domutil::browser_time())
        } else {
            None
        };
        let ret = (|| { $code })();
        if tmp_bb_enabled {
            let tmp_bb_end = ::dom::domutil::browser_time();
            ::blackbox::blackbox_elapsed($stream,tmp_bb_end-tmp_bb_start.unwrap());
        }
        ret
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_time {
    ($stream:expr,$code:block) => {{
        $code
    }}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_time_if {
    ($stream:expr,$code:block) => {{
        let tmp_bb_enabled = ::data::blackbox::blackbox_is_enabled($stream);
        let tmp_bb_start = if tmp_bb_enabled {
             Some(::dom::domutil::browser_time())
        } else {
            None
        };
        let ret = (|| { $code })();
        if tmp_bb_enabled && ret {
            let tmp_bb_end = ::dom::domutil::browser_time();
            ::blackbox::blackbox_elapsed($stream,tmp_bb_end-tmp_bb_start.unwrap());
        }
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_time_if {
    ($stream:expr,$code:block) => {{
        $code
    }}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_metronome {
    ($stream:expr) => {{
        if ::data::blackbox::blackbox_is_enabled($stream) {
            let tmp_bb = ::dom::domutil::browser_time();
            ::blackbox::blackbox_metronome($stream,tmp_bb);
        }
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_metronome {
        ($stream:expr) => {{}}
}

#[macro_export]
#[cfg(blackbox)]
macro_rules! bb_stack {
    ($level:expr,$code:block) => {{
        ::blackbox::blackbox_push($level);
        let ret = (|| { $code })();
        ::blackbox::blackbox_pop();
        ret
    }}
}

#[macro_export]
#[cfg(not(blackbox))]
macro_rules! bb_stack {
    ($level:expr,$code:block) => {{
        $code
    }}
}
