mod pane;
mod testcards;

pub use debug::pane::{
    DebugPanel,
    DebugConsole,
    setup_testcards,
    setup_stage_debug,
    debug_panel_button_add,
    debug_panel_entry_add,
    debug_panel_entry_reset,
};

pub use debug::testcards::{
    DebugComponentSource,
    debug_stick_manager,
    testcard_base
};
