use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;
use stdweb::unstable::TryInto;
use url::Url;

use composit::{
    Compositor, StateManager, Stage, StickManager, SourceManager,
    CombinedStickManager, SourceManagerList, ActiveSource,
    CombinedSourceManager, AllLandscapes
};
use controller::input::{ Action, actions_run, startup_actions, Jumper };
use controller::global::{ AppRunnerWeak, AppRunner };
use controller::output::{ Report, ViewportReport, ZMenuReports, Counter };
use data::{ BackendConfig, BackendStickManager, HttpManager, HttpXferClerk, XferCache };
use debug::add_debug_sticks;
use dom::domutil;
use drivers::webgl::GLPrinter;
use model::driver::{ Printer, PrinterManager };
use model::focus::FocusObject;
use tácode::Tácode;
use types::Dot;

const SETTLE_TIME : f64 = 500.; // ms
const CANVAS : &str = r##"<canvas id="canvas"></canvas>"##;

pub struct App {
    ar: AppRunnerWeak,
    browser_el: HtmlElement,
    canv_el: HtmlElement,
    pub printer: Arc<Mutex<PrinterManager>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>,
    sticks: Box<StickManager>,
    report: Option<Report>,
    viewport: Option<ViewportReport>,
    zmenu_reports: Option<ZMenuReports>,
    csl: SourceManagerList,
    http_clerk: HttpXferClerk,
    als: AllLandscapes,
    size: Option<Dot<f64,f64>>,
    last_resize_at: Option<f64>,
    stage_resize: Option<Dot<f64,f64>>,
    action_backlog: Vec<Action>,
    focus: FocusObject,
    jumper: Option<Jumper>
}

impl App {
    pub fn new(tc: &Tácode, config: &BackendConfig, http_manager: &HttpManager, browser_el: &HtmlElement, config_url: &Url) -> App {
        let browser_el = browser_el.clone();
        domutil::inner_html(&browser_el.clone().into(),CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&browser_el.clone().into(),"canvas").try_into().unwrap();
        let bsm = BackendStickManager::new(config);
        let mut csm = CombinedStickManager::new(bsm);
        add_debug_sticks(&mut csm);
        let cache = XferCache::new(5000,config);
        let clerk = HttpXferClerk::new(http_manager,config,config_url,&cache);
        let printer = PrinterManager::new(Box::new(GLPrinter::new(&canv_el)));
        let mut out = App {
            ar: AppRunnerWeak::none(),
            browser_el: browser_el.clone(),
            canv_el: canv_el.clone(),
            printer: Arc::new(Mutex::new(printer.clone())),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new(printer,&cache,Box::new(clerk.clone())))),
            state: Arc::new(Mutex::new(StateManager::new())),
            sticks: Box::new(csm),
            report: None,
            viewport: None,
            zmenu_reports: None,
            csl: SourceManagerList::new(),
            http_clerk: clerk,
            als: AllLandscapes::new(),
            size: None,
            stage_resize: None,
            last_resize_at: None,
            action_backlog: Vec::new(),
            focus: FocusObject::new(),
            jumper: None
        };
        let dsm = {
            let compo = &out.compo.lock().unwrap();
            CombinedSourceManager::new(&tc,config,&compo.get_zmr(),&out.als,&out.http_clerk,&out.focus)
        };
        out.csl.add_compsource(Box::new(dsm));
        out.run_actions(&startup_actions(),None);        
        out
    }
    
    pub fn get_all_landscapes(&mut self) -> &mut AllLandscapes {
        &mut self.als
    }
    
    pub fn tick_xfer(&mut self) -> bool {
        self.http_clerk.tick()
    }
    
    pub fn get_component(&mut self, name: &str) -> Option<ActiveSource> {
        self.csl.get_component(name)
    }
    
    pub fn add_compsource(&mut self, cs: Box<SourceManager>) {
        self.csl.add_compsource(cs);
    }
    
    pub fn with_stick_manager<F,G>(&mut self, cb: F) -> G
            where F: FnOnce(&mut Box<StickManager>) -> G {
        cb(&mut self.sticks)
    }
    
    pub fn with_focus_object<F,G>(&mut self, cb: F) -> G
            where F: FnOnce(&mut FocusObject) -> G {
        let old_status = self.focus.state();
        let out = cb(&mut self.focus);
        let new_status = self.focus.state();
        if old_status != new_status {
            self.compo.lock().unwrap().change_focus();
            if let Some(id) = self.focus.get_focus() {
                self.get_report().set_status("focus",&id);
            }
        }
        out
    }

    pub fn set_runner(&mut self, ar: &AppRunnerWeak) {
        self.ar = ar.clone();
    }
            
    pub fn get_report(&self) -> &Report { &self.report.as_ref().unwrap() }
        
    pub fn set_report(&mut self, report: Report) {
        self.report = Some(report);
    }
    
    pub fn set_viewport_report(&mut self, report: ViewportReport) {
        self.viewport = Some(report);
    }

    pub fn set_jumper(&mut self, jumper: Jumper) {
        self.jumper = Some(jumper);
    }
    
    pub fn set_zmenu_reports(&mut self, report: ZMenuReports) {
        self.zmenu_reports = Some(report);
    }    
    
    pub fn get_zmenu_reports(&mut self) -> Option<&mut ZMenuReports> {
        self.zmenu_reports.as_mut()
    }
    
    pub fn with_apprunner<F,G>(&mut self, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        self.ar.upgrade().as_mut().map(cb)
    }
    
    pub fn with_jumper<F,G>(&mut self, cb: F) -> Option<G>
            where F: FnOnce(&mut Jumper) -> G {
        self.jumper.as_mut().map(|j| cb(j))
    }

    pub fn get_browser_element(&self) -> &HtmlElement { &self.browser_el }
    
    pub fn get_canvas_element(&self) -> &HtmlElement { &self.canv_el }
    
    pub fn destroy(&mut self) {
        self.printer.lock().unwrap().destroy();
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        compo.update_state(&oom);
        self.printer.lock().unwrap().print(&stage,&mut compo);
    }
    
    pub fn with_stage<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Stage) -> G {
        let s = &mut self.stage.lock().unwrap();
        let out = cb(s);
        if let Some(ref report) = self.report {
            s.update_report(report);
        }
        if let Some(ref report) = self.viewport {
            s.update_viewport_report(report);
        }
        out
    }

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
        if let Some(ref mut report) = self.report {
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
        let mut stage = self.stage.lock().unwrap();
        stage.set_size(&sz);
        self.printer.lock().unwrap().set_size(stage.get_size());
    }
    
    pub fn with_counter<F,G>(&mut self, cb: F) -> G where F: FnOnce(&mut Counter) -> G {
        unwrap!(self.ar.upgrade()).with_counter(cb)
    }

    pub fn settle(&mut self) {
        if let Some(size) = self.stage_resize.take() {
            let mut stage = self.stage.lock().unwrap();
            stage.set_size(&size);
        }
        let mut stage = self.stage.lock().unwrap();
        stage.settle();
        stage.intend_here();
        self.printer.lock().unwrap().settle();
    }
}
