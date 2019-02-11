#![feature(non_ascii_idents)]
#[macro_use]
extern crate lazy_static;

#[cfg(test)]
extern crate regex;

mod assembly;
mod commands;
mod core;
mod runtime;
mod util;

#[cfg(test)]
mod test;
