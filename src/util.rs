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

macro_rules! hashmap_s {
    ($( $key: expr => $val: expr ),*) => {{
         let mut map = ::std::collections::HashMap::new();
         $( map.insert($key.to_string(), $val); )*
         map
    }}
}

macro_rules! vec_s {
    ($( $val: expr ),*) => {{
        let mut vec = ::std::vec::Vec::new();
        $( vec.push($val.to_string()); )*
        vec
    }}
}
