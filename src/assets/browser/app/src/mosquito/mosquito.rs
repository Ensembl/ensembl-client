use std::cell::RefCell;
use std::rc::Rc;

use stdweb::web::Element;

use dom::domutil;

pub struct MosquitoImpl {
    id: Option<usize>,
    pos: (i32,i32),
    el: Element
}

impl MosquitoImpl {
    fn new(el: &Element) -> MosquitoImpl {
        let mut out = MosquitoImpl {
            id: None,
            pos: (0,0),
            el: el.clone()
        };
        domutil::add_attr(el,"style","position: fixed;");
        out
    }
    
    fn set_id(&mut self, id: usize) {
        self.id = Some(id);
    }
}

#[derive(Clone)]
pub struct Mosquito(Rc<RefCell<MosquitoImpl>>);

impl Mosquito {
    pub fn new(el: &Element) -> Mosquito {
        Mosquito(Rc::new(RefCell::new(MosquitoImpl::new(el))))
    }
    
    pub(in super) fn set_id(&mut self, id: usize) {
        self.0.borrow_mut().set_id(id);
    }
}
