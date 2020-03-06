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

mod model {
    pub(crate) mod integration {
        pub(crate) mod integration;
        pub(crate) mod simpleintegration;
        pub(crate) mod trivialintegration;
    }

    pub(crate) mod record {
        pub(crate) mod record;
        pub(crate) mod logrecord;
        pub(crate) mod datasetrecord;
        pub(crate) mod elapsedrecord;
        pub(crate) mod metronomerecord;
        pub(crate) mod countrecord;
        pub(crate) mod valuerecord;
    }
    pub(crate) mod config;
    pub(crate) mod format;
    pub(crate) mod model;
    pub(crate) mod serialize;
    pub(crate) mod stream;
}

#[cfg(test)]
mod test {
    mod test;
    mod harness;
}

pub use crate::model::record::{
    record::Record,
    logrecord::LogRecord,
    datasetrecord::DatasetRecord,
    elapsedrecord::ElapsedRecord,
    metronomerecord::MetronomeRecord,
    countrecord::CountRecord,
    valuerecord::ValueRecord
};

pub use crate::model::config::Config;
pub use crate::model::format::Format;
pub use crate::model::integration::integration::Integration;
pub use crate::model::integration::simpleintegration::SimpleIntegration;
pub use crate::model::integration::trivialintegration::TrivialIntegration;
pub use crate::model::model::{ Model, time_sort };
pub use crate::model::serialize::{ records_to_lines, records_to_json };
pub use crate::model::stream::Stream;

pub use crate::api::globals::{
    blackbox_integration, blackbox_enable, blackbox_disable, blackbox_disable_all,
    blackbox_raw_on, blackbox_raw_off, blackbox_config, blackbox_take_records,
    blackbox_take_lines, blackbox_take_json, blackbox_push, blackbox_pop,
    blackbox_log, blackbox_count, blackbox_reset_count, blackbox_start, blackbox_end,
    blackbox_metronome, blackbox_is_enabled, blackbox_set_count, blackbox_model,
    blackbox_format, blackbox_clear, blackbox_use_threadlocals, blackbox_value
};
