use debug;
use campaign::{ StateManager };
use debug::testcards::bigscience::big_science;
use debug::pane::ButtonActionImpl;
use arena::Stage;

pub fn testcard_button() {
    let mut stage = Stage::new();
    let oom = StateManager::new();

    button!("left",|| { debug!("global","left") });
    button!("right",|| { debug!("global","right") });
    button!("in",|| { debug!("global","in") });
    button!("out",|| { debug!("global","out") });

    let mut a = big_science(&oom,&mut stage,false);
    a.draw(&oom,&stage);
}
