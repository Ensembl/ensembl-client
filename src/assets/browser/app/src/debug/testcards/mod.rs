mod common;
mod bigscience;
mod polar;
mod text;
mod leafcard;
mod closuresource;
mod debugsource;
mod base;
mod rulergenerator;

pub use debug::testcards::base::{ debug_stick_manager, testcard_base };
pub use debug::testcards::debugsource::{ DebugSource, DebugStickManager };
pub use debug::testcards::base::DebugSourceManager;
pub use debug::testcards::bigscience::{ bs_source_main, bs_source_sub };
pub use debug::testcards::polar::polar_source;
pub use debug::testcards::rulergenerator::RulerGenerator;
