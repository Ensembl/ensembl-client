extern crate hashbrown;
#[macro_use]
extern crate lazy_static;
#[macro_use]
extern crate serde_json;
extern crate url;

pub mod macros;

mod model {
    mod bbreportstream;
    pub(super) mod blackbox;
    pub(super) mod blackboxstate;
}

mod drivers {
    mod blackboxdriver;
    mod nullblackboxdriver;

    pub use self::blackboxdriver::{ BlackBoxDriver, BlackBoxDriverImpl };
    pub use self::nullblackboxdriver::NullBlackBoxDriverImpl;
}

mod integration {
    pub(super) mod integration;
    mod nullintegration;

    pub use self::nullintegration::NullIntegration;
}

pub use self::integration::integration::Integration;

pub use crate::model::blackbox::{ 
    blackbox_report, blackbox_push, blackbox_pop,
    blackbox_tick, blackbox_elapsed, blackbox_metronome,
    blackbox_is_enabled, blackbox_count, blackbox_reset_count,
    blackbox_set_integration
};

pub use crate::drivers::{ BlackBoxDriver, NullBlackBoxDriverImpl };
pub use crate::model::blackboxstate::BlackBoxState;
