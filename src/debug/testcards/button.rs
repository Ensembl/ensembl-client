use debug;
use campaign::{ StateManager };
use debug::testcards::bigscience::big_science;
use arena::Stage;

pub fn testcard_button() {
    let mut stage = Stage::new();
    let oom = StateManager::new();

    button!("left");
    button!("right");
    button!("in");
    button!("out");

    let mut a = big_science(&oom,&mut stage,false);
    a.draw(&oom,&stage);
}
