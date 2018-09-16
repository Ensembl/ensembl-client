use std::rc::{ Rc, Weak };
use std::cell::RefCell;

use stdweb::web::window;

use controller::jank::JankBuster;
use controller::global::{ CanvasGlobal, CanvasGlobalInst };

struct ProjectorImpl {
    cg: Weak<RefCell<CanvasGlobalInst>>,
    phase: u32,
    old_time: Option<f64>,
    jank: JankBuster
}

#[derive(Clone)]
pub struct Projector(Rc<RefCell<ProjectorImpl>>);

impl Projector {
    pub fn new(cg: &Rc<RefCell<CanvasGlobalInst>>) -> Projector {
        let mut out = Projector(Rc::new(RefCell::new(ProjectorImpl {
            cg: Rc::downgrade(cg),
            phase: 0,
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

    fn canvas_frame(&mut self, cg: &mut CanvasGlobal) {
        cg.draw();
    }

    fn machine_frame(&mut self, time: f64) {
        let cg = self.0.borrow_mut().cg.upgrade();
        let mut refresh = false;
        if let Some(cg) = cg {
            {
                let mut pi = self.0.borrow_mut();
                let gear = pi.jank.gear();
                pi.phase += 1;
                let d = pi.old_time.map(|old| time - old);
                pi.old_time = Some(time);
                if pi.phase >= gear {
                    pi.phase = 0;
                    refresh = true;
                    if let Some(d) = d {
                        pi.jank.detect(d as u32,time as f32/1000.0);
                    }
                }
            }
            cg.borrow_mut().run_timers(time);
            if refresh {
                self.canvas_frame(&mut cg.borrow_mut().cg);
            }
            self.another();
        } else {
            debug!("projector","stopping");
        }
    }

}
