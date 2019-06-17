use std::sync::{ Arc, Mutex };

use composit::source::ActiveSource;
use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use tácode::core::{ TáContext, TáTask };

fn tmpl_spec(asrc: &mut ActiveSource, sids: &Vec<String>, specs: &Vec<String>) {
    asrc.with_zmr(|zmr| {
        let mut specs = specs.iter().cycle();
        for sid in sids {
            let spec = specs.next();
            console!("sid/spec {:?}/{:?}",sid,spec);
            zmr.add_template(sid,spec.unwrap());
        }
    });
}

// ztmplspec #sids,#specs
pub struct ZTmplSpec(TáContext,usize,usize);

impl Command for ZTmplSpec {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(asrc,_,_,_,_,_,_) = task {
                regs.get(self.1).as_string(|sids| {
                    regs.get(self.2).as_string(|specs| {
                        tmpl_spec(asrc,sids,specs);
                    });
                });
            }
        });
        return 1;
    }
}

pub struct ZTmplSpecI(pub TáContext);

impl Instruction for ZTmplSpecI {
    fn signature(&self) -> Signature { Signature::new("ztmplspec","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(ZTmplSpec(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}
