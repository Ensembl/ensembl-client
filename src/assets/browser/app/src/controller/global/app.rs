use std::sync::{ Arc, Mutex };

use stdweb::web::HtmlElement;
use stdweb::unstable::TryInto;
use serde_json::Value as JSONValue;
use url::Url;

use composit::{
    Compositor, StateManager, Stage, StickManager, SourceManager,
    CombinedStickManager, SourceManagerList, ActiveSource,
    CombinedSourceManager, AllLandscapes
};
use controller::input::{ Action, actions_run, startup_actions };
use controller::global::{ AppRunnerWeak, AppRunner };
use controller::output::{ OutputAction, Report, ViewportReport };
use data::{ BackendConfig, BackendStickManager, HttpManager, HttpXferClerk, XferCache, XferClerk };
use debug::add_debug_sticks;
use dom::domutil;
use mosquito::Bottle;
use print::Printer;
use tácode::Tácode;

const CANVAS : &str = r##"<canvas></canvas>"##;

pub struct App {
    ar: AppRunnerWeak,
    browser_el: HtmlElement,
    canv_el: HtmlElement,
    pub printer: Arc<Mutex<Printer>>,
    pub stage: Arc<Mutex<Stage>>,
    pub state: Arc<Mutex<StateManager>>,
    pub compo: Arc<Mutex<Compositor>>,
    sticks: Box<StickManager>,
    report: Option<Report>,
    viewport: Option<ViewportReport>,
    csl: SourceManagerList,
    http_clerk: HttpXferClerk,
    als: AllLandscapes,
}

impl App {
    pub fn new(tc: &Tácode, config: &BackendConfig, http_manager: &HttpManager, browser_el: &HtmlElement, config_url: &Url, outer_el: &HtmlElement) -> App {
        let browser_el = browser_el.clone();
        let bottle_el = domutil::query_selector2(&outer_el.clone().into(),".bottle");
        let swarm_el = domutil::query_selector2(&outer_el.clone().into(),".swarm");
        let mut bottle = Bottle::new(bottle_el,swarm_el.unwrap());
        domutil::inner_html(&browser_el.clone().into(),CANVAS);
        let canv_el : HtmlElement = domutil::query_selector(&browser_el.clone().into(),"canvas").try_into().unwrap();
        let bsm = BackendStickManager::new(config);
        let mut csm = CombinedStickManager::new(bsm);
        add_debug_sticks(&mut csm);
        let cache = XferCache::new(5000);
        let clerk = HttpXferClerk::new(http_manager,config,config_url,&cache);
        let mut out = App {
            ar: AppRunnerWeak::none(),
            browser_el: browser_el.clone(),
            canv_el: canv_el.clone(),
            printer: Arc::new(Mutex::new(Printer::new(&canv_el))),
            stage:  Arc::new(Mutex::new(Stage::new())),
            compo: Arc::new(Mutex::new(Compositor::new(&cache,Box::new(clerk.clone())))),
            state: Arc::new(Mutex::new(StateManager::new())),
            sticks: Box::new(csm),
            report: None,
            viewport: None,
            csl: SourceManagerList::new(),
            http_clerk: clerk,
            als: AllLandscapes::new()
        };
        let dsm = CombinedSourceManager::new(&tc,config,&out.als,&out.http_clerk);
        out.csl.add_compsource(Box::new(dsm));
        out.run_actions(&startup_actions());
        /* XXX */
        bottle.make("mosquito-cog");
        
        out
    }
    
    pub fn get_all_landscapes(&mut self) -> &mut AllLandscapes {
        &mut self.als
    }
    
    pub fn tick(&mut self) {
        self.http_clerk.tick();
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
    
    pub fn with_apprunner<F,G>(&mut self, cb:F) -> Option<G>
            where F: FnOnce(&mut AppRunner) -> G {
        self.ar.upgrade().as_mut().map(cb)
    }
    
    pub fn get_browser_element(&self) -> &HtmlElement { &self.browser_el }
    
    pub fn get_canvas_element(&self) -> &HtmlElement { &self.canv_el }
    
    pub fn finish(&mut self) {
        self.printer.lock().unwrap().finish();
    }
    
    pub fn draw(&mut self) {
        let stage = self.stage.lock().unwrap();
        let oom = self.state.lock().unwrap();
        let mut compo = self.compo.lock().unwrap();
        self.printer.lock().unwrap().go(&stage,&oom,&mut compo);
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
    
    pub fn run_actions(self: &mut App, evs: &Vec<Action>) {
        actions_run(self,evs);
    }
        
    pub fn check_size(self: &mut App) {
        let mut sz = self.printer.lock().unwrap().get_available_size();
        sz.0 = ((sz.0+3)/4)*4;
        sz.1 = ((sz.1+3)/4)*4;
        actions_run(self,&vec! { Action::Resize(sz) });
    }
 
    pub fn force_size(self: &App) {
        let stage = self.stage.lock().unwrap();
        self.printer.lock().unwrap().set_size(stage.get_size());
    }
}
