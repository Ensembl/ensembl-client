use debug;

const MAX_GEAR : u32 = 4;
const MAX_GRACE: u32 = 300;
const JANK_WINDOW: f32 = 60.;

pub struct JankBuster {
    gear: u32,    
    grace_next: (u32,u32),
    grace_at: f32,
    last_down: bool,
}

fn fib_inc(val: (u32,u32)) -> (u32,u32) {
    (val.1,val.0+val.1)
}

fn fib_dec(val: (u32,u32)) -> (u32,u32) {
    if val.1 > val.0 {
        (val.1-val.0,val.0)
    } else {
        (1,1)
    }
}

impl JankBuster {
    pub fn new() -> JankBuster {
        JankBuster {
            gear: 1,
            grace_next: (1,1),
            grace_at: 0.,
            last_down: true,
        }
    }

    pub fn detect(&mut self, delta: u32, time: f32) {
        if delta > self.gear as u32 * 20 {
            if self.gear < MAX_GEAR {
                /* Go up a gear */
                if self.last_down {
                    /* Hunting */
                    if time > self.grace_at {
                        /* Successful, long hunt. Shorten */
                        self.grace_next = fib_dec(self.grace_next);
                    } else {
                        /* Failure, short hunt. Lengthen */
                        if self.grace_next.1 < MAX_GRACE {
                            self.grace_next = fib_inc(self.grace_next);
                        }
                    }
                } else {
                    /* Moving */
                    self.grace_next = (1,1);
                }
                self.grace_at = time + self.grace_next.1 as f32;
                self.last_down = false;
                self.gear += 1;
                debug!("jank gear",">gear {:?} {:?}",self.gear,self.grace_next.1);
            }
        }
        if self.grace_at <= time && self.gear > 1 {
            /* Go down a gear */
            if self.last_down {
                /* Moving */
                self.grace_next = (1,1);
            }
            self.grace_at = time + JANK_WINDOW;
            self.last_down = true;
            self.gear -= 1;
            debug!("jank gear","<gear {:?} {:?}",self.gear,self.grace_next.1);
        }
    }
    
    pub fn gear(&self) -> u32 { self.gear }
}
