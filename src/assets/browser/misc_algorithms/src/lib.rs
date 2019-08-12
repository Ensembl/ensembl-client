#![feature(vec_remove_item)]

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
    pub use self::walker::Walker;
    pub use self::walkeriter::WalkerIter;
    pub use self::simpleindex::SimpleIndex;
}
