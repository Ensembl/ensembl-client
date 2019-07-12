use dom::domutil;

pub fn activate() {
    /* old-style activation. Harmless but can be removed when new protocol is in use on react end */
    let body = domutil::query_selector_ok_doc("body","Cannot find body element");
    domutil::add_attr(&body,"class","browser-app-ready");
    domutil::remove_attr(&body.into(),"class","browser-app-not-ready");
    /* new-style activation */
    domutil::send_post_message("bpane-active",&json!{{}});
}
