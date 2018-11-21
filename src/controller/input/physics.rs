use std::f64::consts::PI;
use std::sync::{ Arc, Mutex };
use types::{ CPixel, CDFraction, cdfraction };
use controller::global::{ CanvasState, CanvasRunner };
use controller::input::{ Event, events_run };
use types::{ Move, Distance, Units, ddiv, Dot };

pub struct MousePhysicsImpl {
    last_t: Option<f64>,              /* last update */
    force_origin: Option<CDFraction>, /* spring attachment point */
    mouse_pos: Option<CDFraction>,    /* spring handle */
    drive: Option<CDFraction>,        /* driving force */
    vel: CDFraction,                  /* vel */
}

#[derive(Clone)]
pub struct MousePhysics(Arc<Mutex<MousePhysicsImpl>>);

const LETHARGY : f64 = 3500.;
const BOING : f64 = 1.00;
const EPS : f64 = 0.01;
const MUL: i32 = 20;
const MAXPERIOD : f64 = 100.;
const STICKFORCE : f64 = 75.;

impl MousePhysicsImpl {
    fn new() -> MousePhysicsImpl {
        MousePhysicsImpl {
            last_t: None,
            force_origin: None,
            mouse_pos: None,
            drive: None,
            vel: cdfraction(0.,0.),
        }
    }
    
    fn apply_stiction(&mut self, f: &CDFraction) -> CDFraction {
        let mut out = *f;
        if out.1.abs() < STICKFORCE {
            out.1 = 0.;
        }
        out
    }
    
    fn set_drive(&mut self, f: CDFraction) {
        let f = self.apply_stiction(&f);
        self.drive = Some(f);
    }
        
    fn run_dynamics(&mut self, t: f64) -> Option<CDFraction> {
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

    fn significant_move(&self, dx: &CDFraction) -> bool {
        dx.0.abs() > EPS || dx.1.abs() > EPS
    }

    fn make_events(&self, cg: &CanvasState, dx: &CDFraction) {
        events_run(cg,vec! {
            Event::Move(Move::Left(Distance(dx.0,Units::Pixels))),
            Event::Move(Move::Up(Distance(dx.1,Units::Pixels)))
        });
    }

    /* when the canvas moves, the "attachment point" moves with it.
     * Even if the attachment stalls (eg at edges) the attachment point
     * skids to fully use up the mouse move ready for the next valid
     * move.
     */
    fn shift_attachment_with_canvas(&mut self, dx: &CDFraction) {
        if let Some(force_origin) = self.force_origin {
            self.force_origin = Some(force_origin + *dx);
            if let Some(mouse_pos) = self.mouse_pos {
                self.set_drive(mouse_pos - force_origin);
            }
        } else {
            self.drive = None;
        }        
    }
    
    /* when mouse moves, so does the handle */
    fn shift_handle_to(&mut self, e: &CPixel) {
        let at = e.as_dfraction();
        self.mouse_pos = Some(at);
        if let Some(force_origin) = self.force_origin {
            self.set_drive(at - force_origin);
        }
    }

    fn move_by(&mut self, cg: &CanvasState, dx: CDFraction) {
        if self.significant_move(&dx) {
            self.make_events(cg,&dx);
            self.shift_attachment_with_canvas(&dx);
        }
    }
    
    fn calc_delta(&mut self, t: f64) -> Option<f64> {
        let mut out = None;
        if let Some(last_t) = self.last_t {
            out = Some(t - last_t);
        }
        self.last_t = Some(t);
        out
    }
    
    fn physics_step(&mut self, cg: &CanvasState, dt: f64) -> bool {
        if let Some(dx) = self.run_dynamics(dt) {
            self.move_by(cg,dx);
        } else if self.force_origin.is_some() {
            /* Couldn't run dynamics (step too long?). Reset. */
            self.force_origin = self.mouse_pos;
            return false;
        }
        true
    }
    
    fn tick(&mut self, cg: &CanvasState, t: f64) {
        if let Some(dt) = self.calc_delta(t) {
            for _i in 0..MUL {
                if !self.physics_step(cg,dt/MUL as f64) { break; }
            }
        }
        if self.force_origin.is_none() {
            cg.with_stage(|s| s.settle());
        }
    }
    
    fn mouse_down(&mut self, e: CPixel) {
        self.vel = cdfraction(0.,0.);
        self.force_origin = Some(e.as_dfraction());
        self.mouse_pos = Some(e.as_dfraction());        
    }
    
    fn mouse_up(&mut self) {
        self.force_origin = None;
    }
}

impl MousePhysics {
    pub fn new(ru: &mut CanvasRunner) -> MousePhysics {
        let out = MousePhysics(Arc::new(Mutex::new(MousePhysicsImpl::new())));
        let c = out.clone();
        ru.add_timer(move |cg,t| c.clone().tick(cg,t));
        out
    }

    pub fn tick(&mut self, cg: &CanvasState, t: f64) {
        self.0.lock().unwrap().tick(cg,t);
    }

    pub fn down(&mut self, e: CPixel) {
        self.0.lock().unwrap().mouse_down(e);
    }
    
    pub fn up(&mut self) {
        self.0.lock().unwrap().mouse_up();
    }

    pub fn move_to(&mut self, e: CPixel) {
        self.0.lock().unwrap().shift_handle_to(&e);
    }
}
