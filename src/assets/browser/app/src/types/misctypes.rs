pub enum AdLib {
    Never,
    AsRequired,
    Always
}

impl AdLib {
    pub fn go(&self, required: bool) -> bool {
        match self {
            AdLib::Never => false,
            AdLib::AsRequired => required,
            AdLib::Always => true
        }
    }
}