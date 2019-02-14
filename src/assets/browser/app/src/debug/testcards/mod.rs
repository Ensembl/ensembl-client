mod common;
mod bigscience;
mod polar;
mod text;
mod leafcard;
mod march;
mod closuresource;
mod base;
mod rulergenerator;
mod tánaiste;

pub use debug::testcards::base::select_testcard;
pub use debug::testcards::bigscience::{ bs_source_main, bs_source_sub };
pub use self::leafcard::leafcard_source;
pub use debug::testcards::polar::polar_source;
pub use self::march::march_source;
pub use debug::testcards::rulergenerator::RulerGenerator;
pub use self::text::text_source;
pub use self::tánaiste::tá_source;
