use std::rc::Rc;
use std::cell::RefCell;

use stdweb::web::window;

use controller::global::AppRunnerWeak;
use controller::output::jank::JankBuster;

const NEGLECTED_MS : f64 = 100.;

struct ProjectorImpl {
    cr: AppRunnerWeak,
    phase: u32,
    old_time: Option<f64>,
    delta: Option<f64>,
    jank: JankBuster
}

impl ProjectorImpl {
    fn calc_delta(&mut self, time: f64) {
        self.delta = self.old_time.map(|old| time - old);
        self.old_time = Some(time);
    }

    fn should_run(&mut self, time: f64) -> bool {
        let gear = self.jank.gear();
        self.phase += 1;
        self.calc_delta(time);
        if self.phase >= gear {
            self.phase = 0;
            if let Some(delta) = self.delta {
                self.jank.detect(delta as u32,time as f32/1000.0);
            }
            true
        } else {
            false
        }
    }
    
    fn detect_deselected(&mut self) {
        if let Some(d) = self.delta {
            if d > NEGLECTED_MS {
                self.jank.disable();
            } else {
                self.jank.enable();
            }
        }
    }
}

#[derive(Clone)]
pub struct Projector(Rc<RefCell<ProjectorImpl>>);

impl Projector {
    pub fn new(cr: &AppRunnerWeak) -> Projector {
        let mut out = Projector(Rc::new(RefCell::new(ProjectorImpl {
            cr: cr.clone(),
            phase: 0,
            delta: None,
            old_time: None,
            jank: JankBuster::new(),
        })));
        out.another();
        out
    }

    fn another(&mut self) {
        let c = self.clone();
        window().request_animation_frame(
            move |t| c.clone().machine_frame(t)
        );
    }

    fn should_run(&mut self, time: f64) -> bool {
        self.0.borrow_mut().should_run(time)
    }
    
    fn detect_deselected(&mut self) {
        self.0.borrow_mut().detect_deselected();
    }

    fn machine_frame(&mut self, time: f64) {
        let cr = self.0.borrow_mut().cr.upgrade();
        if let Some(mut cr) = cr {
            if self.should_run(time) {
                cr.run_timers(time);
                cr.draw();
            } else {
                self.detect_deselected();
            }
            self.another();
        } else {
            debug!("projector","stopping");
        }
    }
}
