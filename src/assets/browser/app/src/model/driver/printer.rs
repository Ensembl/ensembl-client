use crate::composit::Compositor;
use crate::model::stage::Screen;
use crate::types::Dot;

use super::DriverTraveller;
use crate::controller::global::WindowState;
use crate::model::train::{ CarriageId, TravellerId };
use crate::model::item::UnpackedSubassembly;

pub trait Printer {
    /* Print one run of objects from compositor with given stage and
     * state.
     */
    fn print(&mut self, screen: &Screen, window: &mut WindowState);
    
    /* Redraw one carriage */
    fn redraw_carriage(&mut self, leaf: &CarriageId);
    
    /* Finished with printer */
    fn destroy(&mut self);
    
    /* Set your size to this */
    fn set_size(&mut self, s: Dot<f64,f64>);
    
    /* no recent resizes, etc */
    fn settle(&mut self);
    
    /* How much size is available to expand into, should you be
     * requested to do so?
     */
    fn get_available_size(&self) -> Dot<f64,f64>;
    
    fn add_carriage(&mut self, id: &CarriageId);
    fn remove_carriage(&mut self, id: &CarriageId);
    fn make_driver_traveller(&mut self, ti: &TravellerId, data: UnpackedSubassembly) -> Box<dyn DriverTraveller>;
}
