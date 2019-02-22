/* This is a placeholder for more sophisticated y-coodinate handling
 * in future. In general a Landscape will include multiple plots and
 * maybe other things, in different roles.
 */

use std::sync::Mutex;

use super::Plot;

pub struct Landscape {
    lid: Option<usize>,
    plot: Option<Plot>,
}

impl Landscape {
    pub(in super) fn new() -> Landscape {
        Landscape { plot: None, lid: None }
    }
    
    pub(in super) fn set_lid(&mut self, lid: usize) {
        self.lid = Some(lid);
    }
    
    pub fn get_plot(&self) -> &Plot {
        &self.plot.as_ref().unwrap()
    }
    
    pub fn set_plot(&mut self, plot: Plot) {
        self.plot = Some(plot);
    }
}
