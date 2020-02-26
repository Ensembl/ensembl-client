use crate::model::supply::SupplierChooser;

#[cfg(deploy)]
pub const DEBUG_SOURCES : [&str;0] = [];

#[cfg(not(deploy))]
pub const DEBUG_SOURCES : [&str;8] = [
    "internal:debug:gene-pc-fwd",
    "internal:debug:gene-other-fwd",
    "internal:debug:gene-pc-rev",
    "internal:debug:gene-other-rev",
    "internal:debug:variant",
    "internal:debug:contig",
    "internal:debug:gc",
    "internal:debug:zzz-framework"
];

pub const DEMO_SOURCES : [&str;10] = [
    "track:gene-feat",
    "track:gene-pc-fwd",
    "track:gene-other-fwd",
    "track:gene-pc-rev",
    "track:gene-other-rev",
    "track:variant",
    "track:contig",
    "track:gc",
    "track:zzz-framework",
    "track:zzz-framework:lhs"
];

pub fn add_debug_sources(s: &mut SupplierChooser, name: &str) {}
