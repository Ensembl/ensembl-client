use stdweb::unstable::TryInto;

use tánaiste::Environment;

pub struct AppEnv {
}

impl AppEnv {
    pub fn new() -> AppEnv {
        AppEnv {
        }
    }
}

impl Environment for AppEnv {
    fn get_time(&mut self) -> i64 {
        let t : f64 = js! { return +new Date(); }.try_into().unwrap();
        t as i64
    }
    
    fn finished(&mut self, pid: usize, codes: Vec<f64>, string: String) {
        console!("pid={:?} codes={:?} string={:?}",pid,codes,string);
    }
}
