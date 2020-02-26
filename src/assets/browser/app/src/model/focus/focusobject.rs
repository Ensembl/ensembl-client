use super::focusobjectid::FocusObjectId;
use crate::composit::Stick;
use crate::model::stage::Position;

#[derive(Clone)]
pub enum ObjectLocation {
    Unknowable, /* We /know/ this object has no location (eg startup, or no focus object selected) */
    Unknown,    /* We don't know the location of this object or even if it has one at all*/
    Location(Stick,f64,f64) // XXX ADT
}

pub struct FocusObject {
    id: FocusObjectId,
    location: ObjectLocation,
    ongoing_investigation: bool
}

impl FocusObject {
    pub fn new(id: &FocusObjectId) -> FocusObject {
        let location = match id.get_focus() {
            Some(_) => ObjectLocation::Unknown,
            None => ObjectLocation::Unknowable
        };
        FocusObject { id: id.clone(), location, ongoing_investigation: false }
    }

    pub fn get_id(&self) -> &FocusObjectId { &self.id }
    pub fn get_location(&self) -> &ObjectLocation { &self.location }
    pub fn get_ongoing_investigation(&self) -> bool { self.ongoing_investigation }

    pub fn maybe_investigate(&mut self) -> bool {
        match self.location {
            ObjectLocation::Unknown => {
                if !self.ongoing_investigation {
                    self.ongoing_investigation = true;
                    return true;
                }
            }
            _ => {}
        }
        false
    }

    pub fn set_location(&mut self, location: &ObjectLocation) {
        self.location = location.clone();
        self.ongoing_investigation = false;
    }
}
