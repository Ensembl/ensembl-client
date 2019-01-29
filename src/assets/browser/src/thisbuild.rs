include!(concat!(env!("OUT_DIR"), "/thisbuild.rs"));

pub fn build_summary() -> String {
    format!(r##"BROWSER APP BUILD SUMMARY
Built by {} on {} on {}
Git version {}
Local changes list: {}
"##,
            VERSION_USER,VERSION_HOSTNAME,VERSION_DATE,
            VERSION_GIT,VERSION_CHANGES)
}
