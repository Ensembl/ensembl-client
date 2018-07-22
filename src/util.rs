// This common Rust macro is a shortcut to clone all its first list of
// arguments before evaluating the second argument
macro_rules! enclose {
    ( ($( $x:ident ),*) $y:expr ) => {
        {
            $(let $x = $x.clone();)*
            $y
        }
    };
}

