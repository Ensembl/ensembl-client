mod base;
mod common;
#[cfg(not(deploy))]
mod bigscience;
#[cfg(not(deploy))]
mod text;
#[cfg(not(deploy))]
mod leafcard;

pub use debug::testcards::base::{ select_testcard };
#[cfg(not(deploy))]
pub use debug::testcards::bigscience::{ bs_source_main, bs_source_sub };
#[cfg(not(deploy))]
pub use self::leafcard::leafcard_source;

#[cfg(not(deploy))]
pub use self::text::text_source;
