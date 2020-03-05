use std::sync::{ Arc, Mutex };
use std::thread;
use std::thread::ThreadId;

use crate::{
    blackbox_enable, blackbox_integration, blackbox_log, blackbox_take_lines, blackbox_disable, blackbox_is_enabled,
    blackbox_config, blackbox_raw_on, blackbox_format, blackbox_clear, blackbox_use_threadlocals, TrivialIntegration,
    blackbox_take_json, SimpleIntegration, blackbox_disable_all
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
        blackbox_format().lock().unwrap().reset_raw_data();
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
        assert!(lines_contains(&lines,"noraw: num=1 total=4.00units avg=4.00units 95%ile=4.00units top=4.00units"));
        assert!(lines_contains(&lines," raw: num=4 total=12.00units avg=3.00units 95%ile=4.00units top=6.00units [2,4,6,0]"));
        assert!(!lines_contains(&lines,"noraw: num=1 total=4.00units avg=4.00units 95%ile=4.00units top=4.00units ["));
    });
}

#[test]
pub fn test_blackbox_value() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_format().lock().unwrap().reset_raw_data();
        blackbox_enable("test");
        blackbox_raw_on("test","raw");
        blackbox_value!("test","raw",1.);
        blackbox_value!("test","raw",2.);
        blackbox_value!("test","raw",0.);
        blackbox_value!("test","raw",1.);
        let lines = blackbox_take_lines();
        assert!(lines_contains(&lines,"[1,2,0,1] ago [0,0,0,0]"));
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
        assert!(lines_contains(&lines,"raw: num=3 total=3.00units avg=1.00units 95%ile=1.00units top=2.00units [1,2,0]"));
    });
}

#[test]
pub fn test_blackbox_start_end() {
    read_lock(|| {
        let mut ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_raw_on("test","raw");
        blackbox_start!("test","raw","A");
        ign.tick();
        blackbox_start!("test","raw","B");
        ign.tick();
        blackbox_end!("test","raw","A");
        blackbox_end!("test","raw","B");
        let lines = blackbox_take_lines();
        print!("{:?}",lines);
        assert!(lines_contains(&lines,"[2,1] ago [0,0]"));
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
        assert!(lines_contains(&lines,"raw: num=3 total=3.00units avg=1.00units 95%ile=1.00units top=2.00units [1,2,0]"));
    });
}

#[test]
pub fn test_blackbox_enable_disable() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test2");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_disable_all();
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
        blackbox_disable_all();
        blackbox_format().lock().unwrap().reset_raw_data();
        blackbox_enable("test");
        blackbox_enable("test2");
        blackbox_raw_on("test","raw");
        blackbox_log!("test2","NO!");
        blackbox_clear();
        blackbox_format().lock().unwrap().reset_raw_data();
        blackbox_integration(TrivialIntegration::new());
        blackbox_enable("test");
        blackbox_log!("test","enabled!");
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
        thread::spawn(move || {
            let ign = SimpleIntegration::new("thread1");
            blackbox_integration(ign.clone());
            blackbox_enable("test");
            blackbox_log!("test","thread1");
            id2.lock().unwrap().replace(thread::current().id());
        }).join().ok();
        let lines = blackbox_take_lines();
        assert!(!lines_contains(&lines,"thread1"));
        assert!(!lines_contains(&lines,"thread2"));
        let m = crate::api::globals::blackbox_model_id(id.lock().unwrap().unwrap());
        assert!(m.lock().unwrap().get_stream("test").is_none());
    });
}

#[test]
pub fn test_liberal_start_model() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_reset_count!("test","pre");
        blackbox_config(&json!({
            "config": {
                "enable": [],
                "raw": { "test": [] }
            }
        }));
        blackbox_reset_count!("test","post");
        let output = blackbox_take_json();
        let cmp = json!({
            "records": [
                {
                    "dataset":"pre","instance":"test","stream":"test",
                    "count": 1, "total": 0., "mean": 0., "high": 0., "top": 0.,
                    "text":"pre: num=1 total=0.00units avg=0.00units 95%ile=0.00units top=0.00units","time":0.
                }
            ],
            "streams": { "test": ["pre"] }
        });
        assert_eq!(output,cmp);
    });
}

#[test]
pub fn test_liberal_start_format() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_reset_count!("test","pre");
        let output = blackbox_take_json();
        let cmp = json!({
            "records": [
                {
                    "ago": [0.], "data": [0.],
                    "dataset":"pre","instance":"test","stream":"test",
                    "count": 1, "total": 0., "mean": 0., "high": 0., "top": 0.,
                    "text":"pre: num=1 total=0.00units avg=0.00units 95%ile=0.00units top=0.00units","time":0.
                }
            ],
            "streams": { "test": ["pre"] }
        });
        assert_eq!(output,cmp);
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
        ign.tick();
        blackbox_metronome!("test","raw");
        blackbox_stack!("a",{
            blackbox_stack!("b",{
                blackbox_log!("test","Hello, world!");
            })
        });
        let output = blackbox_take_json();
        let cmp = json!({
            "records": [
                {"instance":"test1","stack":["a","b"],"text":"Hello, world!","time":3.0,"stream":"test"},
                {
                    "data":[2.,1.],"dataset":"raw","instance":"test1","stream":"test",
                    "ago":[1.,0.],
                    "count": 2, "total": 3., "mean": 1.5, "high": 1., "top": 2.,
                    "text":"raw: num=2 total=3.00units avg=1.50units 95%ile=1.00units top=2.00units","time":3.0
                }
            ],
            "streams": { "test": ["raw"] }
        });
        assert_eq!(output,cmp);
    });
}

#[test]
pub fn test_streams_json() {
    read_lock(|| {
        let ign = SimpleIntegration::new("test1");
        blackbox_use_threadlocals(true);
        blackbox_integration(ign.clone());
        blackbox_enable("test");
        blackbox_enable("test2");
        blackbox_raw_on("test","raw");
        blackbox_raw_on("test","raw2");
        blackbox_raw_on("test2","raw3");
        blackbox_raw_on("test2","raw4");
        blackbox_reset_count!("test","raw");
        blackbox_reset_count!("test","raw2");
        blackbox_reset_count!("test2","raw3");
        blackbox_reset_count!("test2","raw4");
        let cmp = json!({
            "test": ["raw","raw2"],
            "test2": ["raw3","raw4"]
        });
        let output = blackbox_take_json();
        assert_eq!(output["streams"],cmp);
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
        assert!(lines[2].contains("count:"));
    });
}
