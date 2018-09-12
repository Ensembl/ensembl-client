use std::collections::hash_map::Entry;
use std::collections::HashMap;
use std::sync::{ Mutex, Arc };
use std::rc::Rc;
use std::cell::RefCell;
use serde_json::Value as JSONValue;

use stdweb::web::{ IEventTarget, Element, HtmlElement };
use stdweb::traits::IEvent;
use stdweb::web::event::{ ClickEvent, ChangeEvent };
use stdweb::web::html_element::SelectElement;
use stdweb::unstable::TryInto;

use global::Global;
use dom::domutil;
use dom::event::{ EventListener, EventControl, EventType, EventListenerHandle, EventKiller, EventData, ICustomEvent };
use debug::testcards;
use debug::pane::console::{ DebugFolderEntry, DebugConsole };
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

pub struct DebugConsole2Impl {
    el: Element,
    folder: HashMap<String,DebugFolderEntry>,
    selected: Option<String>,
    refresh: bool
}

impl DebugConsole2Impl {
    pub fn new(el: &Element) -> DebugConsole2Impl {
        DebugConsole2Impl {
            el: el.clone(),
            folder: HashMap::<String,DebugFolderEntry>::new(),
            selected: None,
            refresh: false
        }
    }
    
    fn entry(&mut self, k: &str) -> &mut DebugFolderEntry {
        match self.folder.entry(k.to_string()) {
            Entry::Occupied(e) => e.into_mut(),
            Entry::Vacant(e) => {
                let out = DebugFolderEntry::new(k);
                self.refresh = true;
                console!("J");
                e.insert(out)
            }
        }
    }
    
    pub fn refresh(&mut self) -> bool {
        let out = self.refresh;
        self.refresh = false;
        console!("refresh {}",out);
        out
    }
    
    pub fn select(&mut self, name: &str) {
        self.selected = Some(name.to_string());
        self.update_contents();
    }
    
    fn update_contents(&mut self) {
        console!("W");
        let el = self.el.clone();
        domutil::text_content(&el,"");
        let sel = self.selected.clone();
        if let Some(ref sel) = sel {
            console!("X");
            let e = self.entry(&sel);
            domutil::text_content(&el,&e.get());
        }
        domutil::scroll_to_bottom(&el);
    }
    
    fn maybe_update_contents(&mut self, name: &str) {
        if let Some(ref sel) = self.selected.clone() {
            if sel == name {
                self.update_contents();
            }
        }
    }
    
    pub fn values(&self) -> Vec<&DebugFolderEntry> {
        self.folder.values().collect()
    }
    
    pub fn mark(&mut self) {
        for e in &mut self.folder.values_mut() {
            e.mark();
        }
        self.update_contents();
    }
        
    pub fn add(&mut self, name: &str, value: &str) {
        self.entry(name).add(value);
        self.maybe_update_contents(name);
        if self.refresh() {
            domutil::send_custom_event(&self.el,"refresh",&json!({}));
        }
    }
    
    pub fn reset(&mut self,name: &str) {
        self.entry(name).reset();
    }
}

impl EventListener<()> for DebugConsole2Impl {
    fn receive(&mut self, el: &Element, ev: &EventData, p: &()) {
        if let EventData::CustomEvent(_,n,v) = ev {
            let mut data = HashMap::<String,String>::new();
            if let JSONValue::Object(map) = v.details().unwrap() {
                for (k,v) in &map {
                    if let JSONValue::String(v) = v {
                        data.insert(k.to_string(),v.to_string());
                    }
                }
            }
            match &n[..] {
                "reset" => { self.reset(data.get("name").unwrap()) },
                "mark" => { self.mark() },
                "select" => { self.select(data.get("name").unwrap()); },
                "add" => {
                    self.add(data.get("name").unwrap(),
                             data.get("value").unwrap());
                },
                _ => ()
            }
        }
    }
}

struct DebugConsole2Listener(Rc<RefCell<DebugConsole2Impl>>);

impl EventListener<()> for DebugConsole2Listener {
    fn receive(&mut self, el: &Element, ev: &EventData, p: &()) {
        self.0.borrow_mut().receive(el,ev,p);
    }
}

pub struct DebugConsole2 {
    imp: Rc<RefCell<DebugConsole2Impl>>,
    evctrl: EventControl<()>
}

impl DebugConsole2 {
    pub fn new(el: &Element) -> DebugConsole2 {
        let mut out = DebugConsole2 {
            imp: Rc::new(RefCell::new(DebugConsole2Impl::new(el))),
            evctrl: EventControl::new(),
        };
        let li = DebugConsole2Listener(out.imp.clone());
        let elh = EventListenerHandle::new(Box::new(li));
        out.evctrl.add_event(EventType::CustomEvent("add".to_string()),&elh);
        out.evctrl.add_event(EventType::CustomEvent("mark".to_string()),&elh);
        out.evctrl.add_event(EventType::CustomEvent("select".to_string()),&elh);
        out.evctrl.add_element(&mut EventKiller::new(),&el,());
        out
    }
    
    pub fn keys(&self) -> Vec<String> {
        self.imp.borrow().values().iter().map(|v| v.name.to_string()).collect()
    }
    
    pub fn mark(&mut self) {
        self.imp.borrow_mut().mark();
    }
    
    pub fn reset(&mut self, name: &str) {
        self.imp.borrow_mut().reset(name);
    }
        
    pub fn add(&mut self, name: &str, value: &str) {
        console!("add {} = {}",name,value);
        self.imp.borrow_mut().add(name,value);
    }

    pub fn select(&mut self, name: &str) {
        self.imp.borrow_mut().select(name);
    }
}

pub struct DebugPanelListener {
}

impl EventListener<()> for DebugPanelListener {
    fn receive(&mut self, el: &Element, ev: &EventData, p: &()) {
        console!("service");
        //debug_panel_render_dropdown();
    }
}

pub struct DebugPanel {
    pub console2: DebugConsole2,
    pub buttons: DebugButtons,
    bodyev: EventControl<()>,
    evc: EventControl<()>,
}

impl DebugPanel {
    pub fn new(base: &Element) -> Rc<RefCell<DebugPanel>> {
        debug!("global","new debug panel");
        debug!("debug panel","new debug panel");
        let cons_el = domutil::query_selector(base,"#console2");
        let out = Rc::new(RefCell::new(DebugPanel {
            bodyev: EventControl::new(),
            evc: EventControl::new(),
            buttons: DebugButtons::new(None),
            console2: DebugConsole2::new(&cons_el)
        }));
        {
            console!("A");
            let rc = &mut out.borrow_mut();
            rc.console2.select("hello");
            rc.console2.add("hello","world");
            console!("B");
            rc.buttons = DebugButtons::new(Some(&mut out.clone()));
            let el = EventListenerHandle::new(Box::new(BodyEventListener::new()));
            rc.bodyev.add_event(EventType::KeyPressEvent,&el);
            rc.bodyev.add_event(EventType::ClickEvent,&el);
            rc.bodyev.add_event(EventType::CustomEvent("custom".to_string()),&el);
            rc.bodyev.add_event(EventType::CustomEvent("dropdown".to_string()),&el);
            rc.bodyev.add_element(&mut EventKiller::new(),&domutil::query_select("body"),());
            console!("C");
            let li = EventListenerHandle::new(Box::new(DebugPanelListener{}));
            rc.evc.add_event(EventType::CustomEvent("refresh".to_string()),&li);
            rc.evc.add_element(&mut EventKiller::new(),&base,());
            rc.add_event();
        }
        console!("D");
        out
    }
     
    fn render_dropdown(&self) {
        console!("M");
        let sel_el = domutil::query_select("#console .folder");
        domutil::inner_html(&sel_el,"");
        console!("N");
        let mut keys : Vec<String> = self.console2.keys();
        console!("P");
        keys.sort();
        for e in keys {
            let opt_el = domutil::append_element(&sel_el,"option");
            domutil::text_content(&opt_el,&e);
        }
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
            <pre id="console2" class="content"></pre>
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
    let stage = domutil::query_select("#stage");
    domutil::inner_html(&stage,STAGE);
    let el = domutil::append_element(&domutil::query_select("head"),"style");
    domutil::inner_html(&el,STAGE_CSS);
    DEBUG_PANEL.with(|p| {
        *p.borrow_mut() = Some(DebugPanel::new(&stage));
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

pub fn debug_panel_render_dropdown() {
    console!("render dropdown");
    panel_op(&mut |p| { p.render_dropdown(); });    
}

#[allow(dead_code)]
pub fn debug_panel_entry_reset(name: &str) {
    let cel = domutil::query_select("#console2");
    domutil::send_custom_event(&cel,"reset",&json!({ "name": name }));
}

pub fn debug_panel_entry_mark() {
    let cel = domutil::query_select("#console2");
    domutil::send_custom_event(&cel,"mark",&json!({}));
}

pub fn debug_panel_entry_add(name: &str, value: &str) {
    let cel = domutil::query_select("#console2");
    domutil::send_custom_event(&cel,"add",&json!({
        "name": name,
        "value": value
    }));
    debug_panel_render_dropdown();
}

pub fn debug_panel_select(name: &str) {
    let cel = domutil::query_select("#console2");
    domutil::send_custom_event(&cel,"select",&json!({ "name": name }));
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
    });
}
