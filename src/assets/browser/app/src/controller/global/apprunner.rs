use std::cell::RefCell;
use std::rc::Rc;
use std::sync::{ Arc, Mutex, Weak };

use stdweb::web::HtmlElement;
use url::Url;
use dom::domutil;
use composit::register_compositor_ticks;
use controller::global::{ App, GlobalWeak };
use controller::scheduler::{ Scheduler, SchedRun, SchedulerGroup };
use controller::input::register_dom_events;
use drivers::domel::{ register_user_events };
use controller::output::{ OutputAction, Report, ViewportReport, ZMenuReports, Counter, animate_jump_to };

#[cfg(any(not(deploy),console))]
use data::blackbox::{
    blackbox_report, blackbox_push, blackbox_pop, blackbox_tick
};

use data::{ HttpManager, BackendConfig };
use data::blackbox::BlackBoxDriver;
use dom::Bling;
use dom::event::EventControl;
use dom::domutil::browser_time;
use tácode::Tácode;

pub struct AppRunnerImpl {
    g: GlobalWeak,
    counter: Counter,
    el: HtmlElement,
    bling: Box<dyn Bling>,
    app: Arc<Mutex<App>>,
    controls: Vec<Box<EventControl<()>>>,
    sched_group: SchedulerGroup,
    tc: Tácode,
    debug_reporter: BlackBoxDriver,
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
    pub fn new(g: &GlobalWeak, http_manager: &HttpManager, el: &HtmlElement, bling: Box<dyn Bling>, config_url: &Url, config: &BackendConfig, debug_reporter: BlackBoxDriver, key: &str) -> AppRunner {
        let browser_el : HtmlElement = bling.apply_bling(&el);
        let tc = Tácode::new();
        let counter = {
            let g = unwrap!(g.clone().upgrade()).clone();
            g.counter()
        };
        let st = App::new(&tc,config,&http_manager,&browser_el,&config_url,&counter);
        let sched_group = {
            let g = unwrap!(g.clone().upgrade()).clone();
            g.scheduler().make_group()
        };
        let mut out = AppRunner(Arc::new(Mutex::new(AppRunnerImpl {
            g: g.clone(),
            el: el.clone(),
            counter,
            bling,
            app: Arc::new(Mutex::new(st)),
            controls: Vec::<Box<EventControl<()>>>::new(),
            sched_group,
            tc: tc.clone(),
            debug_reporter,
            browser_el: browser_el.clone(),
            key: key.to_string()
        })));
        out.init();
        let report = Report::new(&mut out);
        let viewport_report = ViewportReport::new(&mut out);
        let zmenu_reports = ZMenuReports::new(&mut out);
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

    pub fn add_timer<F>(&mut self, name: &str, mut cb: F, prio: usize)
                            where F: FnMut(&mut App, f64, &mut SchedRun) -> Vec<OutputAction> + 'static {
        let mut ar = self.clone();
        ok!(self.0.lock()).sched_group.add(name,Box::new(move |sr| {
            let oas = {
                let imp = ok!(ar.0.lock());
                {
                    let app_ref = imp.app.clone();
                    let mut app = app_ref.lock().unwrap();
                    let out = cb(&mut app,browser_time(),sr);
                    out
                }
            };
            for oa in oas {
                oa.run(&mut ar);
            }
        }),prio,false);
    }

    pub fn scheduler(&self) -> Scheduler {
        let g = unwrap!(ok!(self.0.lock()).g.upgrade()).clone();
        g.scheduler()
    }
    
    pub fn init(&mut self) {
        /* register main heartbeat of compositor */
        register_compositor_ticks(self);
        
        /* register canvas-bound events */
        {
            let el = self.0.lock().unwrap().el.clone();
            register_user_events(self,&el);
            register_dom_events(self,&el);
        }

        {
            {
                let mut imp = self.0.lock().unwrap();
                /* tacode */
                {
                    let tc = imp.tc.clone();
                    imp.sched_group.add("tácode",Box::new(move |sr| {
                        tc.step(sr.available());
                    }),2,false);
                }
                /* blackbox */
                #[cfg(any(not(deploy),console))]
                {
                    let mut dr = imp.debug_reporter.clone();
                    imp.sched_group.add("blackbox",Box::new(move |sr| {
                        if !blackbox_tick(&mut dr) {
                            sr.unproductive();
                        }
                    }),5,false);
                }
                /* animate & draw */
                let app = imp.app.clone();
                imp.sched_group.add("draw",Box::new(move |_| {
                    let t = browser_time();
                    let mut imp = app.lock().unwrap();
                    let actions = imp.get_window().get_animator().tick(t);
                    imp.run_actions(&actions,None);
                    imp.draw();
                }),0,true);
            }
            /* xfer */
            self.add_timer("xfer",move |app,_,sr| {
                if !app.tick_xfer() {
                    sr.unproductive();
                }
                vec![]
            },2);
            /* jumping */
            self.add_timer("get-jump",move |app,_,_| {
                let tm = app.get_window().get_train_manager();
                if let Some((stick,pos,scale)) = tm.pull_pending_focus_jump() {
                    vec![OutputAction::Jump(stick,pos,scale)]
                } else {
                    vec![]
                }
            },0);
            /* resize check */
            self.add_timer("resizer",move |app,_,_| {
                app.check_size();
                vec![]
            },0);
            /* gone check */
            self.add_timer("gone-check",move |app,_,_| {
                if app.check_gone() {
                    vec![OutputAction::Destroy]
                } else {
                    vec![]
                }
            },0);
        }
        bb_log!("main","debug reporter initialised");
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
            imp.sched_group.clear();
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

    pub fn jump(&mut self, stick: &str, dest_pos: f64, dest_size: f64) {
        let mut imp = self.0.lock().unwrap();
        animate_jump_to(&mut imp.app.lock().unwrap(), stick, dest_pos, dest_size);
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
