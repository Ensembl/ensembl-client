use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::ThreadId;

use crate::{
    blackbox_enable, blackbox_integration, blackbox_log, blackbox_take_lines, blackbox_disable, blackbox_is_enabled,
    blackbox_config, blackbox_raw_on, blackbox_format, blackbox_clear, blackbox_use_threadlocals, TrivialIntegration,
    blackbox_take_json, SimpleIntegration
};

use super::harness::{ lines_contains, read_lock, write_lock };

#[test]
pub fn test_blackbox_log() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_log!("test","Hello, world!");
        assert_eq!("[0][test1] Hello, world!",blackbox_take_lines().join("\n"));
    });
}

#[test]
pub fn test_blackbox_count() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
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
    });
}

#[test]
pub fn test_blackbox_elapsed() {
    read_lock(|| {
        let mut ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
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
        assert!(lines_contains(&lines,"raw elapsed: num=3 total=3.00units avg=1.00units 95%ile=1.00units top=2.00units [1,2,0]"));
    });
}

#[test]
pub fn test_blackbox_metronome() {
    read_lock(|| {
        let mut ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
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
        assert!(lines_contains(&lines,"raw elapsed: num=3 total=3.00units avg=1.00units 95%ile=1.00units top=2.00units [1,2,0]"));
    });
}

#[test]
pub fn test_blackbox_enable_disable() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test2");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_log!("test","disabled!");
        blackbox_enable("test");
        blackbox_log!("test2","disabled!");
        blackbox_log!("test","enabled!");
        blackbox_disable("test");
        blackbox_enable("test2");
        blackbox_log!("test","disabled!");
        blackbox_log!("test2","more!");
        let lines = blackbox_take_lines();
        assert!(lines_contains(&lines,"enabled"));
        assert!(lines_contains(&lines,"more"));
        assert!(!lines_contains(&lines,"disabled"));
        assert!(!blackbox_is_enabled("test"));
        assert!(blackbox_is_enabled("test2"));
    });
}

#[test]
pub fn test_config() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test2");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
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
    });
}

#[test]
pub fn test_clear() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test2");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_enable("test2");
        blackbox_raw_on("test","raw");
        blackbox_clear();
        blackbox_integration(TrivialIntegration::new());
        blackbox_enable("test");
        blackbox_log!("test","enabled!");
        blackbox_log!("test2","NO!");
        blackbox_count!("test","raw",1.);
        blackbox_reset_count!("test","raw");
        let lines = blackbox_take_lines();
        assert!(!lines_contains(&lines,"NO")); /* Model cleared */
        assert!(!lines_contains(&lines,"[1]")); /* Format cleared */
        blackbox_clear();
        assert_eq!(blackbox_take_lines().len(),0);
    });
}

#[test]
pub fn test_static() {
    write_lock(|| {
        blackbox_use_threadlocals(false);
        let ign = SimpleIntegration::new("thread1");
        blackbox_integration(ign.clone());
        let t1 = thread::spawn(|| {
            blackbox_enable("test");
            blackbox_log!("test","thread1");
        });
        let t2 = thread::spawn(|| {
            blackbox_enable("test");
            blackbox_log!("test","thread2");
        });
        t1.join().ok();
        t2.join().ok();
        let lines = blackbox_take_lines();
        assert!(lines_contains(&lines,"thread1"));
        assert!(lines_contains(&lines,"thread2"));
    });
}

#[test]
pub fn test_thread_local() {
    read_lock(|| {
        blackbox_use_threadlocals(true);
        let t1 = thread::spawn(|| {
            let ign = SimpleIntegration::new("thread1");
            blackbox_integration(ign.clone());
            blackbox_enable("test");
            blackbox_log!("test","thread1");
        });
        let t2 = thread::spawn(|| {
            let ign = SimpleIntegration::new("thread2");
            blackbox_integration(ign.clone());
            blackbox_enable("test");
            blackbox_log!("test","thread2");
            let lines = blackbox_take_lines();
            assert!(!lines_contains(&lines,"thread1"));
            assert!(lines_contains(&lines,"thread2"));
        });
        t1.join().ok();
        t2.join().ok();
        let lines = blackbox_take_lines();
        assert!(!lines_contains(&lines,"thread1"));
        assert!(!lines_contains(&lines,"thread2"));
    });
}

#[test]
pub fn test_thread_local_clear() {
    read_lock(|| {
        blackbox_use_threadlocals(true);
        let id : Arc<Mutex<Option<ThreadId>>> = Arc::new(Mutex::new(None));
        let id2 = id.clone();
        let t1 = thread::spawn(move || {
            let ign = SimpleIntegration::new("thread1");
            blackbox_integration(ign.clone());
            blackbox_enable("test");
            blackbox_log!("test","thread1");
            id2.lock().unwrap().replace(thread::current().id());
        });
        t1.join().ok();
        thread::current().id();
        let lines = blackbox_take_lines();
        assert!(!lines_contains(&lines,"thread1"));
        assert!(!lines_contains(&lines,"thread2"));
        let m = crate::api::globals::blackbox_model_id(id.lock().unwrap().unwrap());
        assert!(m.lock().unwrap().get_stream("test").is_none());
    });
}

#[test]
pub fn test_json() {
    read_lock(|| {
        let mut ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_raw_on("test","raw");
        blackbox_metronome!("test","raw");
        ign.tick();
        ign.tick();
        blackbox_metronome!("test","raw");
        blackbox_stack!("a",{
            blackbox_stack!("b",{
                blackbox_log!("test","Hello, world!");
            })
        });
        let output = blackbox_take_json();
        let cmp = json!([
            {"instance":"test1","stack":["a","b"],"text":"Hello, world!","time":2.0},
            {"dataset":[2.0],"instance":"test1","text":"raw elapsed: num=1 total=2.00units avg=2.00units 95%ile=2.00units top=2.00units","time":2.0}
        ]);
        assert_eq!(output,cmp);
    });

}

#[test]
pub fn test_blackbox_reordering() {
    read_lock(|| {
        let mut ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_count!("test","count",1.);
        blackbox_reset_count!("test","count");
        ign.tick();
        blackbox_log!("test","at 1");
        blackbox_count!("test","count",1.);
        blackbox_reset_count!("test","count");
        ign.tick();
        blackbox_log!("test","at 2");
        blackbox_count!("test","count",1.);
        blackbox_reset_count!("test","count");
        ign.tick();
        ign.tick();
        blackbox_count!("test","count",1.);
        blackbox_reset_count!("test","count");
        let lines = blackbox_take_lines();
        assert!(lines[0] == "[1][test1] at 1");
        assert!(lines[1] == "[2][test1] at 2");
        assert!(lines[2].starts_with("[4]"));
        assert!(lines[2].contains("elapsed"));
    });
}
