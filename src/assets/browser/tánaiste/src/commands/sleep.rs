use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use assembly::{ Argument, Signature };
use core::{ Command, Instruction, Value };
use runtime::{ DataState, ProcState };

#[derive(Debug)]
pub struct Sleep(usize);

impl Command for Sleep {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let mut ms = data.registers().get(self.0).as_floats(|f|
            f.get(0).map(|s| *s).unwrap_or(0.)
        );
        if let Some(remaining) = proc.lock().unwrap().get_remaining() {
            ms = ms.min(remaining as f64);
        }
        proc.lock().unwrap().sleep();
        thread::spawn(move || {
            thread::sleep(time::Duration::from_millis(ms as u64));
            proc.lock().unwrap().wake();
        });
        return 1;
    }
}

pub struct SleepI();

impl Instruction for SleepI {
    fn signature(&self) -> Signature { Signature::new("sleep","r") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(Sleep(args[0].reg()))
    }
}

#[derive(Debug)]
pub struct PoSleep(usize,usize,usize);

impl Command for PoSleep {    
    fn execute(&self, data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let mut ms = data.registers().get(self.2).as_floats(|f|
            f.get(0).map(|s| *s).unwrap_or(0.)
        );
        if let Some(remaining) = proc.lock().unwrap().get_remaining() {
            ms = ms.min(remaining as f64);
        }
        let mut polls = proc.lock().unwrap().polls().clone();
        /* allocate poll fd and assign */
        let g = data.registers().get(self.1).as_floats(|f| *f.get(0).unwrap_or(&0.));
        let id = polls.allocate(g);
        data.registers().set(self.0,Value::new_from_float(vec![ id ]));
        /* set sleep going */
        thread::spawn(move || {
            thread::sleep(time::Duration::from_millis(ms as u64));
            polls.on_off(g,id,true);
        });
        return 1;
    }
}

pub struct PoSleepI();

impl Instruction for PoSleepI {
    fn signature(&self) -> Signature { Signature::new("posleep","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(PoSleep(args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

#[derive(Debug)]
pub struct Halt();

impl Command for Halt {
    fn execute(&self, _data: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        proc.lock().unwrap().halt();
        return 0;
    }
}

pub struct HaltI();

impl Instruction for HaltI {
    fn signature(&self) -> Signature { Signature::new("halt","") }
    fn build(&self, _args: &Vec<Argument>) -> Box<Command> {
        Box::new(Halt())
    }
}

#[cfg(test)]
mod test {
    use std::{ thread, time };
    use std::time::Instant;
    use runtime::{ Interp, DEFAULT_CONFIG, PROCESS_CONFIG_DEFAULT };
    use test::{ command_make, command_compile, DebugEnvironment };

    #[test]
    fn sleep_cmd() {
        let mut r = command_make("sleep");
        r.run();
        let mut num_f = 0;
        for _ in 0..20 {
            if r.ready() { break; }
            num_f += 1;
            thread::sleep(time::Duration::from_millis(10));
        }
        assert!(num_f > 5);
        assert!(num_f < 15);
        r.run();
    }

    #[test]
    fn sleep_inter() {
        let start = Instant::now();
        let mut pc = PROCESS_CONFIG_DEFAULT.clone();
        pc.time_limit = Some(100);        
        let bin = command_compile("sleep-inter");
        let t_env = DebugEnvironment::new();
        let mut t = Interp::new(t_env.make(),DEFAULT_CONFIG);
        let pid = t.exec(&bin,None,Some(&pc)).ok().unwrap();
        while t.status(pid).state.alive() {
            while t.run(1000) {}
            thread::sleep(time::Duration::from_millis(50));
        }
        let took = Instant::now().duration_since(start);
        assert!(took.as_millis() > 50);
        assert!(took.as_millis() < 1000);
    }
}
