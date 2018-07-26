// We keep these separate from the other utils partly because these imports
// are very hairy.

use stdweb::web::{
    document,
    Element,
    IParentNode
};

pub fn query_select(sel: &str) -> Element {
    document().query_selector(sel).unwrap().unwrap()
}
