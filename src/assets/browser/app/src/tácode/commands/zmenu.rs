use std::sync::{ Arc, Mutex };

use composit::source::{ ActiveSource, PendingOrder };
use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature,
    Value
};

use tácode::core::{ TáContext, TáTask };

fn zmenu(sr: &mut PendingOrder, ids: &Vec<String>, keys: &Vec<String>, values: &Vec<String>) {
    let mut values = values.iter().cycle();
    for id in ids {
        let value = values.next();
        for key in keys {
            if let Some(value) = value {
                sr.get_traveller(&None).update_zml(|zml| zml.set_value(id,key,value));
            }
        }
    }
}

fn zmenu_assoc(sr: &mut PendingOrder, to_list: &Vec<String>, from_list: &Vec<String>) {
    let mut froms = from_list.iter().cycle();
    for to in to_list {
        let from = froms.next();
        if let Some(from) = from {
            sr.get_traveller(&None).update_zml(|zml| zml.set_assoc(to,from));
        }
    }
}

fn tmpl(sr: &mut PendingOrder, ids: &Vec<String>, sids: &Vec<String>) {
    let mut sids = sids.iter().cycle();
    for id in ids {
        let sid = sids.next();
        sr.get_traveller(&None).update_zml(|zml| zml.set_template(id,sid.unwrap()));
    }
}

fn tmpl_spec(sr: &mut PendingOrder, sids: &Vec<String>, specs: &Vec<String>) {
    let mut specs = specs.iter().cycle();
    for sid in sids {
        let spec = specs.next();
        sr.get_traveller(&None).update_zml(|zml| zml.add_template(sid,spec.unwrap()));
    }
}

// ztmpl #ids,#sids
pub struct ZTmpl(TáContext,usize,usize);
// ztmplspec #sids,#specs
pub struct ZTmplSpec(TáContext,usize,usize);
// zmenu #ids,#keys,#values
pub struct ZMenu(TáContext,usize,usize,usize);
// zassoc #ids-to, #ids-from
pub struct ZAssoc(TáContext,usize,usize);

impl Command for ZTmpl {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,_,sr,_,_,_,_,_) = task {
                regs.get(self.1).as_string(|sids| {
                    regs.get(self.2).as_string(|specs| {
                        tmpl(sr,sids,specs);
                    });
                });
            }
        });
        return 1;
    }
}

impl Command for ZTmplSpec {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,_,sr,_,_,_,_,_) = task {
                regs.get(self.1).as_string(|sids| {
                    regs.get(self.2).as_string(|specs| {
                        tmpl_spec(sr,sids,specs);
                    });
                });
            }
        });
        return 1;
    }
}

impl Command for ZMenu {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,_,sr,_,_,_,_,_) = task {
                regs.get(self.1).as_string(|ids| {
                    regs.get(self.2).as_string(|keys| {
                        regs.get(self.3).as_string(|values| {
                            zmenu(sr,ids,keys,values);
                        });
                    });
                });
            }
        });
        return 1;
    }
}

impl Command for ZAssoc {
    #[allow(irrefutable_let_patterns)]
    fn execute(&self, rt: &mut DataState, proc: Arc<Mutex<ProcState>>) -> i64 {
        let regs = rt.registers();
        let pid = proc.lock().unwrap().get_pid().unwrap();
        self.0.with_task(pid,|task| {
            if let TáTask::MakeShapes(_,_,sr,_,_,_,_,_) = task {
                regs.get(self.1).as_string(|to| {
                    regs.get(self.2).as_string(|from| {
                        zmenu_assoc(sr,to,from);
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

pub struct ZTmplI(pub TáContext);

impl Instruction for ZTmplI {
    fn signature(&self) -> Signature { Signature::new("ztmpl","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(ZTmpl(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}

pub struct ZMenuI(pub TáContext);

impl Instruction for ZMenuI {
    fn signature(&self) -> Signature { Signature::new("zmenu","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(ZMenu(self.0.clone(),args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

pub struct ZAssocI(pub TáContext);

impl Instruction for ZAssocI {
    fn signature(&self) -> Signature { Signature::new("zassoc","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<Command> {
        Box::new(ZAssoc(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}
