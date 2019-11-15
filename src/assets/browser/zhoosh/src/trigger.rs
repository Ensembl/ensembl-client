use super::sequence::{ ZhooshSequence, ZhooshStepHandle };

pub(super) struct ZhooshTrigger {
    prop: f64,
    handle: ZhooshStepHandle
}

impl ZhooshTrigger {
    pub(super) fn new(prop: f64, handle: ZhooshStepHandle) -> ZhooshTrigger {
        ZhooshTrigger { prop, handle }
    }

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
