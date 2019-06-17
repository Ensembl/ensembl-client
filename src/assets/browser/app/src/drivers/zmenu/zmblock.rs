use std::collections::{ HashMap, HashSet };
use std::iter::Peekable;
use std::str::Chars;

#[derive(Clone,Debug)]
enum ZMenuText {
    Fixed(String),
    Template(String)
}

#[derive(Clone)]
enum ZMenuTag {
    Text(ZMenuText),
    MarkupOn(String),
    MarkupOff(String)
}

#[derive(Clone,Debug)]
struct ZMenuItem {
    text: ZMenuText,
    markup: Vec<String>
}

impl ZMenuItem {
    fn new(text: ZMenuText, markup: Vec<String>) -> ZMenuItem {
        ZMenuItem { text, markup }
    }
}

fn push_fixed(out: &mut Vec<ZMenuTag>, fixed: &mut String) {
    if fixed.len() > 0 {
        out.push(ZMenuTag::Text(ZMenuText::Fixed(fixed.to_string())));
        fixed.clear();
    }
}

fn get_tag(chars: &mut Peekable<Chars>, term: char) -> String {
    let mut out = String::new();
    let mut bs = false;
    loop {
        if let Some(c) = chars.next() {
            if bs {
                out.push(c);
                bs = false;
            } else if c == term {
                break;
            } else if c == '\\' {
                bs = true;
            } else {
                out.push(c);
            }
        } else {
            break;
        }
    }
    out
}

fn fmt_parse_block(chars: &mut Peekable<Chars>) -> Vec<ZMenuTag> {
    let mut out = Vec::new();
    let mut bs = false;
    
    let mut fixed = String::new();
    while let Some(c) = chars.peek() {
        if bs {
            fixed.push(chars.next().unwrap());
            bs = false;
        } else if c == &'{' {
            push_fixed(&mut out,&mut fixed);
            chars.next();
            out.push(ZMenuTag::Text(ZMenuText::Template(get_tag(chars,'}'))));
        } else if c == &'<' {
            push_fixed(&mut out,&mut fixed);
            chars.next();
            if chars.peek() == Some(&'/') {
                chars.next();
                out.push(ZMenuTag::MarkupOff(get_tag(chars,'>')));
            } else {
                out.push(ZMenuTag::MarkupOn(get_tag(chars,'>')));
            }
        } else if c == &']' {
            break;
        } else if c == &'\\' {
            bs = true;
        } else {
            fixed.push(chars.next().unwrap());
        }
    }
    push_fixed(&mut out,&mut fixed);
    out
}

#[derive(Debug)]
struct ZMenuBlock {
    items: Vec<ZMenuItem>
}

impl ZMenuBlock {
    fn make_items(tags: Vec<ZMenuTag>) -> Vec<ZMenuItem> {
        let mut markup = HashSet::new();
        let mut items = Vec::new();
        for tag in tags {
             match tag {
                ZMenuTag::Text(text) => {
                    let markup_vec = markup.iter().cloned().collect();
                    items.push(ZMenuItem::new(text.clone(),markup_vec));
                },
                ZMenuTag::MarkupOn(m) => {
                    markup.insert(m.to_string());
                },
                ZMenuTag::MarkupOff(m) => {
                    markup.remove(&m);
                }
            }
        }
        items
    }
        
    fn new(chars: &mut Peekable<Chars>) -> ZMenuBlock {
        ZMenuBlock {
            items: ZMenuBlock::make_items(fmt_parse_block(chars))
        }
    }
}

#[derive(Debug)]
enum ZMenuSequence {
    Item(ZMenuBlock),
    LineBreak
}

#[derive(Debug)]
pub struct ZMenuFeatureTmpl {
    items: Vec<ZMenuSequence>
}

fn fmt_parse_feature(spec: &str) -> Vec<ZMenuSequence> {
    let mut chars = spec.chars().peekable();
    let mut out = Vec::new();
    while let Some(c) = chars.next() {
        if c == '[' {
            out.push(ZMenuSequence::Item(ZMenuBlock::new(&mut chars)));
            chars.next(); // ]
        } else if c == '/' {
            out.push(ZMenuSequence::LineBreak);
        }
    }
    out
}

impl ZMenuFeatureTmpl {
    pub fn new(spec: &str) -> ZMenuFeatureTmpl {
        ZMenuFeatureTmpl {
            items: fmt_parse_feature(spec)
        }
    }    
}
