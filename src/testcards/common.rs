use dom;
use testcards::visual::testcard_visual;

pub fn testcard(name: &str, inst: &str) {
    debug!("global","starting testcard {} inst={}",name,inst);
    match name {
        "draw" => testcard_visual(false,inst),
        "onoff" => testcard_visual(true,inst),
        _ => ()
    };
}
