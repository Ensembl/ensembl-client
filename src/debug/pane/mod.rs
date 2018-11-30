mod debugstage;
mod console;
mod buttons;

pub use debug::pane::debugstage::{
    setup_testcards,
    setup_stage_debug,
    debug_panel_button_add,
    debug_panel_entry_add,
    debug_panel_entry_reset,
    DebugPanel,
};

pub use self::console::DebugConsole;

pub use debug::pane::buttons::{
    ButtonActionImpl
};
