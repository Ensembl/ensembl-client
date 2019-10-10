#![feature(vec_remove_item)]

extern crate serde_json;
extern crate owning_ref;

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

pub mod zhoosh {
    mod ops;
    mod runner;
    mod shapes;
    mod state;
    mod step;
    mod zhoosh;

    #[cfg(test)]
    mod test;

    pub use self::ops::{
        ZhooshOps, ZhooshBangOps,
        ZHOOSH_LINEAR_F64_OPS, ZHOOSH_LINEAR_F32_OPS, ZHOOSH_LINEAR_I64_OPS, ZHOOSH_LINEAR_I32_OPS, ZHOOSH_LINEAR_U64_OPS, ZHOOSH_LINEAR_U32_OPS,
        ZHOOSH_PROP_F64_OPS, ZHOOSH_PROP_F32_OPS, ZHOOSH_PROP_I64_OPS, ZHOOSH_PROP_I32_OPS, ZHOOSH_PROP_U64_OPS, ZHOOSH_PROP_U32_OPS,
        ZHOOSH_EMPTY_OPS
    };
    pub use self::runner::{ ZhooshStepHandle, ZhooshSequence, ZhooshRunner };
    pub use self::shapes::ZhooshShape;
    pub use self::step::{ ZhooshStep, zhoosh_empty_step };
    pub use self::zhoosh::Zhoosh;
}
