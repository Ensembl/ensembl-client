use campaign::{ StateManager };
use testcards::bigscience::big_science;
use arena::Stage;

pub fn testcard_button() {
    let mut stage = Stage::new();
    let oom = StateManager::new();

    let mut a = big_science(&oom,&mut stage,false);
    a.draw(&oom,&stage);
}
