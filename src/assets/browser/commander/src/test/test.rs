use regex::Regex;
use std::marker::PhantomData;
use std::thread;
use std::time::Duration;
use hashbrown::HashSet;
use crate::{ Commander, CommanderIntegration, RunConfig, future_to_step, StepState, step_sequence, step_recover };
use crate::test::testintegration::TestIntegration;
use crate::test::teststeps::{ Adder, Logger, CatchErrors, Waiter, Infinite, Sleeper, Blocker };

use blackbox::{ blackbox_use_threadlocals, blackbox_integration, blackbox_take_lines, blackbox_enable, blackbox_disable_all };

#[test]
pub fn test_harness_blackbox() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_enable("test-integration");
    let mut cmdr1 = Commander::new(itgn.clone());
    let mut cmdr2 = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr1);
    itgn.enable_ticks(&mut cmdr2);
    itgn.disable_ticks(&mut cmdr1,None);
    itgn.disable_ticks(&mut cmdr2,None);
    let lines = blackbox_take_lines();
    assert_eq!(4,lines.len());
    assert_eq!(2,lines.iter().filter(|x| x.contains("enabled")).count());
    assert_eq!(2,lines.iter().filter(|x| x.contains("disabled")).count());
    let lines2 : HashSet<String> = lines.iter().map(|x| x.replace("disabled","enabled")).collect();
    assert_eq!(2,lines2.len());
}

#[test]
pub fn test_harness_tick() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_enable("test-integration");
    let mut cmdr1 = Commander::new(itgn.clone());
    itgn.tick();
    itgn.enable_ticks(&mut cmdr1);
    let lines = blackbox_take_lines();
    assert_eq!(1,lines.len());
    assert!(lines[0].contains("[1]"));
}

#[test]
pub fn test_harness_unwait() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_enable("test-integration");
    let mut cmdr1 = Commander::new(itgn.clone());
    itgn.tick();
    itgn.enable_ticks(&mut cmdr1);
    itgn.disable_ticks(&mut cmdr1,Some(5.5));
    for _ in 0..10 {
        itgn.tick();
    }
    let lines = blackbox_take_lines();
    assert_eq!(5,lines.iter().filter(|x| x.contains(" tick ")).count());
}

fn extract_numbers() -> Result<i32,String> {
    let re_out = Regex::new(r"output: (\d+)").unwrap();
    let re_err = Regex::new(r"error: (.+)").unwrap();
    for line in blackbox_take_lines() {
        if let Some(caps) = re_out.captures(&line) {
            return caps.get(1).unwrap().as_str().parse().map_err(|_| "cannot parse".to_string());
        }
        if let Some(caps) = re_err.captures(&line) {
            return Err(caps.get(1).unwrap().as_str().to_string());
        }
    }
    return Err("not found".to_string());
}

fn adder_check(itgn: &mut TestIntegration, val: i32) -> Result<i32,String> {
    let mut cmdr = Commander::new(itgn.clone());
    let step = 
        step_recover(
            step_sequence(Adder::new(1),Logger(PhantomData)),
            CatchErrors()
        );
    itgn.enable_ticks(&mut cmdr);
    cmdr.add(step,val,RunConfig::new(None,0,None),&format!("add({})",val));
    itgn.tick();
    itgn.tick();
    itgn.tick();
    itgn.tick();
    itgn.disable_ticks(&mut cmdr,None);
    extract_numbers()
}

#[test]
pub fn test_harness_add() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_enable("test-logger");
    assert_eq!(3,adder_check(&mut itgn,2).ok().unwrap());
    assert_eq!(0,adder_check(&mut itgn,-1).ok().unwrap());
    assert_eq!("Cannot generate negative numbers",adder_check(&mut itgn,-2).err().unwrap());
}

async fn magic() -> i32 {
    42
}

#[test]
pub fn test_future_simple() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_enable("test-logger");
    let mut cmdr = Commander::new(itgn.clone());
    let step = step_sequence(future_to_step(magic()),Logger(PhantomData::<i32>));
    itgn.enable_ticks(&mut cmdr);
    cmdr.add(step,(),RunConfig::new(None,0,None),"future");
    itgn.tick();
    itgn.tick();
    let out = extract_numbers();
    assert_eq!(Ok(42),out);
}

#[test]
pub fn test_sequence() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    blackbox_disable_all();
    blackbox_enable("test-logger");
    blackbox_enable("scheduler-tasks");
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = 
        step_recover(
            step_sequence(Adder::new(1),Logger(PhantomData)),
            CatchErrors()
        );
    cmdr.add(step,2,RunConfig::new(None,0,None),&format!("sequence"));
    itgn.tick();
    itgn.tick();
    itgn.tick();
    itgn.tick();
    let lines = blackbox_take_lines();
    print!("lines: {:?}\n",lines);
}
pub fn block_test_part(itgn: &mut TestIntegration, bb_part: &str, stream: &Vec<&str>) {
    blackbox_disable_all();
    blackbox_enable(bb_part);
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Waiter::new(200,StepState::Done(Ok(23))),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,None),&format!("waiter"));
    for _ in 0..10 { itgn.tick(); }
    thread::sleep(Duration::from_millis(500));
    for _ in 0..5 { itgn.tick(); }
    let lines = blackbox_take_lines();
    assert_eq!(stream,&lines.iter().map(|x|&**x).collect::<Vec<_>>());
}

#[test]
pub fn test_block() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    block_test_part(&mut itgn,"scheduler-tasks",&vec!["[0][test] Add new task to run queue 'waiter'", 
                "[0][test] Run task 'waiter'",
                "[0][test] Remove task from run queue (blocked) 'waiter'",
                "[10][test] Unblocking task 'waiter'",
                "[10][test] Add new task to run queue 'waiter'",
                "[10][test] Run task 'waiter'",
                "[11][test] Run task 'waiter'",
                "[11][test] Remove task from run queue (done) 'waiter'"]);
    block_test_part(&mut itgn,"test-logger",&vec!["[26][test] output: 23"]);
}

#[test]
pub fn test_kill_basic() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Infinite(),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,Some(5.)),&format!("kill"));
    for _ in 0..10 { itgn.tick(); thread::sleep(Duration::from_millis(45)); }
    let lines = blackbox_take_lines();
    print!("lines\n{}",lines.join("\n"));
    assert_eq!(1,lines.iter().filter(|x| x.contains("kill -- timeout")).count());
}

#[test]
pub fn test_kill_wait() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Sleeper(1000.,0),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,Some(5.)),&format!("kill"));
    for _ in 0..10 { itgn.tick(); thread::sleep(Duration::from_millis(45)); }
    let lines = blackbox_take_lines();
    assert_eq!(1,lines.iter().filter(|x| x.contains("kill -- timeout")).count());
}

#[test]
pub fn test_kill_block() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Waiter::new(1000,StepState::Done(Ok(23))),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,Some(5.)),&format!("kill"));
    for _ in 0..10 { itgn.tick(); thread::sleep(Duration::from_millis(45)); }
    let lines = blackbox_take_lines();
    print!("lines\n{}",lines.join("\n"));
    assert_eq!(1,lines.iter().filter(|x| x.contains("kill -- timeout")).count());
}

#[test]
pub fn test_multi_sleep() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Sleeper(3.,0),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,None),&format!("kill"));
    for _ in 0..30 { itgn.tick(); thread::sleep(Duration::from_millis(45)); }
    let lines = blackbox_take_lines();
    assert_eq!(1,lines.iter().filter(|x| x.contains("[10][test] output: 42")).count());
    print!("lines\n{}",lines.join("\n"));

}

#[test]
pub fn test_multi_block() {
    blackbox_use_threadlocals(true);
    let mut itgn = TestIntegration::new();
    blackbox_integration(itgn.clone());
    let mut cmdr = Commander::new(itgn.clone());
    itgn.enable_ticks(&mut cmdr);
    let step = step_sequence(Blocker(100,0),Logger(PhantomData));
    cmdr.add(step,(),RunConfig::new(None,0,None),&format!("kill"));
    for _ in 0..30 { itgn.tick(); thread::sleep(Duration::from_millis(45)); }
    let lines = blackbox_take_lines();
    assert_eq!(1,lines.iter().filter(|x| x.contains("[10][test] output: 42")).count());
    print!("lines\n{}",lines.join("\n"));

}
