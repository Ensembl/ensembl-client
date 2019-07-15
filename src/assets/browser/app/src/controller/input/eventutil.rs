use stdweb::unstable::TryInto;
use dom::domutil;
use serde_json::Value as JSONValue;
use stdweb::web::{ Element, HtmlElement };

pub fn extract_element(j: &JSONValue, el: Option<Element>) -> Option<HtmlElement> {
    if let Some(obj) = j.as_object() {
        if let Some(sel_value) = obj.get("selector") {
            if let JSONValue::String(sel_str) = sel_value {
                return domutil::query_selector_new(sel_str);
            }
        }
    }
    if let Some(el) = el {
        console!("fallback");
        return el.clone().try_into().ok();
    }
    None
}
