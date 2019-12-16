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
         let mut map = ::hashbrown::HashMap::new();
         $( map.insert($key, $val); )*
         map
    }}
}

#[allow(unused_macros)]
macro_rules! hashmap_s {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::hashbrown::HashMap::new();
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

#[deprecated(note="use blackbox")]
macro_rules! console {
    ($($arg:tt)*) => {{
        if !cfg!(deploy) || cfg!(console) {
            console_force!($($arg)*);
        }
    }}
}

/* we'd like to use expect but constructing the format each time is too heavy */
macro_rules! unwrap {
    ($x: expr) => {{
        match $x {
            Some(v) => v,
            None => {
                panic!("ENSEMBL ERROR LOCATION {}/{}/{}",file!(),line!(),column!());
            }
        }
    }}
}

macro_rules! ok {
    ($x: expr) => {{
        match $x {
            Ok(v) => v,
            Err(ref msg) => {
                panic!("ENSEMBL ERROR LOCATION {}/{}/{}: {:?}",file!(),line!(),column!(),msg);
            }
        }
    }}
}
