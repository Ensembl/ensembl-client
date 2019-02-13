use composit::Source;
use tácode::{ Tácode, TáSource };

pub fn tá_source(tc: &Tácode) -> impl Source {
    TáSource::new(tc)
}
