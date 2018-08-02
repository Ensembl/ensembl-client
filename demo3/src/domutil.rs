// We keep these separate from the other utils partly because these imports
// are very hairy.

use stdweb::web::{
    document,
    Element,
    IElement,
    IParentNode
};

pub fn query_select(sel: &str) -> Element {
    document().query_selector(sel).unwrap().unwrap()
}

pub fn add_attr(el: &Element,key: &str, more: &str) {
    let val = match el.get_attribute(key) {
        Some(x) => x,
        None => "".to_string(),
    } + " " + more;
    js! { console.log(@{&el},@{&val}); };
    el.set_attribute(key,&val).ok();
}

pub fn add_class(el: &Element, klass: &str) {
    add_attr(el,"class",klass);
}

pub fn add_style(el: &Element, key: &str, value: &str) {
    add_attr(el,"style",&format!("{}: {};",key,value));
}
