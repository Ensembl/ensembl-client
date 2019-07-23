include!(concat!(env!("OUT_DIR"), "/thisbuild.rs"));

pub const API_VERSION: u32 = 1;

use util::get_instance_id;

pub fn build_summary() -> String {
    format!(r##"BROWSER APP BUILD SUMMARY
Built by {} in {} on {} on {}
Git version {}
Local changes list: {}
deploy={} console={} instance_id={} API_VERSION={}
{}
"##,
            VERSION_USER,VERSION_DIR,VERSION_HOSTNAME,VERSION_DATE,
            VERSION_GIT,VERSION_CHANGES,
            cfg!(deploy),cfg!(console),
            API_VERSION,
            get_instance_id(),
            VERSION_POM
            )
}
