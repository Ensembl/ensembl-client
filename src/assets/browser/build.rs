extern crate webgl_generator;
extern crate regex;

use webgl_generator::*;
use std::env;
use std::fs::{ read, write, File };
use std::io::Write;
use std::path::*;
use std::process::Command;
use regex::{ Regex, Captures };

#[allow(unused)]
fn to_console(s: &str) {
    let mut tty = File::create("/dev/tty").unwrap();
    tty.write_all(s.as_bytes()).ok();
}

fn command_output(c: &Captures) -> String {
    let mut cmd = Command::new("bash");
    let cmd2 = cmd.arg("-c").arg(&c[1]);
    let stdout = cmd2.output().unwrap().stdout;
    String::from_utf8(stdout).unwrap().trim().replace("\n"," // ")
}

fn main() {    
    /* stdweb */
    let dest = env::var("OUT_DIR").unwrap();
    let mut file = File::create(&Path::new(&dest).join("webgl_rendering_context.rs")).unwrap();

    Registry::new(Api::WebGl, Exts::NONE)
        .write_bindings(StdwebGenerator, &mut file)
        .unwrap();
        
    /* embed build-time / git commit */
    let tmpl = String::from_utf8(read("thisbuild.rs.tmpl").unwrap()).unwrap();
    let cmd_re = Regex::new(r"@(.*?)@").unwrap();
    let out = cmd_re.replace_all(&tmpl,command_output);
    write(&Path::new(&dest).join("thisbuild.rs"),out.as_bytes()).ok();
    to_console(&out);
}
