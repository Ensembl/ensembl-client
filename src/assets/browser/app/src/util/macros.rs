// This common Rust macro is a shortcut to clone all its first list of
// arguments before evaluating the second argument
#[macro_export]
macro_rules! enclose {
    ( ($( $x:ident ),*) $y:expr ) => {
        {
            $(let $x = $x.clone();)*
            $y
        }
    };
}

#[allow(unused_macros)]
macro_rules! hashmap {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::std::collections::HashMap::new();
         $( map.insert($key, $val); )*
         map
    }}
}

#[allow(unused_macros)]
macro_rules! hashmap_s {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::std::collections::HashMap::new();
         $( map.insert($key.to_string(), $val); )*
         map
    }}
}

#[allow(unused_macros)]
macro_rules! vec_s {
    ($( $val: expr ),*) => {{
        let mut vec = ::std::vec::Vec::new();
        $( vec.push($val.to_string()); )*
        vec
    }}
}

macro_rules! console_error {
    ($($arg:tt)*) => {{
        let s = format!($($arg)*);
        js! { console.error(@{s}); };
    }}
}

macro_rules! console_force {
    ($($arg:tt)*) => {{
        let s = format!($($arg)*);
        js! { console.log(@{s}); };
    }}
}

macro_rules! console {
    ($($arg:tt)*) => {{
        if !cfg!(deploy) || cfg!(console) {
            console_force!($($arg)*);
        }
    }}
}

macro_rules! debug {
    ($k: expr, $($arg:tt)*) => {{
        if false {
            let s = format!($($arg)*);
            ::debug::debug_panel_entry_add($k,&s);
        }
    }}
}

macro_rules! expect {
    ($x: expr) => {{
        let s = format!("ENSEMBL ERROR LOCATION {}/{}/{}",file!(),line!(),column!());
        $x.expect(&s)
    }}
}

macro_rules! expectok {
    ($x: expr) => {{
        let s = format!("ENSEMBL ERROR LOCATION {}/{}/{}",file!(),line!(),column!());
        let x = $x;
        if let Err(ref msg) = x {
            console_error!("OK Failed: {}",&msg);
        }
        x.expect(&s)
    }}
}
