use super::BlackBoxDriverImpl;

pub struct NullBlackBoxDriverImpl {}

impl NullBlackBoxDriverImpl {
    pub fn new() -> NullBlackBoxDriverImpl {
        NullBlackBoxDriverImpl {}
    }
}

impl BlackBoxDriverImpl for NullBlackBoxDriverImpl {
}
