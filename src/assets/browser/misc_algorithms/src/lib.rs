#![feature(vec_remove_item)]

extern crate serde_json;

pub mod marshal {
    mod json;

    pub use self::json::{
        json_str, json_array, json_obj_get, json_f64, json_bool
    };
}

pub mod store {
    mod bstartree;
    mod cache;

    pub use self::bstartree::{ BStarTree, BStarTreeWalker };
    pub use self::cache::Cache;
}

pub mod index {
    mod andwalker;
    mod notwalker;
    mod orwalker;
    mod simpleindex;
    mod walker;
    mod walkeriter;

    pub use self::andwalker::AndWalker;
    pub use self::notwalker::NotWalker;
    pub use self::orwalker::OrWalker;
    pub use self::walker::{ Walker, NullWalker };
    pub use self::walkeriter::WalkerIter;
    pub use self::simpleindex::SimpleIndex;
}
