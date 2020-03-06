use commander::{ Agent, RunConfig };
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Arc, Mutex, Weak };
use stdweb::unstable::TryInto;

use stdweb::web::{ document, HtmlElement };
use url::Url;
use crate::dom::domutil;
use crate::composit::register_compositor_ticks;
use crate::controller::global::{ App, GlobalWeak };
use crate::controller::input::register_dom_events;
use crate::drivers::domel::{ register_user_events };
use crate::controller::output::{ OutputAction, Report, ViewportReport, ZMenuReports, Counter };
use crate::controller::animate::animate_jump_to;

use crate::data::{ HttpManager, BackendConfig };
use crate::debug::BlackboxSender;
use crate::dom::Bling;
use crate::dom::event::EventControl;
use crate::dom::domutil::browser_time;
use crate::tácode::Tácode;

pub struct AppRunnerImpl {
    g: GlobalWeak,
    counter: Counter,
    el: HtmlElement,
    bling: Box<dyn Bling>,
    app: Arc<Mutex<App>>,
    controls: Vec<Box<EventControl<()>>>,
    tc: Tácode,
    browser_el: HtmlElement,
    key: String
}

impl AppRunnerImpl {
    fn clear_controls(&mut self) {
        let controls = &mut self.controls;
        for control in &mut controls.iter_mut() {
            control.reset();
        }
        controls.clear();
    }
}

#[derive(Clone)]
pub struct AppRunner(Arc<Mutex<AppRunnerImpl>>);

#[derive(Clone)]
pub struct AppRunnerWeak(Weak<Mutex<AppRunnerImpl>>);

impl AppRunner {
    pub fn new(g: &GlobalWeak, agent: &Agent, http_manager: &HttpManager, el: &HtmlElement, bling: Box<dyn Bling>, config_url: &Url, config: &BackendConfig, key: &str) -> AppRunner {
        let browser_el : HtmlElement = bling.apply_bling(&el);
        let tc = Tácode::new();
        let counter = {
            let g = unwrap!(g.clone().upgrade()).clone();
            g.counter()
        };
        let st = App::new(&tc,config,&http_manager,&browser_el,&config_url,&counter);
        let mut out = AppRunner(Arc::new(Mutex::new(AppRunnerImpl {
            g: g.clone(),
            el: el.clone(),
            counter,
            bling,
            app: Arc::new(Mutex::new(st)),
            controls: Vec::<Box<EventControl<()>>>::new(),
            //sched_group,
            tc: tc.clone(),
            browser_el: browser_el.clone(),
            key: key.to_string()
        })));
        out.init(agent);
        let report = Report::new(&mut out,agent);
        let viewport_report = ViewportReport::new(&mut out,agent);
        let zmenu_reports = ZMenuReports::new(&mut out,agent);
        {
            let mut imp = out.0.lock().unwrap();
            let app = imp.app.clone();
            app.lock().unwrap().set_report(report);
            app.lock().unwrap().set_viewport_report(viewport_report);
            app.lock().unwrap().set_zmenu_reports(zmenu_reports);
            let el = imp.el.clone();
            imp.bling.activate(&app,&el);
        }
        out
    }

    pub fn with_counter<F,G>(&self, cb: F) -> G where F: FnOnce(&mut Counter) -> G {
        cb(&mut self.0.lock().unwrap().counter)
    }

    pub fn get_browser_el(&mut self) -> HtmlElement {
        self.0.lock().unwrap().browser_el.clone()
    }

    pub fn get_el(&self) -> HtmlElement {
        self.0.lock().unwrap().el.clone()
    }

    async fn timer_loop<F>(agent: Agent, ar: AppRunner, mut cb: F)
            where F: FnMut(&mut App, f64) -> Vec<OutputAction> + 'static {
        let mut ar = ar.clone();
        loop {
            let oas = {
                let imp = ok!(ar.0.lock());
                {
                    let app_ref = imp.app.clone();
                    let mut app = ok!(app_ref.lock());
                    if app.is_killed() { break; }
                    let out = cb(&mut app,browser_time());
                    out
                }
            };
            for oa in oas {
                oa.run(&mut ar);
            }
            agent.tick(1).await;
        }
    }

    pub fn add_timer<F>(&mut self, name: &str, mut cb: F, prio: usize, agent: &Agent)
                            where F: FnMut(&mut App, f64) -> Vec<OutputAction> + 'static {
        let mut ar = self.clone();
        let rc = RunConfig::new(None,0,None);
        let agent2 = agent.new_agent(Some(rc.clone()),name);
        agent.add(AppRunner::timer_loop(agent2.clone(),self.clone(),cb),agent2);
    }

    async fn draw_loop(agent: Agent, app: Arc<Mutex<App>>) {
        loop {
            let mut imp = app.lock().unwrap();
            if imp.is_killed() { break; }
            let t = browser_time();
            let actions = imp.get_window().get_animator().tick(t);
            imp.run_actions(&actions,None);
            imp.draw();
            drop(imp);
            agent.tick(1).await;
        }
    }

    async fn tácode_loop(agent: Agent, app: Arc<Mutex<App>>, tc: Tácode) {
        loop {
            tc.step(7.); // XXX
            if app.lock().unwrap().is_killed() { break; }
            agent.tick(1).await;
        }
    }

    pub fn init(&mut self, agent: &Agent) {
        /* register main heartbeat of compositor */
        register_compositor_ticks(self,agent);
        
        /* register canvas-bound events */
        {
            let el = self.0.lock().unwrap().el.clone();
            register_user_events(self,&el,agent);
            register_dom_events(self,&el);
        }

        {
            {
                let mut imp = self.0.lock().unwrap();
                let rc = RunConfig::new(None,0,None);
                let agent2 = agent.new_agent(Some(rc.clone()),"tácode");
                agent.add(AppRunner::tácode_loop(agent2.clone(), imp.app.clone(),imp.tc.clone()),agent2);

                /* blackbox */
                
                #[cfg(blackbox)]
                {
                    if let Some(g) = imp.g.upgrade() {
                        let app = imp.app.clone();
                        let http_manager = app.lock().unwrap().get_http_manager().clone();
                        let config = app.lock().unwrap().get_window().get_backend_config().clone();
                        let mut sender = app.lock().unwrap().get_window().get_blackbox_sender().clone();
                        g.add_blackbox(sender);
                    }
                }
                /* animate & draw */
                let agent2 = agent.new_agent(Some(rc.clone()),"draw");
                agent.add(AppRunner::draw_loop(agent2.clone(),imp.app.clone()),agent2);
            }
            /* xfer */
            self.add_timer("xfer",move |app,_| {
                app.tick_xfer();
                vec![]
            },2,agent);
            /* resize check */
            self.add_timer("resizer",move |app,_| {
                app.check_size();
                vec![]
            },0,agent);
            /* gone check */
            self.add_timer("gone-check",move |app,_| {
                if app.check_gone() {
                    vec![OutputAction::Destroy]
                } else {
                    vec![]
                }
            },0,agent);
        }
        blackbox_log!("main","debug reporter initialised");
    }
        
    pub fn add_control(&mut self, control: Box<EventControl<()>>) {
        self.0.lock().unwrap().controls.push(control);
    }
    
    pub fn state(&self) -> Arc<Mutex<App>> {
        ok!(self.0.lock()).app.clone()
    }

    pub fn destroy(&mut self) {
        let (mut g,key) = {
            let mut imp = self.0.lock().unwrap();
            imp.clear_controls();
            let r = &imp.app;
            r.lock().unwrap().destroy();
            let g = imp.g.upgrade().unwrap().clone();
            let key = imp.key.clone();
            (g,key)
        };
        g.unregister_app(&key,false);
    }     

    pub fn bling_key(&mut self, key: &str) {
        let mut imp = self.0.lock().unwrap();
        let app = imp.app.clone();     
        imp.bling.key(&app,key);
    }

    pub fn find_app(&mut self, el: &HtmlElement) -> bool {
        let imp = self.0.lock().unwrap();
        domutil::ancestor(el,&imp.el) || domutil::ancestor(&imp.el,el)
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
