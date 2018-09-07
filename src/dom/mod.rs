mod debugstage;
pub mod event; // XXX not pub, only during dev
pub mod domutil;

pub use dom::debugstage::{
    setup_stage_debug,
    debug_panel_button_add,
    debug_panel_entry_add,
    debug_panel_entry_reset,
};
