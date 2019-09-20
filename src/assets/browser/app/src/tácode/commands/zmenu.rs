use std::sync::{ Arc, Mutex };

use model::item::UnpackedProduct;
use model::supply::Subassembly;
use tánaiste::{
    Argument, Command, DataState, Instruction, ProcState, Signature
};

use tácode::core::{ TáContext, TáTask };

fn zmenu(po: &mut UnpackedProduct, ids: &Vec<String>, keys: &Vec<String>, values: &Vec<String>, sa: &Subassembly) {
    let mut values = values.iter().cycle();
    for id in ids {
        let value = values.next();
        for key in keys {
            if let Some(value) = value {
                po.update_data(sa,|data| data.get_zmenu_leaf().set_value(id,key,value));
            }
        }
    }
}

fn zmenu_assoc(po: &mut UnpackedProduct, to_list: &Vec<String>, from_list: &Vec<String>, sa: &Subassembly) {
    let mut froms = from_list.iter().cycle();
    for to in to_list {
        let from = froms.next();
        if let Some(from) = from {
            po.update_data(sa,|data| data.get_zmenu_leaf().set_assoc(to,from));
        }
    }
}

fn tmpl(po: &mut UnpackedProduct, ids: &Vec<String>, sids: &Vec<String>, sa: &Subassembly) {
    let mut sids = sids.iter().cycle();
    for id in ids {
        let sid = sids.next();
        po.update_data(sa,|data| data.get_zmenu_leaf().set_template(id,sid.unwrap()));
    }
}

fn tmpl_spec(po: &mut UnpackedProduct, sids: &Vec<String>, specs: &Vec<String>, sa: &Subassembly) {
    let mut specs = specs.iter().cycle();
    for sid in sids {
        let spec = specs.next();
        po.update_data(sa,|data| data.get_zmenu_leaf().add_template(sid,spec.unwrap()));
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
            if let TáTask::MakeShapes(_,_,sr,_,_,sa,_,_,_) = task {
                let sa = Subassembly::new(sa.as_ref().unwrap().get_product(),&None);
                regs.get(self.1).as_string(|sids| {
                    regs.get(self.2).as_string(|specs| {
                        tmpl(sr,sids,specs,&sa);
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
            if let TáTask::MakeShapes(_,_,sr,_,_,sa,_,_,_) = task {
                let sa = Subassembly::new(sa.as_ref().unwrap().get_product(),&None);
                regs.get(self.1).as_string(|sids| {
                    regs.get(self.2).as_string(|specs| {
                        tmpl_spec(sr,sids,specs,&sa);
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
            if let TáTask::MakeShapes(_,_,sr,_,_,sa,_,_,_) = task {
                let sa = Subassembly::new(sa.as_ref().unwrap().get_product(),&None);
                regs.get(self.1).as_string(|ids| {
                    regs.get(self.2).as_string(|keys| {
                        regs.get(self.3).as_string(|values| {
                            zmenu(sr,ids,keys,values,&sa);
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
            if let TáTask::MakeShapes(_,_,sr,_,_,sa,_,_,_) = task {
                let sa = Subassembly::new(sa.as_ref().unwrap().get_product(),&None);
                regs.get(self.1).as_string(|to| {
                    regs.get(self.2).as_string(|from| {
                        zmenu_assoc(sr,to,from,&sa);
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
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(ZTmplSpec(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}

pub struct ZTmplI(pub TáContext);

impl Instruction for ZTmplI {
    fn signature(&self) -> Signature { Signature::new("ztmpl","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(ZTmpl(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}

pub struct ZMenuI(pub TáContext);

impl Instruction for ZMenuI {
    fn signature(&self) -> Signature { Signature::new("zmenu","rrr") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(ZMenu(self.0.clone(),args[0].reg(),args[1].reg(),args[2].reg()))
    }
}

pub struct ZAssocI(pub TáContext);

impl Instruction for ZAssocI {
    fn signature(&self) -> Signature { Signature::new("zassoc","rr") }
    fn build(&self, args: &Vec<Argument>) -> Box<dyn Command> {
        Box::new(ZAssoc(self.0.clone(),args[0].reg(),args[1].reg()))
    }
}
