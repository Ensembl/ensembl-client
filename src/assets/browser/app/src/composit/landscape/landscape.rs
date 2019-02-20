/* This is a placeholder for more sophisticated y-coodinate handling
 * in future. In general a Landscape will include multiple plots and
 * maybe other things, in different roles.
 */

use super::Plot;

#[derive(Clone)]
pub struct Landscape {
    plot: Plot
}

impl Landscape {
    pub fn new(plot: Plot) -> Landscape {
        Landscape { plot }
    }
    
    pub fn get_plot(&self) -> &Plot {
        &self.plot
    }
}
