mod debugstage;
mod console;
mod buttons;

pub use debug::pane::debugstage::{
    setup_testcards,
    debug_panel_button_add,
    debug_panel_entry_add,
    debug_panel_entry_reset,
    DebugPanel
};

pub use debug::pane::buttons::{
    ButtonActionImpl
};
