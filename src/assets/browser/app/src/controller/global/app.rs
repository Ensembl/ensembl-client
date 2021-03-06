use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;
use stdweb::unstable::TryInto;
use url::Url;

use composit::{
    Compositor, StateManager, CombinedStickManager, AllLandscapes
};
use model::stage::Screen;
use model::supply::ProductList;
use controller::input::{ Action, actions_run, startup_actions };
use controller::output::{ Report, ViewportReport, ZMenuReports, Counter };
use data::{ BackendConfig, BackendStickManager, HttpManager, HttpXferClerk, Locator, XferCache };
use debug::add_debug_sticks;
use dom::domutil;
use drivers::webgl::GLPrinter;
use model::driver::{ Printer, PrinterManager };
use model::stage::Intended;
use model::supply::build_product;
use model::train::{ TrainManager, TravellerCreator };
use tácode::Tácode;
use types::Dot;

use super::WindowState;

const SETTLE_TIME : f64 = 500.; // ms
const CANVAS : &str = r##"<canvas id="canvas"></canvas>"##;

pub struct App {
    counter: Counter,
    browser_el: HtmlElement,
    canv_el: HtmlElement,
    pub printer: Arc<Mutex<PrinterManager>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>,
    report: Option<Report>,
    viewport: Option<ViewportReport>,
    zmenu_reports: Option<ZMenuReports>,
    size: Option<Dot<f64,f64>>,
    last_resize_at: Option<f64>,
    stage_resize: Option<Dot<f64,f64>>,
    action_backlog: Vec<Action>,
    window: WindowState,
    intended: Intended,
    screen: Screen
}

impl App {
    pub fn new(tc: &Tácode, config: &BackendConfig, http_manager: &HttpManager, browser_el: &HtmlElement, config_url: &Url, counter: &Counter) -> App {
        let browser_el = browser_el.clone();
        domutil::inner_html(&browser_el.clone().into(),CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&browser_el.clone().into(),"canvas").try_into().unwrap();
        let bsm = BackendStickManager::new(config);
        let mut csm = CombinedStickManager::new(bsm);
        add_debug_sticks(&mut csm);
        let cache = XferCache::new(1024,config);
        let mut product_list = ProductList::new();
        let printer = PrinterManager::new(Box::new(GLPrinter::new(&canv_el)));
        let landscapes = AllLandscapes::new();
        let traveller_creator = TravellerCreator::new(&printer);
        let locator = Locator::new(config,http_manager,&csm,config_url);
        let train_manager = TrainManager::new(&printer,&traveller_creator,&locator);
        let mut clerk = HttpXferClerk::new(http_manager,config_url,&cache);
        let window = WindowState::new(config,tc,&mut clerk,&mut product_list,&mut csm,&train_manager,&landscapes,&locator);
        let mut out = App {
            browser_el: browser_el.clone(),
            canv_el: canv_el.clone(),
            printer: Arc::new(Mutex::new(printer.clone())),
            compo: Arc::new(Mutex::new(Compositor::new(&window,&traveller_creator,&cache))),
            state: Arc::new(Mutex::new(StateManager::new())),
            report: None,
            viewport: None,
            zmenu_reports: None,
            size: None,
            stage_resize: None,
            last_resize_at: None,
            action_backlog: Vec::new(),
            window: window.clone(),
            intended: Intended::new(),
            screen: Screen::new(),
            counter: counter.clone()
        };
        out.populate_products();
        out.run_actions(&startup_actions(),None);        
        out
    }

    fn populate_products(&mut self) {    
        let window = &mut self.window;
        let track_names : Vec<String> = window.get_backend_config().list_tracks().map(|s| s.to_string()).collect();
        for name in &track_names {
            let product = build_product(window,name);
            window.get_product_list().add_product(&product);
        }
    }

    pub fn get_screen(&self) -> &Screen { &self.screen }
    pub fn get_screen_mut(&mut self) -> &mut Screen { &mut self.screen }
    pub fn get_window(&mut self) -> &mut WindowState { &mut self.window }
    
    pub fn tick_xfer(&mut self) -> bool {
        self.window.get_http_clerk().tick()
    }
                
    pub fn get_report(&self) -> &Report { &self.report.as_ref().unwrap() }
        
    pub fn set_report(&mut self, report: Report) {
        self.report = Some(report);
    }
    
    pub fn set_viewport_report(&mut self, report: ViewportReport) {
        self.viewport = Some(report);
    }
    
    pub fn set_zmenu_reports(&mut self, report: ZMenuReports) {
        self.zmenu_reports = Some(report);
    }    
    
    pub fn get_zmenu_reports(&mut self) -> Option<&mut ZMenuReports> {
        self.zmenu_reports.as_mut()
    }
        
    pub fn get_browser_element(&self) -> &HtmlElement { &self.browser_el }
    
    pub fn get_canvas_element(&self) -> &HtmlElement { &self.canv_el }
    
    pub fn destroy(&mut self) {
        self.printer.lock().unwrap().destroy();
    }
    
    pub fn draw(&mut self) {
        let oom = ok!(self.state.lock());
        let mut compo = ok!(self.compo.lock());
        compo.update_state(&oom);
        ok!(self.printer.lock()).print(&self.screen,&mut compo);
    }
    
    pub fn update_position(&mut self) {
        let train_manager = self.window.get_train_manager();
        if let Some(ref report) = self.report {
            train_manager.update_reports(report);
        }
        if let Some(ref report) = self.viewport {
            train_manager.update_viewport_report(report);
        }
    }

    pub fn intend_here(&mut self) {
        let tm = self.window.get_train_manager();
        if let (Some(stick),Some(desired)) = (tm.get_desired_stick(),tm.get_desired_position()) {
            self.intended.intend_here(&stick,&desired);
            if let Some(ref report) = self.report {
                self.intended.update_intent_report(report);
            }
        }
    }

    pub fn get_intended(&self) -> &Intended { &self.intended }

    pub fn with_state<F,G>(&self, cb: F) -> G where F: FnOnce(&mut StateManager) -> G {
        let a = &mut self.state.lock().unwrap();
        cb(a)
    }

    pub fn with_compo<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Compositor) -> G {
        let c = &mut self.compo.lock().unwrap();
        let out = cb(c);
        if let Some(ref report) = self.report {
            c.update_report(report);
        }
        out
    }
        
    pub fn run_actions(self: &mut App, evs: &Vec<Action>,currency: Option<f64>) {
        if self.report.is_some() {
            if currency.is_none() || self.with_counter(|c| c.is_current(currency.unwrap())) {
                if self.action_backlog.len() > 0 {
                    console!("running backlog");
                    let backlog = self.action_backlog.drain(..).collect();
                    actions_run(self,&backlog,currency);
                }
                actions_run(self,evs,currency);
                return;
            }
        }
        self.action_backlog.extend(evs.iter().cloned());
        console!("backlogging to {:?}",self.action_backlog);
    }
    
    pub fn check_size(self: &mut App) {
        let sz = self.printer.lock().unwrap().get_available_size();
        let now = domutil::browser_time();
        if self.size == None || self.size.unwrap() != sz {
            self.last_resize_at = Some(now);
            self.run_actions(&vec! { Action::Resize(sz) },None);
            self.size = Some(sz);
        }
        if let Some(last_resize_at) = self.last_resize_at {
            if now - last_resize_at > SETTLE_TIME {
                self.run_actions(&vec! { Action::Settled },None);
                self.last_resize_at = None;
            }
        }
    }

    pub fn check_gone(self: &mut App) -> bool {
        !domutil::in_page(&self.canv_el)
    }

    pub fn force_size(self: &mut App, sz: Dot<f64,f64>) {
        self.stage_resize = Some(sz);
        self.get_screen_mut().set_size(&sz);
        let size = self.get_screen().get_size();
        self.window.get_train_manager().inform_screen_size(&sz);
        self.update_position();
        self.intend_here();
        self.printer.lock().unwrap().set_size(size);
    }
    
    pub fn with_counter<F,G>(&mut self, cb: F) -> G where F: FnOnce(&mut Counter) -> G {
        cb(&mut self.counter)
    }

    pub fn settle(&mut self) {
        if let Some(size) = self.stage_resize.take() {
            self.get_screen_mut().set_size(&size);
            self.window.get_train_manager().inform_screen_size(&size);
        }
        self.window.get_train_manager().settle();
        self.update_position();
        self.intend_here();
        self.printer.lock().unwrap().settle();
    }
}
