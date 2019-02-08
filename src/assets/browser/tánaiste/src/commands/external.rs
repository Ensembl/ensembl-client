use std::process;
use std::sync::{ Arc, Mutex };
use std::{ thread, time };

use core::{ Command, RuntimeData, RuntimeProcess, Value };
use util::ValueStore;

struct Result {
    exit_code: i32,
    stdout: String,
    stderr: String
}

lazy_static! {
    static ref results: Arc<Mutex<ValueStore<Option<Result>>>> =
        Arc::new(Mutex::new(ValueStore::<Option<Result>>::new()));
}

pub struct External {
    code_reg: usize,
    stdout_reg: Option<usize>,
    stderr_reg: Option<usize>,
    cmd_str: String,
}

impl External {
    pub fn new(code_reg: usize, stdout_reg: Option<usize>, stderr_reg: Option<usize>,command: &str) -> Box<Command> {
        Box::new(External {
            code_reg, stdout_reg, stderr_reg,
            cmd_str: command.to_string()
        })
    }
}

impl Command for External {
    fn execute(&self, data: &mut RuntimeData, proc: Arc<Mutex<RuntimeProcess>>) {
        let r = data.continuations().get(1).value();
        let rv = r.borrow();
        let retry = rv.value_float();
        if let Some(ref retry) = retry {
            if retry.len() > 0 && retry[0] > 0. {
                let s = &mut results.lock().unwrap();
                let res = s.unstore(retry[0] as usize-1).unwrap();
                data.registers().set(self.code_reg,Value::new_from_float(vec! {
                    res.exit_code as f64
                }));
                if let Some(stdout_reg) = self.stdout_reg {
                    data.registers().set(stdout_reg,
                        Value::new_from_string(res.stdout));                    
                }
                if let Some(stderr_reg) = self.stderr_reg {
                    data.registers().set(stderr_reg,
                        Value::new_from_string(res.stderr));                    
                }
                return;
            }
        }
        let r_idx = results.lock().unwrap().store(None);
        data.set_again();
        data.continuations().set(1,Value::new_from_float(vec!{ (r_idx+1) as f64 }));
        let cmd_str = self.cmd_str.clone();
        proc.lock().unwrap().sleep();
        let res = results.clone();
        thread::spawn(move || {
            let c = process::Command::new("bash")
                        .arg("-c").arg(cmd_str)
                        .stdout(process::Stdio::piped())
                        .stderr(process::Stdio::piped())
                        .spawn().ok().unwrap();
            let output = c.wait_with_output().ok().unwrap();
            let exit_code = output.status.code().unwrap_or(-1);
            let s = &mut res.lock().unwrap();
            s.replace(r_idx,Some(Result {
                exit_code,
                stdout: String::from_utf8_lossy(&output.stdout).clone().to_string(),
                stderr: String::from_utf8_lossy(&output.stderr).clone().to_string(),
            }));
            proc.lock().unwrap().wake();
        });
    }
}
