use std::sync::{ Arc, Mutex };

pub struct FocusObjectImpl {
    id: Option<String>
}

impl FocusObjectImpl {
    pub fn new() -> FocusObjectImpl {
        FocusObjectImpl { id: None }
    }

    pub fn set_focus(&mut self, id: &str) {
        self.id = Some(id.to_string());
    }

    pub fn reset_focus(&mut self) {
        self.id = None;
    }

    pub fn get_focus(&mut self) -> &Option<String> {
        &self.id
    }
}

#[derive(Clone)]
pub struct FocusObject(Arc<Mutex<FocusObjectImpl>>);

impl FocusObject {
    pub fn new() -> FocusObject {
        FocusObject(Arc::new(Mutex::new(FocusObjectImpl::new())))
    }

    pub fn set_focus(&mut self, id: &str) {
        self.0.lock().unwrap().set_focus(id);
    }

    pub fn reset_focus(&mut self) {
        self.0.lock().unwrap().reset_focus();
    }

    pub fn get_focus(&mut self) -> Option<String> {
        self.0.lock().unwrap().get_focus().clone()
    }
}