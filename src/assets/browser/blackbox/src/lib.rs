extern crate hashbrown;
#[macro_use]
extern crate lazy_static;
extern crate owning_ref;
#[macro_use]
extern crate serde_json;

#[macro_use]
mod api {
   pub(crate) mod globals;
   #[macro_use]
   pub(crate) mod macros;
}

mod integration {
    pub(crate) mod integration;
    pub(crate) mod nullintegration;
}

mod model {
    pub(crate) mod record {
        pub(crate) mod record;
        pub(crate) mod logrecord;
        pub(crate) mod datasetrecord;
        pub(crate) mod elapsedrecord;
        pub(crate) mod metronomerecord;
        pub(crate) mod countrecord;
    }
    pub(crate) mod format;
    pub(crate) mod model;
    pub(crate) mod stream;
    pub(crate) mod config;
}

#[cfg(test)]
mod test {
    mod test;
    mod harness;
}

pub use crate::model::record::{
    record::Record,
    logrecord::LogRecord,
    elapsedrecord::ElapsedRecord,
    metronomerecord::MetronomeRecord,
    countrecord::CountRecord
};


pub use crate::integration::integration::Integration;
pub use crate::integration::nullintegration::NullIntegration;
pub use crate::model::config::Config;
pub use crate::model::format::Format;
pub use crate::model::model::Model;
pub use crate::model::stream::Stream;

pub use crate::api::globals::{
    blackbox_integration, blackbox_enable, blackbox_disable, blackbox_disable_all,
    blackbox_raw_on, blackbox_raw_off, blackbox_config, blackbox_take_records,
    blackbox_take_lines, blackbox_take_json, blackbox_push, blackbox_pop,
    blackbox_log, blackbox_count, blackbox_reset_count, blackbox_start, blackbox_end,
    blackbox_metronome, blackbox_is_enabled, blackbox_set_count, blackbox_model,
    blackbox_format, blackbox_clear, blackbox_use_threadlocals
};
