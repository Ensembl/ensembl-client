/* window will eventually replace App, but be less mad. Migration will be incremental. */

use composit::{ AllLandscapes, CombinedStickManager };
use data::{ BackendConfig, HttpXferClerk };
use model::driver::PrinterManager;
use model::supply::ProductList;
use model::train::{ TrainManager, TravellerCreator };
use tácode::Tácode;

use model::supply::build_product;

#[derive(Clone)]
pub struct WindowState {
    tánaiste: Tácode,
    backend_config: BackendConfig,
    http_clerk: HttpXferClerk,
    product_list: ProductList,
    stick_manager: CombinedStickManager,
    train_manager: TrainManager,
    all_landscapes: AllLandscapes
}

impl WindowState {
    pub fn new(backend_config: &BackendConfig, tánaiste: &Tácode, http_clerk: &mut HttpXferClerk, 
            product_list: &mut ProductList, stick_manager: &mut CombinedStickManager,
            train_manager: &TrainManager, landscapes: &AllLandscapes) -> WindowState {
        let mut out = WindowState {
            tánaiste: tánaiste.clone(),
            backend_config: backend_config.clone(),
            http_clerk: http_clerk.clone(),
            product_list: product_list.clone(),
            stick_manager: stick_manager.clone(),
            train_manager: train_manager.clone(),
            all_landscapes: landscapes.clone(),
        };
        http_clerk.set_window_state(&mut out);
        out
    }

    pub fn get_tánaiste_interp(&mut self) -> &mut Tácode { &mut self.tánaiste }
    pub fn get_backend_config(&mut self) -> &mut BackendConfig { &mut self.backend_config }
    pub fn get_http_clerk(&mut self) -> &mut HttpXferClerk { &mut self.http_clerk }
    pub fn get_all_landscapes(&mut self) -> &mut AllLandscapes { &mut self.all_landscapes }
    pub fn get_product_list(&mut self) -> &mut ProductList { &mut self.product_list }
    pub fn get_stick_manager(&mut self) -> &mut CombinedStickManager { &mut self.stick_manager }
    pub fn get_train_manager(&mut self) -> &mut TrainManager { &mut self.train_manager }
}