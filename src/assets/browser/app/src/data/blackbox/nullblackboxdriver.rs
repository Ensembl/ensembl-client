use super::BlackBoxDriver;
use url::Url;

pub struct NullBlackBoxDriver {}

impl NullBlackBoxDriver {
    pub fn new() -> NullBlackBoxDriver {
        NullBlackBoxDriver {}
    }
}

impl BlackBoxDriver for NullBlackBoxDriver {
}
