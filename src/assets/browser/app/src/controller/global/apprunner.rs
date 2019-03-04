use std::sync::{ Arc, Mutex, Weak };

use stdweb::web::HtmlElement;
use url::Url;

use composit::{
    register_compositor_ticks, AllLandscapes, CombinedSourceManager,
    SourceManager, SourceManagerList, StickManager, ActiveSource, Stick
};
use controller::global::{ App, GlobalWeak };
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
    Timers, Timer
};
use controller::output::{ Projector, Report };
use data::{ HttpManager, HttpXferClerk, BackendConfigBootstrap, BackendConfig };
use dom::Bling;
use dom::event::EventControl;
use debug::{ DebugBling, create_interactors, add_debug_sticks };
use tácode::Tácode;

const SIZE_CHECK_INTERVAL_MS: f64 = 500.;

struct AppRunnerImpl {
    g: GlobalWeak,
    el: HtmlElement,
    bling: Box<Bling>,
    app: Arc<Mutex<App>>,
    projector: Option<Projector>,
    controls: Vec<Box<EventControl<()>>>,
    timers: Timers,
    tc: Tácode,
    http_manager: HttpManager,
    config: BackendConfig,
    config_url: Url
}

#[derive(Clone)]
pub struct AppRunner(Arc<Mutex<AppRunnerImpl>>);

#[derive(Clone)]
pub struct AppRunnerWeak(Weak<Mutex<AppRunnerImpl>>);

impl AppRunner {
    pub fn new(g: &GlobalWeak, http_manager: &HttpManager, el: &HtmlElement, bling: Box<Bling>, config_url: &Url, config: &BackendConfig) -> AppRunner {
        let browser_el : HtmlElement = bling.apply_bling(&el);
        let tc = Tácode::new();
        let st = App::new(&tc,config,&http_manager,&browser_el,&config_url);
        let mut out = AppRunner(Arc::new(Mutex::new(AppRunnerImpl {
            g: g.clone(),
            el: el.clone(),
            bling,
            app: Arc::new(Mutex::new(st)),
            projector: None,
            controls: Vec::<Box<EventControl<()>>>::new(),
            timers: Timers::new(),
            tc: tc.clone(),
            http_manager: http_manager.clone(),
            config: config.clone(),
            config_url: config_url.clone()
        })));
        {
            let imp = out.0.lock().unwrap();
            let weak = AppRunnerWeak(Arc::downgrade(&out.0));
            imp.app.lock().unwrap().set_runner(&weak);
        }
        out.init();
        let report = Report::new(&mut out);
        {
            let mut imp = out.0.lock().unwrap();
            let app = imp.app.clone();
            app.lock().unwrap().set_report(report);
            let el = imp.el.clone();
            imp.bling.activate(&app,&el);
        }
        out
    }

    pub fn reset(&mut self, bling: Box<Bling>) {
        self.unregister();
        {
            let mut imp = self.0.lock().unwrap();
            imp.bling = bling;
            let browser_el : HtmlElement = imp.bling.apply_bling(&imp.el);
            imp.app = Arc::new(Mutex::new(App::new(&imp.tc,&imp.config,&imp.http_manager,&browser_el,&imp.config_url)));
            let weak = AppRunnerWeak::new(&self);
            imp.app.lock().unwrap().set_runner(&weak);
            imp.timers = Timers::new();
            imp.projector = None;
            imp.controls = Vec::<Box<EventControl<()>>>::new();
        }
        self.init();
        let report = Report::new(self);
        {
            let mut imp = self.0.lock().unwrap();
            let el = imp.el.clone();
            let app = imp.app.clone();
            app.lock().unwrap().set_report(report);
            imp.bling.activate(&app,&el);
        }
    }

    pub fn add_timer<F>(&mut self, cb: F, min_interval: Option<f64>) -> Timer 
                            where F: FnMut(&mut App, f64) + 'static {
        self.0.lock().unwrap().timers.add(cb, min_interval)
    }

    pub fn run_timers(&mut self, time: f64) {
        let mut imp = self.0.lock().unwrap();
        let state = &mut imp.app.clone();
        imp.timers.run(&mut state.lock().unwrap(), time);
    }
        
    pub fn init(&mut self) {
        /* register main heartbeat of compositor */
        register_compositor_ticks(self);
        
        /* register canvas-bound events */
        {
            let el = self.0.lock().unwrap().el.clone();
            register_user_events(self,&el);
            register_direct_events(self,&el);
            register_dom_events(self,&el);
        }

        /* start projector */
        {
            let w = AppRunnerWeak(Arc::downgrade(&self.0.clone()));
            let proj = Projector::new(&w);
            let mut imp = self.0.lock().unwrap();
            imp.projector = Some(proj);
        }
        
        /* size canvas, now and regularly */
        let r = self.state();
        r.lock().unwrap().check_size();
        {
            self.add_timer(|app,_| {
                app.check_size();
            },Some(SIZE_CHECK_INTERVAL_MS));
        }
        
        /* run tácode */
        {
            let tc = self.0.lock().unwrap().tc.clone();
            self.add_timer(move |app,_| {
                tc.step();
            },None);
        }
        
        /* run xfer */
        {
            self.add_timer(move |app,_| {
                app.tick();
            },None);
        }        
    }
    
    pub fn draw(&mut self) {
        let imp = self.0.lock().unwrap();
        imp.app.lock().unwrap().draw();
    }
    
    pub fn add_control(&mut self, control: Box<EventControl<()>>) {
        self.0.lock().unwrap().controls.push(control);
    }
    
    pub fn state(&self) -> Arc<Mutex<App>> {
        self.0.lock().unwrap().app.clone()
    }
    
    pub fn unregister(&mut self) {
        {
            let cc = &mut self.0.lock().unwrap().controls;
            for c in &mut cc.iter_mut() {
                c.reset();
            }
            cc.clear();
        }
        if let Some(ref mut proj) = self.0.lock().unwrap().projector {
            proj.stop();
        }
        self.0.lock().unwrap().projector = None;
        let r = self.state();
        r.lock().unwrap().finish();        
    }
    
    pub fn activate_debug(&mut self) {
        console!("activate_debug");
        self.reset(Box::new(DebugBling::new(create_interactors())));
    }
    
    pub fn bling_key(&mut self, key: &str) {
        let mut imp = self.0.lock().unwrap();   
        let app = imp.app.clone();     
        imp.bling.key(&app,key);
    }
}

impl AppRunnerWeak {
    pub fn new(g : &AppRunner) -> AppRunnerWeak {
        AppRunnerWeak(Arc::downgrade(&g.0))
    }

    
    pub fn upgrade(&self) -> Option<AppRunner> {
        self.0.upgrade().map(|cr| AppRunner(cr))
    }
    
    pub fn none() -> AppRunnerWeak { AppRunnerWeak(Weak::new()) }
}
