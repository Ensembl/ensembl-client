use std::sync::{ Arc, Mutex };
use types::{ CFraction, cfraction, CPixel, CDFraction, cdfraction };
use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ Event, events_run };
use types::{ Move, Distance, Units, ddiv };

pub struct MousePhysicsImpl {
    last_t: Option<f64>,              /* last update */
    force_origin: Option<CDFraction>, /* spring anchor */
    mouse_pos: Option<CDFraction>,    /* spring free-end */
    drive: Option<CDFraction>,        /* driving force */
    accel: CDFraction,                /* accel */
    vel: CDFraction,                  /* vel */
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

const LETHARGY : f64 = 3500.;
const BOING : f64 = 1.00;

impl MousePhysicsImpl {
    pub fn set_drive(&mut self, f: CDFraction) {
        self.drive = Some(f);
    }
    
    pub fn run_dynamics(&mut self, t: f64) -> CDFraction {
        let dt = cdfraction(t as f64,t as f64);
        let mut f = ddiv(self.drive.unwrap_or(cdfraction(0.,0.)),cdfraction(LETHARGY,LETHARGY));
        /* apply friction */
        let crit = (4./LETHARGY).sqrt()/BOING; // critical damping eq'n.
        let friction = (cdfraction(0.,0.) - self.vel) * cdfraction(crit,crit);
        f = f + friction;
        /* Run ODE */
        self.accel = f;
        self.vel = self.vel + self.accel * dt;
        return self.vel * dt;
    }

    pub fn move_by(&mut self, cg: &CanvasState, dx: CDFraction) {
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

impl MousePhysics {
    pub fn new(ru: &mut CanvasRunner) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl {
            last_t: None,
            force_origin: None,
            mouse_pos: None,
            drive: None,
            accel: cdfraction(0.,0.),
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
            let dx = mp.run_dynamics(dt);
            mp.move_by(cg,dx);
        }
    }

    pub fn down(&mut self, e: CPixel) {
        let mut mp = self.0.lock().unwrap();
        mp.accel = cdfraction(0.,0.);
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
