use std::collections::HashMap;

use dom::domutil;

const DEBUG_FOLDER : &str = "- debug folder -";

pub struct DebugFolderEntry {
    pub name: String,
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

pub struct DebugConsole {
    folder: HashMap<String,DebugFolderEntry>,
    selected: String,
}

impl DebugConsole {
    pub fn new() -> DebugConsole {
        let mut out = DebugConsole {
            folder: HashMap::<String,DebugFolderEntry>::new(),
            selected: DEBUG_FOLDER.to_string(),
        };
        out.update_contents(DEBUG_FOLDER);
        out
    }

    pub fn debug(&mut self, name: &str, value: &str) {
        self.get_entry(name).add(value);
        self.update_contents(name);
    }
    
    pub fn get_entry(&mut self, name: &str) -> &mut DebugFolderEntry {
        if let None = self.folder.get(name) {
            self.folder.insert(name.to_string(),DebugFolderEntry::new(name));
            self.render_dropdown();
        }
        self.folder.get_mut(name).unwrap()
    }

    pub fn mark(&mut self) {
        for e in &mut self.folder.values_mut() {
            e.mark();
        }
        let sel = self.selected.clone();
        self.update_contents(&sel);
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
    
    fn update_contents(&mut self, name: &str) {
        if name == self.selected {
            let panel_el = domutil::query_select("#console .content");
            let sel = self.selected.clone();
            let entry = self.get_entry(&sel);
            domutil::text_content(&panel_el,&entry.get());
            domutil::scroll_to_bottom(&panel_el);
        }
    }
    
    pub fn select(&mut self, name: &str) {
        self.selected = name.to_string();
        self.update_contents(name);
    }
}
