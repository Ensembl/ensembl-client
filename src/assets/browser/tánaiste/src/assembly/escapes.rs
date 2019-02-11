use std::collections::HashMap;

lazy_static! {
    static ref ESCAPES : Vec<(char,char)> = vec! {
        ('\x07','a'), ('\x08','b'), ('"','"'),
        ('\t','t'),  ('\n','n'),   ('\x0b','v'),
        ('\x0c','f'),('\r','r'),   ('\\','\\'), 
    };
}

lazy_static! {
    static ref UNIX_ESCAPES : HashMap<char,char> = {
        let mut map = HashMap::<char,char>::new();
        for (k,v) in ESCAPES.iter() { map.insert(*k,*v); }
        map
    };
    static ref UNIX_UNESCAPES : HashMap<String,char> = {
        let mut map = HashMap::<String,char>::new();
        for (k,v) in ESCAPES.iter() { map.insert(v.to_string(),*k); }
        map
    };
}

pub fn string_escape(s: &str, unicode: bool) -> String {
    let mut out = Vec::<char>::new();
    for c in s.chars() {
        if let Some(v) = UNIX_ESCAPES.get(&c) {
            out.push('\\');
            out.push(*v);
        } else if  (c as u32) < 0x20  || 
                   (c as u32) == 0x7F ||
                  ((c as u32) > 0x7F && unicode) {
            let mut x = [0;4];
            let s = c.encode_utf8(&mut x).len();
            for i in 0..s {
                out.push('\\');
                let v = format!("{:03o}",x[i] as u32);
                out.append(&mut v.chars().collect());
            }
        } else {
            out.push(c);
        }
    }
    out.iter().collect()
}

fn add_as_utf8(v: &mut Vec<u8>,c: char) {
    let mut x = [0;4];
    let s = c.encode_utf8(&mut x).len();
    v.extend_from_slice(&x[0..s]);
}

pub fn string_unescape(s: &str) -> Result<String,String> {
    let mut error = None;
    let mut out = Vec::<u8>::new();
    let mut bs_num = 0;
    let mut bs_val = String::new();
    for c in s.chars() {
        if bs_num > 0 {
            /* we're collecting backslash sequence */
            bs_val.push(c);
            bs_num -= 1;
            if bs_num == 0 {
                if bs_val.len() == 1 {
                    /* we're done collecting \x */
                    if let Some(v) = UNIX_UNESCAPES.get(&bs_val) {
                        /* unix escape */
                        add_as_utf8(&mut out,*v);
                        bs_val.clear();
                    } else if bs_val.chars().next().unwrap().is_digit(8) {
                        /* octal escape, collect more, to \xxx */
                        bs_num = 2;
                    } else {
                        error = Some(format!("Unknown escape sequence \\{}",bs_val));
                        break;
                    }
                } else if bs_val.len() == 3 {
                    /* we're done collecting \xxx */
                    match u8::from_str_radix(&bs_val,8) {
                        Ok(v) => { out.push(v); },
                        Err(e) => {
                            error = Some(format!("decoding \\{}: {}", 
                                            bs_val,e));
                            break;
                        }
                    };
                    bs_val.clear();
                }
            }
        } else if c == '\\' {
            /* start collecting backslash sequence */
            bs_num = 1;
        } else {
            /* normal character! */
            add_as_utf8(&mut out,c);
        }
    }
    if bs_num > 0 {
        error = Some("Unterminated escape sequence".to_string());
    }
    if let Some(e) = error {
        Err(e)
    } else {
        match String::from_utf8(out) {
            Ok(s) => Ok(s),
            Err(e) => Err(format!("bad utf8: {}",e))
        }
    }
}

#[cfg(test)]
mod test {
    use super::{ string_escape, string_unescape };
    
    #[test]
    fn escapes() {
        assert_eq!(string_escape("hi",true),"hi");
        assert_eq!(string_escape("hi\n",true),"hi\\n");
        assert_eq!(string_escape("á\x7F\0\n",false),"á\\177\\000\\n");
        assert_eq!(string_escape("á\x7F\0\n",true),"\\303\\241\\177\\000\\n");
        assert_eq!(string_unescape("hi").ok().unwrap(),"hi");
        assert_eq!(string_unescape("hi\\n").ok().unwrap(),"hi\n");
        assert_eq!(string_unescape("á\\177\\000\\n").ok().unwrap(),"á\x7F\0\n");
        assert_eq!(string_unescape("\\303\\241\\n").ok().unwrap(),"á\n");
        assert_eq!(string_unescape("\\x").err().unwrap(),"Unknown escape sequence \\x");
        assert_eq!(string_unescape("\\799").err().unwrap(),"decoding \\799: invalid digit found in string");
        assert_eq!(string_unescape("\\241\\303").err().unwrap(),"bad utf8: invalid utf-8 sequence of 1 bytes from index 0");
        assert_eq!(string_unescape("\\").err().unwrap(),"Unterminated escape sequence");
    }
}
