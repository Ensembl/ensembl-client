use std::sync::{ Mutex, Arc };
use std::rc::Rc;
use std::cell::RefCell;

use stdweb::web::{ IEventTarget, Element, HtmlElement };
use stdweb::traits::IEvent;
use stdweb::web::event::{ ClickEvent, ChangeEvent };
use stdweb::web::html_element::SelectElement;
use stdweb::unstable::TryInto;

use global::Global;
use dom::domutil;
use dom::event::{ EventListener, EventControl, EventType, EventListenerHandle, EventKiller, EventData };
use debug::testcards;
use debug::pane::console::DebugConsole;
use debug::pane::buttons::{ DebugButtons, ButtonAction };

pub struct BodyEventListener {
    val: u32,
}

impl BodyEventListener {
    fn new() -> BodyEventListener {
        BodyEventListener {
            val: 0
        }
    }
}

impl EventListener<()> for BodyEventListener {    
    fn receive(&mut self, el: &Element, ev: &EventData, _p: &()) {
        self.val += 1;
        debug!("test event","{} {:?} {:?}",self.val,el,ev);
    }
}

pub struct DebugPanel {
    pub console: DebugConsole,
    pub buttons: DebugButtons,
    bodyev: EventControl<()>,
}

impl DebugPanel {
    pub fn new() -> Rc<RefCell<DebugPanel>> {
        debug!("global","new debug panel");
        debug!("debug panel","new debug panel");
        let out = Rc::new(RefCell::new(DebugPanel {
            console: DebugConsole::new(),
            bodyev: EventControl::new(),
            buttons: DebugButtons::new(None)
        }));
        {
            let rc = &mut out.borrow_mut();
            rc.buttons = DebugButtons::new(Some(&mut out.clone()));
            let el = EventListenerHandle::new(Box::new(BodyEventListener::new()));
            rc.bodyev.add_event(EventType::KeyPressEvent,&el);
            rc.bodyev.add_event(EventType::ClickEvent,&el);
            rc.bodyev.add_event(EventType::CustomEvent("custom".to_string()),&el);
            rc.bodyev.add_element(&mut EventKiller::new(),&domutil::query_select("body"),());

            rc.add_event();
        }
        out
    }
        
    fn add_event(&mut self) {
        let sel_el = domutil::query_select("#console .folder");
        sel_el.add_event_listener(|e: ChangeEvent| {
            let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
            if let Some(name) = node.value() {
                debug_panel_select(&name);
            }
        });
    }
}

const STAGE : &str = r##"
<div id="bpane-container">
    <div id="bpane-canv">
        <h1>Debug Mode</h1>
    </div>
    <div id="bpane-right">
        <div id="console">
            <select class="testcard">
                <option value="">- testcards -</option>
                <option value="draw">Draw Testcard</option>
                <option value="onoff">On/Off Testcard</option>
                <option value="button">Button Testcard</option>
            </select>
            <select class="folder"></select>
            <button class="mark">mark!</button>
            <pre class="content"></pre>
        </div>
        <div class="buttons"></div>
        <div id="managedcanvasholder"></div>
    </div>
</div>
"##;

const STAGE_CSS : &str = r##"
html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
#bpane-container {
    display: flex;
    height: 100%;
}
#bpane-right {
    width: 20%;
}


#console .content {
    height: 85%;
    overflow: scroll;
    border: 1px solid #ccc;
}

#managedcanvasholder {
    display: block;
    border: 2px solid red;
    display: inline-block;
    overflow: scroll;
    width: 100%;
}

#bpane-canv canvas {
    height: 100%;
    width: 100%;
}

#bpane-canv {
    width: 80%;
    height: 100%;
}

#bpane-canv canvas {
    width: 100%;
    height: 100%;
}

#stage {
    height: 100%;
}

#console {
    height: 50%;
}
@import url('https://fonts.googleapis.com/css?family=Roboto');
"##;

thread_local! {
    static CANVAS_INST : RefCell<u32> = RefCell::new(0);
    static DEBUG_PANEL : RefCell<Option<Rc<RefCell<DebugPanel>>>> = RefCell::new(None);
}

fn setup_testcard(name: &str) {
    debug!("global","setup testcard {}",name);
    let pane_el: HtmlElement = domutil::query_select("#bpane-canv").try_into().unwrap();
    let g = Arc::new(Mutex::new(Global::new(&pane_el)));
    if name.len() > 0 {
        let inst_s = g.lock().unwrap().reset();
        testcards::testcard(g,name,&inst_s);
    } else {
        domutil::inner_html(&pane_el.into(),"");
    }
}

fn setup_events() {
    let sel_el = domutil::query_select("#console .testcard");
    sel_el.add_event_listener(|e: ChangeEvent| {
        let node : SelectElement = e.target().unwrap().try_into().ok().unwrap();
        if let Some(name) = node.value() {
            debug_panel_buttons_clear();
            setup_testcard(&name);
        }
    });
    let mark_el = domutil::query_select("#console .mark");
    mark_el.add_event_listener(|_e: ClickEvent| {
        debug_panel_entry_mark();
    });
}

pub fn setup_stage_debug() {
    domutil::inner_html(&domutil::query_select("#stage"),STAGE);
    let el = domutil::append_element(&domutil::query_select("head"),"style");
    domutil::inner_html(&el,STAGE_CSS);
    DEBUG_PANEL.with(|p| {
        *p.borrow_mut() = Some(DebugPanel::new());
    });
    setup_events();
}

fn panel_op(cb: &mut FnMut(&mut DebugPanel) -> ()) {
    DEBUG_PANEL.with(|p| {
        if let Some(ref po) = *p.borrow_mut() {
            let mut panel = po.borrow_mut();
            cb(&mut panel);
        }
    })
}

#[allow(dead_code)]
pub fn debug_panel_entry_reset(name: &str) {
    panel_op(&mut |p| p.console.get_entry(name).reset())
}

pub fn debug_panel_entry_mark() {
    panel_op(&mut |p| p.console.mark())
}

pub fn debug_panel_entry_add(name: &str, value: &str) {
    panel_op(&mut |p| p.console.debug(name,value))
}

pub fn debug_panel_select(name: &str) {
    panel_op(&mut |p| p.console.select(name))
}

pub fn debug_panel_buttons_clear() {
    panel_op(&mut |p| {
        p.buttons.clear_buttons();
        p.buttons.render_buttons();
    });
}

pub fn debug_panel_button_add(name: &str, cb: Rc<RefCell<ButtonAction>>) {
    DEBUG_PANEL.with(|p| {
        if let Some(ref po) = *p.borrow_mut() {
            let mut panel = po.borrow_mut();
            panel.buttons.add_button(name,cb);
            panel.buttons.render_buttons();
        }
    })
}
