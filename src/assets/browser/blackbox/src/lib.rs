extern crate hashbrown;
#[macro_use]
extern crate serde_json;

mod diagnostic;

mod model {
    pub(crate) mod record {
        pub(crate) mod record;
        pub(crate) mod logrecord;
        pub(crate) mod datasetrecord;
        pub(crate) mod elapsedrecord;
        pub(crate) mod metronomerecord;
        pub(crate) mod countrecord;
    }
    pub(crate) mod model;
    pub(crate) mod stream;
}

use crate::model::record::{
    record::Record,
    logrecord::LogRecord,
    elapsedrecord::ElapsedRecord,
    metronomerecord::MetronomeRecord,
    countrecord::CountRecord
};

use crate::model::stream::Stream;
use crate::model::model::Model;
