use std::sync::{ Arc, Mutex };
use arena::{ Arena, Stage };
use campaign::{ StateManager };
use types::{ Move, Units, Axis };

#[derive(Debug,Clone,Copy)]
pub enum Event {
    Noop,
    Move(Move<f32,f32>),
    Zoom(f32)
}

pub struct EventRunner {
    arena: Arc<Mutex<Arena>>,
    stage: Arc<Mutex<Stage>>,
    stale: bool,
}

impl EventRunner {
    pub fn new(arena: Arc<Mutex<Arena>>,
               stage: Arc<Mutex<Stage>>) -> EventRunner {
        EventRunner { arena, stage, stale: false }
    }
    
    pub fn refresh(&mut self) {
        debug!("global","refresh due to stage event");
        let arena = &mut self.arena.lock().unwrap();
        let stage = &mut self.stage.lock().unwrap();
        
        arena.draw(&StateManager::new(),stage);
        self.stale = false;
    }

    fn exe_move_event(&mut self, v: Move<f32,f32>) {
        let stage = &mut self.stage.lock().unwrap();
        
        let v = match v.direction().0 {
            Axis::Horiz => v.convert(Units::Bases,stage),
            Axis::Vert => v.convert(Units::Pixels,stage),
        };
        stage.pos = stage.pos + v;
        self.stale = true;
    }
    
    fn exe_zoom_by_event(&mut self, z: f32) {
        let stage = &mut self.stage.lock().unwrap();
        let z = stage.get_zoom()+z;
        stage.set_zoom(z);
        self.stale = true;
    }

    pub fn run(&mut self, evs: Vec<Event>) {
        for ev in evs {
            match ev {
                Event::Move(v) => self.exe_move_event(v),
                Event::Zoom(z) => self.exe_zoom_by_event(z),
                Event::Noop => ()
            }
        }
        if self.stale {
            self.refresh();
        }
    }
}
