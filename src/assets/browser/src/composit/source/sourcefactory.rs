use composit::Carriage;

pub struct SourceFactory {
}

impl SourceFactory {
    pub fn new() -> SourceFactory {
        SourceFactory {}
    }
    
    pub fn populate_carriage(&mut self, c: &Carriage) {
        debug!("sources","{:?}",c);
        c.populate();
    }
}
