use hashbrown::HashSet;
use crate::{ Commander, CommanderIntegration };
use crate::test::testintegration::TestIntegration;

use blackbox::{ blackbox_use_threadlocals, blackbox_integration, blackbox_take_lines, blackbox_enable };

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