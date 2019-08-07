/* window will eventually replace App, but be less mad. Migration will be incremental. */

use composit::AllLandscapes;
use data::{ BackendConfig, HttpXferClerk };
use model::focus::FocusObject;
use tácode::Tácode;

#[derive(Clone)]
pub struct Window {
    tánaiste: Tácode,
    backend_config: BackendConfig,
    als: AllLandscapes,
    http_clerk: HttpXferClerk,
    focus: FocusObject
}

impl Window {
    pub fn new(backend_config: &BackendConfig, tánaiste: &Tácode, http_clerk: HttpXferClerk) -> Window {
        Window {
            tánaiste: tánaiste.clone(),
            backend_config: backend_config.clone(),
            als: AllLandscapes::new(),
            focus: FocusObject::new(),
            http_clerk
        }
    }

    pub fn get_tánaiste_interp(&mut self) -> &mut Tácode { &mut self.tánaiste }
    pub fn get_backend_config(&mut self) -> &mut BackendConfig { &mut self.backend_config }
    pub fn get_http_clerk(&mut self) -> &mut HttpXferClerk { &mut self.http_clerk }
    pub fn get_focus(&mut self) -> &mut FocusObject { &mut self.focus }
    pub fn get_all_landscapes(&mut self) -> &mut AllLandscapes { &mut self.als }
}