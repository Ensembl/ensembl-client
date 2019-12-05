use crate::{
    blackbox_enable, blackbox_integration, blackbox_log, blackbox_take_lines, blackbox_disable, blackbox_is_enabled,
    blackbox_config, blackbox_raw_on, blackbox_format
};

use super::harness::{ TestIntegration, lines_contains };

#[test]
pub fn test_blackbox_log() {
    let ign = TestIntegration::new("test1");
    blackbox_integration(ign.clone(),true);
    blackbox_enable("test");
    blackbox_log!("test","Hello, world!");
    assert_eq!("[0][test1] Hello, world!",blackbox_take_lines().join("\n"));
}

#[test]
pub fn test_blackbox_count() {
    let ign = TestIntegration::new("test1");
    blackbox_integration(ign.clone(),true);
    blackbox_enable("test");
    blackbox_count!("test","noraw",42.);
    blackbox_reset_count!("test","noraw");
    blackbox_count!("test","noraw",1.);
    blackbox_count!("test","noraw",3.);
    blackbox_reset_count!("test","noraw");
    let lines = blackbox_take_lines();
    assert!(lines_contains(&lines,"avg=23."));
    blackbox_count!("test","raw",1.);
    blackbox_count!("test","raw",1.);
    blackbox_reset_count!("test","raw");
    blackbox_count!("test","raw",3.);
    blackbox_count!("test","raw",1.);
    blackbox_reset_count!("test","raw");
    blackbox_count!("test","raw",1.);
    blackbox_set_count!("test","raw",8.);
    blackbox_set_count!("test","raw",6.);
    blackbox_reset_count!("test","raw");
    blackbox_reset_count!("test","raw");
    blackbox_count!("test","noraw",1.);
    blackbox_count!("test","noraw",3.);
    blackbox_reset_count!("test","noraw");
    blackbox_raw_on("test","raw");
    let lines = blackbox_take_lines();
    assert!(lines_contains(&lines,"noraw elapsed: num=1 total=4.00 avg=4.00 95%ile=4.00 top=4.00"));
    assert!(lines_contains(&lines," raw elapsed: num=4 total=12.00 avg=3.00 95%ile=4.00 top=6.00 [2,4,6,0]"));
    assert!(!lines_contains(&lines,"noraw elapsed: num=1 total=4.00 avg=4.00 95%ile=4.00 top=4.00 ["));
}

#[test]
pub fn test_blackbox_elapsed() {
    let mut ign = TestIntegration::new("test1");
    blackbox_integration(ign.clone(),true);
    blackbox_enable("test");
    blackbox_raw_on("test","raw");
    blackbox_time!("test","raw",{
        ign.tick();
    });
    blackbox_time!("test","raw",{
        ign.tick();
        ign.tick();
    });
    blackbox_time!("test","raw",{
    });
    let lines = blackbox_take_lines();
    assert!(lines_contains(&lines,"raw elapsed: num=3 total=3.00ms avg=1.00ms 95%ile=1.00ms top=2.00ms [1,2,0]"));
}

#[test]
pub fn test_blackbox_metronome() {
    let mut ign = TestIntegration::new("test1");
    blackbox_integration(ign.clone(),true);
    blackbox_enable("test");
    blackbox_raw_on("test","raw");
    blackbox_metronome!("test","raw");
    ign.tick();
    blackbox_metronome!("test","raw");
    ign.tick();
    ign.tick();
    blackbox_metronome!("test","raw");
    blackbox_metronome!("test","raw");
    let lines = blackbox_take_lines();
    assert!(lines_contains(&lines,"raw elapsed: num=3 total=3.00ms avg=1.00ms 95%ile=1.00ms top=2.00ms [1,2,0]"));
}

#[test]
pub fn test_blackbox_enable_disable() {
        let ign = TestIntegration::new("test2");
        blackbox_integration(ign.clone(),true);
        blackbox_log!("test","disabled!");
        blackbox_enable("test");
        blackbox_log!("test2","disabled!");
        blackbox_log!("test","enabled!");
        blackbox_disable("test");
        blackbox_enable("test2");
        blackbox_log!("test","disabled!");
        blackbox_log!("test2","more!");
        let lines = blackbox_take_lines();
        print!("{}\n",lines.join("\n"));
        assert!(lines_contains(&lines,"enabled"));
        assert!(lines_contains(&lines,"more"));
        assert!(!lines_contains(&lines,"disabled"));
        assert!(!blackbox_is_enabled("test"));
        assert!(blackbox_is_enabled("test2"));
}

#[test]
pub fn test_config() {
    let ign = TestIntegration::new("test2");
    blackbox_integration(ign.clone(),true);
    blackbox_config(&json!({
        "config": {
            "enable": [
                "test"
            ],
            "raw": {
                "test": [
                    "raw"
                ]
            }
        }
    }));
    assert!(blackbox_is_enabled("test"));
    assert!(!blackbox_is_enabled("test2"));
    {
        let format = blackbox_format();
        let format = format.lock().unwrap();
        assert!(format.test_include_raw("test","raw"));
        assert!(!format.test_include_raw("test","noraw"));
    }
}