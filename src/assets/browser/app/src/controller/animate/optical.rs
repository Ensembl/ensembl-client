use std::sync::{ Arc, Mutex };
use controller::global::{ App, AppRunner };
use controller::input::Action;
use types::CDFraction;

pub struct OpticalImpl {
    missing: f64,
    target: f64,
    pos: Option<(CDFraction,f64)>,
    locked: bool
}

const LETHARGY : f64 = 0.2;
const EPS : f64 = 0.001;

impl OpticalImpl {
    pub fn new() -> OpticalImpl {
        OpticalImpl {
            missing: 0.,
            target: 0.,
            pos: None,
            locked: false,
        }
    }

    fn send_delta(&mut self, app: &mut App, amt: f64) {
        if let Some((pos,prop)) = self.pos {
            app.run_actions(&vec! {
                Action::Zoom(amt),
                Action::Pos(pos,Some(prop))
            },None);
            self.target = 0.;
        }
    }

    fn tick(&mut self, app: &mut App, _t: f64) {
        if self.missing.abs() > EPS {
            if !self.locked {
                app.with_counter(|c| c.lock());
                self.locked = true;
            }
            let this_time = self.missing * LETHARGY;
            self.missing -= this_time;
            self.send_delta(app,this_time);
        } else if self.locked {
            self.send_delta(app,self.missing);
            self.missing = 0.;
            app.run_actions(&vec![
                Action::Settled
            ],None);
            self.locked = false;
            app.with_counter(|c| c.unlock());
        }
    }
        
    /* when mouse moves, so does the handle */
    fn shift_handle_by(&mut self, at: f64, pos: CDFraction, prop: f64) {
        self.target += at;
        self.missing += at;
        self.pos = Some((pos,prop));
    }
}

#[derive(Clone)]
pub struct Optical(Arc<Mutex<OpticalImpl>>);

impl Optical {
    pub fn new(ru: &mut AppRunner) -> Optical {
        let out = Optical(Arc::new(Mutex::new(OpticalImpl::new())));
        let c = out.clone();
        ru.add_timer("optical",move |cg,t,_| { c.clone().tick(cg,t); vec!{} },1);
        out
    }

    pub fn tick(&mut self, cg: &mut App, t: f64) {
        self.0.lock().unwrap().tick(cg,t);
    }

    pub fn move_by(&mut self, by: f64, pos: CDFraction, prop: f64) {
        self.0.lock().unwrap().shift_handle_by(by,pos,prop);
    }
}
