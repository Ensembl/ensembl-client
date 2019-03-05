use std::collections::HashMap;

use stdweb::unstable::TryInto;
use stdweb::web::{ HtmlElement, Element, INode, IElement, CloneKind };

use dom::domutil;
use util::ValueStore;
use super::Mosquito;

pub struct Bottle {
    templates: HashMap<String,Element>,
    mosquitos: ValueStore<Mosquito>,
    swarm_el: Element
}

impl Bottle {    
    pub fn new(bottle_el: Option<Element>, swarm_el: Element) -> Bottle {
        let mut out = Bottle {
            templates: HashMap::<String,Element>::new(),
            mosquitos: ValueStore::<Mosquito>::new(),
            swarm_el
        };
        if let Some(el) = bottle_el {
            out.init(el);
        }
        out
    }
    
    fn init(&mut self, el: Element) {
        for node in el.child_nodes().iter() {
            let htel : Option<HtmlElement> = node.try_into().ok();
            if let Some(htel) = htel {
                let classes = domutil::get_classes(&htel);
                let citer = classes.iter().filter(|x| x.starts_with("mosquito-"));
                for c in citer {
                    let m : Element = htel.clone().into();
                    self.templates.insert(c.to_string(),m);
                }
            }
        }
    }
    
    pub fn make(&mut self, name: &str) -> Option<Mosquito> {
        if let Some(t) = self.templates.get(name) {
            let c = t.clone_node(CloneKind::Deep).ok().unwrap();
            self.swarm_el.append_child(&c);
            let mut m = Mosquito::new(&c);
            let m2 = m.clone();
            m.set_id(self.mosquitos.store(m2));
            Some(m)
        } else {
            None
        }
    }
}
