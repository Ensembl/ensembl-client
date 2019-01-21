use std::sync::{ Arc, Mutex, Weak };

use stdweb::web::{ Element, HtmlElement };

use controller::input::{ Timers, Timer };
use controller::global::{ App, GlobalWeak };
use dom::{ domutil, Bling };
use controller::output::Projector;
use dom::event::EventControl;
use controller::input::{
    register_direct_events, register_user_events, register_dom_events,
};

struct AppRunnerImpl {
    app: Arc<Mutex<App>>,
    projector: Option<Projector>,
    controls: Vec<Box<EventControl<()>>>,
    timers: Timers
}

#[derive(Clone)]
pub struct AppRunner(Arc<Mutex<AppRunnerImpl>>);

#[derive(Clone)]
pub struct AppRunnerWeak(Weak<Mutex<AppRunnerImpl>>);

impl AppRunner {
    pub fn new(g: &GlobalWeak, el: &Element, mut bling: Box<Bling>) -> AppRunner {
        let st = App::new(g,el,&bling);
        let mut out = AppRunner(Arc::new(Mutex::new(AppRunnerImpl {
            app: Arc::new(Mutex::new(st)),
            projector: None,
            controls: Vec::<Box<EventControl<()>>>::new(),
            timers: Timers::new()
        })));
        out.add_timer(|cs,t| {
            let max_y = cs.with_compo(|co| {
                co.tick(t);
                co.get_max_y()
            });
            cs.with_stage(|s| s.set_max_y(max_y));
        });
        out.init();
        bling.activate(&mut out,&el);
        out
    }
        
    pub fn add_timer<F>(&mut self, cb: F) -> Timer 
                            where F: FnMut(&mut App, f64) + 'static {
        self.0.lock().unwrap().timers.add(cb)
    }

    pub fn run_timers(&mut self, time: f64) {
        let mut imp = self.0.lock().unwrap();
        let state = &mut imp.app.clone();
        imp.timers.run(&mut state.lock().unwrap(), time);
    }
    
    fn get_element(&self) -> HtmlElement {
        let mut imp = self.0.lock().unwrap();
        let a = &mut imp.app.clone();
        let out : HtmlElement = a.lock().unwrap().get_canvas_element().clone();
        out
    }
    
    pub fn init(&mut self) {
        /* register canvas-bound events */
        // XXX too many: customs should mainly be on body
        let el = self.get_element();
        register_user_events(self,&el);
        register_direct_events(self,&el);
        register_dom_events(self,&el);

        
        /* start projector */
        {
            let w = AppRunnerWeak(Arc::downgrade(&self.0.clone()));
            let proj = Projector::new(&w);
            let mut imp = self.0.lock().unwrap();
            imp.projector = Some(proj);
        }
        /* size canvas */
        let r = self.state();
        r.lock().unwrap().check_size();
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
        self.0.lock().unwrap().projector = None;
        let r = self.state();
        r.lock().unwrap().finish();        
    }
}

impl AppRunnerWeak {
    pub fn upgrade(&self) -> Option<AppRunner> {
        self.0.upgrade().map(|cr| AppRunner(cr))
    }    
}
