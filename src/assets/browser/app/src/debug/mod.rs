mod blackbox;
mod support;

pub use crate::debug::support::{
    add_debug_sources, add_debug_sticks, DEBUG_SOURCES, DEMO_SOURCES
};

pub use crate::debug::blackbox::{ BlackboxSender, BlackboxIntegration };