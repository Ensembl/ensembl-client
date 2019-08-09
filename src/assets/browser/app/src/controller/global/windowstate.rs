/* window will eventually replace App, but be less mad. Migration will be incremental. */

use composit::{ AllLandscapes, CombinedStickManager };
use data::{ BackendConfig, HttpXferClerk };
use model::focus::FocusObject;
use model::supply::ProductList;
use tácode::Tácode;

use model::supply::build_product;

#[derive(Clone)]
pub struct WindowState {
    tánaiste: Tácode,
    backend_config: BackendConfig,
    als: AllLandscapes,
    http_clerk: HttpXferClerk,
    focus: FocusObject,
    product_list: ProductList,
    stick_manager: CombinedStickManager
}

impl WindowState {
    pub fn new(backend_config: &BackendConfig, tánaiste: &Tácode, http_clerk: &mut HttpXferClerk, 
            product_list: &mut ProductList, stick_manager: &mut CombinedStickManager) -> WindowState {
        let mut out = WindowState {
            tánaiste: tánaiste.clone(),
            backend_config: backend_config.clone(),
            als: AllLandscapes::new(),
            focus: FocusObject::new(),
            http_clerk: http_clerk.clone(),
            product_list: product_list.clone(),
            stick_manager: stick_manager.clone()
        };
        http_clerk.set_window_state(&mut out);
        out
    }

    pub fn get_tánaiste_interp(&mut self) -> &mut Tácode { &mut self.tánaiste }
    pub fn get_backend_config(&mut self) -> &mut BackendConfig { &mut self.backend_config }
    pub fn get_http_clerk(&mut self) -> &mut HttpXferClerk { &mut self.http_clerk }
    pub fn get_focus(&mut self) -> &mut FocusObject { &mut self.focus }
    pub fn get_all_landscapes(&mut self) -> &mut AllLandscapes { &mut self.als }
    pub fn get_product_list(&mut self) -> &mut ProductList { &mut self.product_list }
    pub fn get_stick_manager(&mut self) -> &mut CombinedStickManager { &mut self.stick_manager }
}