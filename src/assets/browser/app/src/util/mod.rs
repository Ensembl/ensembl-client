#[macro_use]
mod macros;

mod changedetect;
mod rulergenerator;
mod smallest;
mod text;
mod thisbuild;
mod thisinstance;
mod valuestore;

pub use self::changedetect::ChangeDetect;
pub use self::rulergenerator::RulerGenerator;
pub use self::smallest::Smallest;
pub use self::text::truncate;
pub use self::thisbuild::{ build_summary, API_VERSION };
pub use self::thisinstance::{ set_instance_id, get_instance_id };
pub use self::valuestore::ValueStore;
