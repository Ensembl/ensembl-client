// We keep these separate from the other utils partly because these imports
// are very hairy.

use stdweb::Value;
use serde_json::Value as JSONValue;
use stdweb::unstable::TryInto;
use stdweb::web::{
    document,
    Element,
    HtmlElement,
    IHtmlElement,
    IElement,
    IParentNode,
    INode
};
use types::{ CPixel, cpixel };

pub fn query_selector_new(sel: &str) -> Option<Element> {
    if let Some(Some(el)) = document().query_selector(sel).ok() {
        Some(el)
    } else {
        None
    }
}

pub fn query_selector(el: &Element, sel: &str) -> Element {
    el.query_selector(sel).unwrap().unwrap()
}

pub fn query_select(sel: &str) -> Element {
    document().query_selector(sel).unwrap().unwrap()
}

pub fn size(el: &HtmlElement) -> CPixel {
    let r = el.get_bounding_client_rect();
    cpixel(r.get_width() as i32,r.get_height() as i32)
}

pub fn add_attr(el: &Element,key: &str, more: &str) {
    let val = match el.get_attribute(key) {
        Some(x) => x,
        None => "".to_string(),
    } + " " + more;
    el.set_attribute(key,&val).ok();
}

pub fn add_style(el: &Element, key: &str, value: &str) {
    add_attr(el,"style",&format!("{}: {};",key,value));
}

pub fn inner_html(el: &Element, value: &str) {
    js! { @{el.as_ref()}.innerHTML = @{value} };
}

pub fn text_content(el: &Element, value: &str) {
    js! { @{el.as_ref()}.textContent = @{value} };
}

pub fn append_element(el: &Element, name: &str) -> Element {
    let doc = el.owner_document().unwrap();
    let new = doc.create_element(name).ok().unwrap();
    el.append_child(&new);
    new
}

pub fn scroll_to_bottom(el: &Element) {
    js! { @{el.as_ref()}.scrollTop = @{el.as_ref()}.scrollHeight; };
}

pub fn send_custom_event(el: &Element, name: &str, data: &JSONValue) {
    let v: Value = data.clone().try_into().unwrap();
    js! {
        var e = new CustomEvent(@{name},{ detail: @{&v}, bubbles: true });
        @{el.as_ref()}.dispatchEvent(e);
    };
}

pub fn clear_selection() {
    js! {
        var sel = window.getSelection ? window.getSelection() : document.selection;
        if (sel) {
            if (sel.removeAllRanges) {
                sel.removeAllRanges();
            } else if (sel.empty) {
                sel.empty();
            }
        }
    }
}
