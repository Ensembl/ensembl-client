use composit::{ Compositor, Leaf };
use model::stage::{ Screen, Position };
use model::supply::PurchaseOrder;
use types::Dot;

use super::DriverTraveller;
use model::train::{ CarriageId, Traveller, TravellerId };

pub trait Printer {
    /* Print one run of objects from compositor with given stage and
     * state.
     */
    fn print(&mut self, screen: &Screen, position: &Position, compo: &mut Compositor);
    
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
    fn make_driver_traveller(&mut self, ti: &TravellerId) -> Box<DriverTraveller>;
}
