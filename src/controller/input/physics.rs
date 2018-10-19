use std::sync::{ Arc, Mutex };
use types::{ CPixel, CDFraction, cdfraction };
use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ Event, events_run };
use types::{ Move, Distance, Units, ddiv };

pub struct MousePhysicsImpl {
    last_t: Option<f64>,              /* last update */
    force_origin: Option<CDFraction>, /* spring anchor */
    mouse_pos: Option<CDFraction>,    /* spring free-end */
    drive: Option<CDFraction>,        /* driving force */
    vel: CDFraction,                  /* vel */
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

const LETHARGY : f64 = 3500.;
const BOING : f64 = 1.00;
const EPS : f64 = 0.01;
const MUL: i32 = 20;
const MAXPERIOD: f64 = 100.;

impl MousePhysicsImpl {
    pub fn set_drive(&mut self, f: CDFraction) {
        self.drive = Some(f);
    }
        
    pub fn run_dynamics(&mut self, t: f64) -> Option<CDFraction> {
        if t > MAXPERIOD { return None; }
        let drive = self.drive.unwrap_or(cdfraction(0.,0.));
        let drive = ddiv(drive,cdfraction(LETHARGY,LETHARGY));
        /* apply friction */
        let crit = (4./LETHARGY).sqrt()/BOING; // critical damping eq'n.
        let friction = self.vel * cdfraction(-crit,-crit);
        let dtv = cdfraction(t,t);
        self.vel = self.vel + (drive+friction) * dtv;
        Some(self.vel * dtv)
    }

    pub fn move_by(&mut self, cg: &CanvasState, dx: CDFraction) {
        if dx.0.abs() > EPS || dx.1.abs() > EPS {
            events_run(cg,vec! {
                Event::Move(Move::Left(Distance(dx.0,Units::Pixels))),
                Event::Move(Move::Up(Distance(dx.1,Units::Pixels)))
            });
            if let Some(force_origin) = self.force_origin {
                self.force_origin = Some(force_origin + dx);
                if let Some(mouse_pos) = self.mouse_pos {
                    self.set_drive(mouse_pos - force_origin);
                }
            } else {
                self.drive = None;
            }
        }
    }
}

impl MousePhysics {
    pub fn new(ru: &mut CanvasRunner) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl {
            last_t: None,
            force_origin: None,
            mouse_pos: None,
            drive: None,
            vel: cdfraction(0.,0.),
        })));
        let c = out.clone();
        ru.add_timer(move |cg,t| c.clone().tick(cg,t));
        out
    }

    pub fn tick(&mut self, cg: &CanvasState, t: f64) {
        let mut mp = self.0.lock().unwrap();
        let mut dt = None;
        {
            if let Some(last_t) = mp.last_t {
                dt = Some(t - last_t);
            }
            mp.last_t = Some(t);
        }
        if let Some(dt) = dt {
            for _i in 0..MUL {
                if let Some(dx) = mp.run_dynamics(dt/MUL as f64) {
                    mp.move_by(cg,dx);
                } else if mp.force_origin.is_some() {
                    mp.force_origin = mp.mouse_pos;
                    break;
                }
            }
        }
    }

    pub fn down(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        mp.vel = cdfraction(0.,0.);
        mp.force_origin = Some(e.as_dfraction());
        mp.mouse_pos = Some(e.as_dfraction());
    }
    
    pub fn up(&mut self) {
        let mut mp = self.0.lock().unwrap();
        mp.force_origin = None;
    }

    pub fn move_to(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        let at = e.as_dfraction();            
        mp.mouse_pos = Some(at);
        if let Some(force_origin) = mp.force_origin {
            mp.set_drive(at - force_origin);
        }
    }
}
