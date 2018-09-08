use std::cmp::Ord;
use std::collections::HashMap;
use std::cell::RefCell;

use stdweb::web::{ IEventTarget, IElement, Element };
use stdweb::traits::IEvent;
use stdweb::web::event::{ ClickEvent, ChangeEvent };
use stdweb::web::html_element::SelectElement;
use stdweb::unstable::TryInto;

use dom;
use dom::domutil;
use dom::event::{ EventListener, ElementEvents, EventControl, EventType, MouseEvent, EventListenerHandle, KeyboardEvent, EventKiller };
use testcards;

pub struct DebugFolderEntry {
    name: String,
    contents: String,
    last: String,
    mul: u32
}

const MAX_LEN : i32 = 1000000;

impl DebugFolderEntry {
    pub fn new(name: &str) -> DebugFolderEntry {
        DebugFolderEntry {
            name: name.to_string(),
            contents: String::new(),
            last: String::new(),
            mul: 0
        }
    }
    
    pub fn reset(&mut self) {
        self.contents = String::new();
    }
    
    pub fn mark(&mut self) {
        console!("mark {:?}",&self.name);
        self.add("-- MARK --");
    }
    
    pub fn add(&mut self, value: &str) {
        if value == self.last {
            self.mul += 1;
        } else {
            if self.mul >1 {
                self.contents.push_str(&format!(" [x{}]",self.mul));
            }
            self.contents.push_str("\n");
            self.contents.push_str(value);
            self.last = value.to_string();
            self.mul = 1;
        }
        let too_long = self.contents.len() as i32 - MAX_LEN;
        if too_long > 0 {
            self.contents = self.contents[too_long as usize..].to_string();
        }
    }
    
    pub fn get(&mut self) -> String {
        let mut out = self.contents.clone();
        if self.mul > 1 {
            out.push_str(&format!(" [x{}]",self.mul));
        }
        out
    }
}

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
    fn receive_mouse(&mut self, el: &Element, typ: &EventType, ev: &MouseEvent, _p: &()) {
        self.val += 1;
        debug!("test event","{:?} {} {:?} {:?}",typ,self.val,el,ev);
    }

    fn receive_keyboard(&mut self, el: &Element, typ: &EventType, ev: &KeyboardEvent, _p: &()) {
        self.val += 1;
        debug!("test event","{:?} {} {:?} {:?}",typ,self.val,el,ev);
    }
}

pub struct ButtonEventListener {
}

impl ButtonEventListener {
    pub fn new() -> ButtonEventListener {
        ButtonEventListener {}
    }
}

impl EventListener<usize> for ButtonEventListener {
    fn receive_mouse(&mut self, _el: &Element, _typ: &EventType, _e: &MouseEvent, p: &usize) {
        debug!("global","click {}",p);
    }
}

pub struct DebugButton {
    name: String,
}

impl DebugButton {
    pub fn new(name: &str) -> DebugButton {
        DebugButton {
            name: name.to_string(),
        }
    }        
}

pub struct DebugPanel {
    folder: HashMap<String,DebugFolderEntry>,
    buttons: HashMap<String,DebugButton>,
    selected: String,
    bodyev: EventControl<()>,
    buttonev: EventControl<usize>,
    buttonek: EventKiller<usize>
}

const DEBUG_FOLDER : &str = "- debug folder -";

impl DebugPanel {
    pub fn new() -> DebugPanel {
        debug!("global","new debug panel");
        let mut out = DebugPanel {
            folder: HashMap::<String,DebugFolderEntry>::new(),
            buttons: HashMap::<String,DebugButton>::new(),
            selected: DEBUG_FOLDER.to_string(),
            bodyev: EventControl::new(),
            buttonev: EventControl::new(),
            buttonek: EventKiller::new()
        };
        let el = EventListenerHandle::new(Box::new(BodyEventListener::new()));
        out.bodyev.add_event(EventType::KeyPressEvent,&el);
        out.bodyev.add_event(EventType::ClickEvent,&el);
        out.bodyev.add_element(&mut EventKiller::new(),&domutil::query_select("body"),());

        let bel = EventListenerHandle::new(Box::new(ButtonEventListener::new()));
        out.buttonev.add_event(EventType::ClickEvent,&bel);

        out.add_event();
        out.update_contents(DEBUG_FOLDER);
        out
    }
    
    fn select(&mut self, name: &str) {
        self.selected = name.to_string();
        self.update_contents(name);
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
    
    fn render_buttons(&mut self) {
        self.buttonek.kill();
        let sel_el = domutil::query_select("#bpane-right .buttons");
        domutil::inner_html(&sel_el,"");
        let mut keys : Vec<&mut DebugButton> = self.buttons.values_mut().collect();
        keys.sort_by(|a,b| a.name.cmp(&b.name));
        for (i,e) in keys.iter_mut().enumerate() {
            let opt_el = domutil::append_element(&sel_el,"button");
            domutil::text_content(&opt_el,&e.name);
            self.buttonev.add_element(&mut self.buttonek,&opt_el,i);
        }
    }
    
    fn update_contents(&mut self, name: &str) {
        if name == self.selected {
            let panel_el = domutil::query_select("#console .content");
            let sel = self.selected.clone();
            let entry = self.get_entry(&sel);
            domutil::text_content(&panel_el,&entry.get());
            domutil::scroll_to_bottom(&panel_el);
        }
    }
    
    fn render_dropdown(&self) {
        let sel_el = domutil::query_select("#console .folder");
        domutil::inner_html(&sel_el,"");
        let mut keys : Vec<&DebugFolderEntry> = self.folder.values().collect();
        keys.sort_by(|a,b| a.name.cmp(&b.name));
        for e in keys {
            let opt_el = domutil::append_element(&sel_el,"option");
            domutil::text_content(&opt_el,&e.name);
        }
    }
    
    fn mark(&mut self) {
        for e in &mut self.folder.values_mut() {
            e.mark();
        }
        let sel = self.selected.clone();
        self.update_contents(&sel);
    }
    
    pub fn get_entry(&mut self, name: &str) -> &mut DebugFolderEntry {
        if let None = self.folder.get(name) {
            self.folder.insert(name.to_string(),DebugFolderEntry::new(name));
            self.render_dropdown();
        }
        self.folder.get_mut(name).unwrap()
    }
    
    pub fn add_button(&mut self, name: &str) {
        self.buttons.insert(name.to_string(),DebugButton::new(name));
    }
    
    pub fn clear_buttons(&mut self) {
        self.buttons.clear();
    }
}

const CANVAS : &str = r##"
    <canvas id="glcanvas"></canvas>
"##;

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
    static DEBUG_PANEL : RefCell<Option<DebugPanel>> = RefCell::new(None);
}

fn setup_testcard(name: &str) {
    debug!("global","setup testcard {}",name);
    let pane_el = domutil::query_select("#bpane-canv");
    if name.len() > 0 {
        domutil::inner_html(&pane_el,CANVAS);
        let canv_el = domutil::query_select("#bpane-canv canvas");
        CANVAS_INST.with(|ci| {
            let mut inst = ci.borrow_mut();
            *inst += 1;
            let inst_s = format!("{}",*inst);
            canv_el.set_attribute("data-inst",&inst_s).ok();
            testcards::testcard(name,&inst_s);
        });
    } else {
        domutil::inner_html(&pane_el,"");
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

#[allow(dead_code)]
pub fn debug_panel_entry_reset(name: &str) {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.get_entry(name).reset()
        }
    })
}

pub fn debug_panel_entry_mark() {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.mark()
        }
    })
}

pub fn debug_panel_entry_add(name: &str, value: &str) {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.get_entry(name).add(value);
            panel.update_contents(name);
        }
    });
}

pub fn debug_panel_select(name: &str) {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.select(name);
        }
    });
}

pub fn debug_panel_buttons_clear() {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.clear_buttons();
            panel.render_buttons();
        }
    });
}

pub fn debug_panel_button_add(name: &str) {
    DEBUG_PANEL.with(|p| {
        let mut po = p.borrow_mut();
        if let Some(panel) = po.as_mut() {
            panel.add_button(name);
            panel.render_buttons();
        }
    });
}
