use std::collections::HashMap;
use regex::Regex;

lazy_static! {
    static ref CUT_RE : Regex = Regex::new(r";;+\s+--cut--\s+\[(.*)\].*\n").ok().unwrap();
    pub static ref TEST_CODE : HashMap<String,String> = test_code();
}

fn test_code() -> HashMap<String,String> {
    let mut out = HashMap::<String,String>::new();
    let all = include_str!("test.tá");
    let mut start : Option<(String,usize)> = None;
    for m in CUT_RE.captures_iter(all) {
        let end = m.get(0).unwrap().start();
        if let Some((code,start)) = start {
            out.insert(code.to_string(),all[start..end].to_string());
        }
        let code = m.get(1).unwrap().as_str().to_string();
        start = Some((code,m.get(0).unwrap().end()+1));
    }
    if let Some((code,start)) = start {
        out.insert(code.to_string(),all[start..].to_string());
    }
    out
}
