use composit::Source;
use data::XferResponse;
use tácode::{ Tácode, TáSource };

const src: &str = r#"
    const #1, [10000,17000,20000,30000]
    const #2, [4000,1000]
    const #3, [1]
    const #4, [400]
    const #5, [255,120,0,120,255,0]
    strect #1, #2, #3, #4, #5
"#;

pub fn tá_source(tc: &Tácode) -> impl Source {
    let gc_xfer = XferResponse::new(src.to_string(),vec!{});
    TáSource::new(tc,gc_xfer)
}
