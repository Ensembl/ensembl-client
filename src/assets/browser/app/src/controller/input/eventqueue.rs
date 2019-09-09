use std::sync::{ Arc, Mutex };
use std::collections::{ HashMap, HashSet };
use stdweb::web::{HtmlElement, IElement };
use controller::input::Action;
use controller::global::{ AppRunner, App };
use dom::domutil;

struct ActionSet {
    actions: Vec<Action>,
    currency: Option<f64>
}

impl ActionSet {
    fn new(actions: &Vec<Action>, currency: Option<f64>) -> ActionSet {
        ActionSet {
            actions: actions.to_vec(),
            currency: currency
        }
    }

    fn run(&mut self, app: &mut App) {
        app.run_actions(&self.actions,self.currency);
        self.actions.clear();
    }
}

struct EventQueue {
    queue: Vec<ActionSet>,
    ar: Option<AppRunner>
}

impl EventQueue {
    fn new() -> EventQueue {
        EventQueue {
            queue: Vec::new(),
            ar: None
        }
    }

    fn ar(&self) -> &Option<AppRunner> {
        &self.ar
    }

    fn run(&mut self) {
        if let Some(ref mut ar) = self.ar {
            let el = ar.get_el();
            if domutil::in_page(&el) {
                let app = ar.state();
                for aset in &mut self.queue {
                    aset.run(&mut app.lock().unwrap());
                }
                self.queue.clear();
            }
        }
    }

    fn unregister(&mut self) {
        self.ar = None;
    }

    fn register_ar(&mut self, ar: &AppRunner) {
        self.ar = Some(ar.clone());
        self.run();
    }

    fn queue(&mut self, acts: &Vec<Action>, currency: Option<f64>) {
        self.queue.push(ActionSet::new(acts,currency));
        self.run();
    }

    fn merge_in(&mut self, other: &mut EventQueue) {
        self.queue.extend(other.queue.drain(..));
        self.run();
    }
}

fn id_match(id_a: &str, id_b: &str) -> bool {
    let el_a = domutil::query_selector_new(id_a);
    let el_b = domutil::query_selector_new(id_b);
    el_a.is_some() && el_a == el_b
}

pub struct EventQueueManagerImpl {
    queues: HashMap<String,EventQueue>,
    any: EventQueue,
    next_id: u32
}

impl EventQueueManagerImpl {
    fn new() -> EventQueueManagerImpl {
        EventQueueManagerImpl {
            queues: HashMap::new(),
            any: EventQueue::new(),
            next_id: 0
        }
    }

    fn establish_id(&mut self, el: &HtmlElement) -> String {
        let id = match el.get_attribute("id") {
            Some(id) => id,
            None => {
                let id = format!("bpaneid{}",self.next_id);
                self.next_id += 1;
                el.set_attribute("id",&id).ok();
                id
            }
        };
        format!("#{}",id)
    }

    fn merge(&mut self, new_eq: &mut EventQueue, id: &str) {
        let queues = &mut self.queues;
        let mut removed = HashSet::new();
        for (sel,eq) in queues.iter_mut() {
            if id_match(sel,&id) {
                new_eq.merge_in(eq);
                removed.insert(sel.to_string());
            }
        }
        for el in removed {
            self.queues.remove(&el);
        }
    }

    fn register_ar(&mut self, ar: &AppRunner) {
        let el = ar.get_el();
        self.any.register_ar(&ar.clone());
        let id = self.establish_id(&el);
        console!("registering id {:?}",id);
        let mut new_eq = EventQueue::new();
        new_eq.register_ar(ar);
        self.merge(&mut new_eq,&id);
        self.queues.insert(id,new_eq);
    }

    fn add_by_element(&mut self, el: &HtmlElement, acts: &Vec<Action>, currency: Option<f64>) -> bool {
        for (sel,eq) in self.queues.iter_mut() {
            // TODO inter-call cache
            if let Some(el) = domutil::query_selector_new(sel) {
                console!("adding {:?} to {:?}",acts,sel);
                eq.queue(acts,currency);
                return true;
            }
        }
        return false;
    }

    fn add_by_selector(&mut self, sel: Option<&str>, acts: &Vec<Action>, currency: Option<f64>) {
        if let Some(sel) = sel {
            if let Some(el) = domutil::query_selector_new(sel) {
                if self.add_by_element(&el,acts,currency) { return; }
            }
        }
        console!("add to any {:?}",acts);
        self.any.queue(acts,currency);
    }
}

#[derive(Clone)]
pub struct EventQueueManager(Arc<Mutex<EventQueueManagerImpl>>);

impl EventQueueManager {
    pub fn new() -> EventQueueManager {
        EventQueueManager(Arc::new(Mutex::new(EventQueueManagerImpl::new())))
    }

    pub fn register_ar(&mut self, ar: &AppRunner) {
        self.0.lock().unwrap().register_ar(ar);
    }

    pub fn add_by_element(&mut self, el: &HtmlElement, acts: &Vec<Action>, currency: Option<f64>) {
        self.0.lock().unwrap().add_by_element(el,acts,currency);
    }

    pub fn add_by_selector(&mut self, sel: Option<&str>, acts: &Vec<Action>, currency: Option<f64>) {
        self.0.lock().unwrap().add_by_selector(sel,acts,currency);
    }
}
