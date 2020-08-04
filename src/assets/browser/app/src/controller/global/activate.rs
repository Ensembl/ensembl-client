use dom::domutil;

use dom::event::{ 
    EventListener, EventControl, EventType, EventData, 
    Target, IMessageEvent
};

pub struct ReadyPingPongListener {
}

impl EventListener<()> for ReadyPingPongListener {    
    fn receive(&mut self, _el: &Target,  e: &EventData, _idx: &()) {
        match e {
            EventData::MessageEvent(_,_,c) => {
                let data = &c.data().unwrap();
                if data["type"] == "bpane-ready-query" {
                    domutil::send_post_message("bpane-ready",&json!{{
                        "action": "genome_browser_ready"
                    }});
                }
            },
            _ => ()
        };
    }
}

pub fn activate() {
    /* old-style activation. Harmless but can be removed when new protocol is in use on react end */
    let body = domutil::query_selector_ok_doc("body","Cannot find body element");
    domutil::add_attr(&body,"class","browser-app-ready");
    domutil::remove_attr(&body.into(),"class","browser-app-not-ready");
    /* new-style activation */
    let pingpong = ReadyPingPongListener{};
    let mut ec = EventControl::new(Box::new(pingpong),());
    ec.add_event(EventType::MessageEvent);
    domutil::send_post_message("bpane-ready",&json!{{}});
}
