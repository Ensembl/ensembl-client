use super::runner::ZhooshSequence;
use super::step::ZhooshStep;

pub(super) struct ZhooshStepState {
    spec: ZhooshStep,
    started: Option<f64>,
    delay: Option<f64>,
    prop: Option<f64>,   
}

impl ZhooshStepState {
    pub(super) fn new(spec: ZhooshStep) -> ZhooshStepState {
        ZhooshStepState {
            spec,
            started: None,
            delay: None,
            prop: None,
        }
    }

    pub(super) fn get_spec(&mut self) -> &mut ZhooshStep { &mut self.spec }
    fn get_prop(&self) -> Option<f64> { self.prop }

    fn startable(&mut self, now: f64, handler: &ZhooshSequence) -> bool {
        if let Some(delay_start) = self.delay {
            /* dependency already triggered. awaiting a delay timeout? */
            return now-delay_start >= self.spec.get_delay();
        } else {
            for trigger in self.spec.dependencies() {
                /* how far through is this dependency? */
                let prop = handler.resolve_handle(&trigger.handle).get_prop();
                /* is the dependency even started yet? */
                if prop.is_none() { return false; }
                /* dependency satisfied? */
                if prop.unwrap() < trigger.prop { return false; }
            }
            if self.spec.get_delay() > 0. {
                /* start delay timer */
                self.delay = Some(now);
                return false;
            } else {
                /* go immediate */
                return true;
            }
        }
    }

    fn update_prop(&mut self, now: f64, handler: &ZhooshSequence) {
        /* new starter? */
        if self.prop.is_none() && self.startable(now,handler) {
            self.prop = Some(0.);
            self.started = Some(now);
        }
        /* update prop */
        if self.prop.is_some() && self.started.is_some() {
            self.prop = Some(self.spec.calc_prop(now-self.started.unwrap()));
        }
        /* callback */
        if self.started.is_some() {
            self.spec.set(self.prop.unwrap());
        }
        /* finished? */
        if self.started.is_some() && self.prop.unwrap() >= 1. {
            self.started = None;
        }
    }

    pub(super) fn step(&mut self, now: f64, handler: &ZhooshSequence) -> bool {
        self.update_prop(now,handler);
        if self.prop.is_some() && self.started.is_none() { return false; }
        return true;
    }
}
