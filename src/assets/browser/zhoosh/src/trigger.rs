use super::sequence::{ ZhooshSequence, ZhooshStepHandle };

pub(super) struct ZhooshTrigger {
    delay: f64,
    prop: f64,
    handle: ZhooshStepHandle
}

impl ZhooshTrigger {
    pub(super) fn new(prop: f64, delay: f64, handle: ZhooshStepHandle) -> ZhooshTrigger {
        ZhooshTrigger { prop, handle, delay }
    }

    pub(super) fn get_delay(&self) -> f64 { self.delay }

    pub(super) fn ready(&self, handler: &ZhooshSequence) -> bool {
        /* how far through is this dependency? */
        let prop = handler.resolve_handle(&self.handle).get_prop();
        /* is the dependency even started yet? */
        if prop.is_none() { return false; }
        /* dependency satisfied? */
        if prop.unwrap() < self.prop { return false; }
        return true;
    }
}
