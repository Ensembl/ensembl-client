use commander::{ Executor, Integration, SleepQuantity };
use owning_ref::MutexGuardRefMut;
use std::sync::{ Arc, Mutex, MutexGuard, Weak };
use stdweb::web::{ IWindowOrWorker, TimeoutHandle, window };

use crate::dom::domutil::browser_time;

const MS_PER_TICK : f64 = 7.;

#[derive(Clone)]
pub struct Commander {
    state: Arc<Mutex<CommanderState>>,
    executor: Arc<Mutex<Executor>>
}

impl Commander {
    pub fn new() -> Commander {
        let fake_executor = Executor::new(WeakCommander::fake());
        let out = Commander {
            state: Arc::new(Mutex::new(CommanderState {
                raf_pending: false,
                quantity: SleepQuantity::Forever,
                timeout: None
            })),
            executor: Arc::new(Mutex::new(fake_executor))
        };
        *out.executor.lock().unwrap() = Executor::new(out.clone_weak());
        out
    }

    fn clone_weak(&self) -> WeakCommander {
        WeakCommander {
            state: Arc::downgrade(&self.state),
            executor: Arc::downgrade(&self.executor)
        }
    }

    fn tick(&self) {
        self.executor.lock().unwrap().tick(MS_PER_TICK);
    }

    pub fn start(&self) {
        self.tick();
    }

    pub fn executor(&self) -> MutexGuardRefMut<Executor> {
        MutexGuardRefMut::new(self.executor.lock().unwrap())
    }

    fn state(&self) -> MutexGuardRefMut<CommanderState> {
        MutexGuardRefMut::new(self.state.lock().unwrap())
    }

    fn raf_tick(&self) {
        self.state().register_raf();
        self.tick();
        self.state().schedule(self.clone());
    }

    fn timer_tick(&self) {
        self.state().register_timer();
        self.tick();
        self.state().schedule(self.clone());
    }
}

unsafe impl Send for WeakCommander {} // XXX nooooooooooooooooooooo!

#[derive(Clone)]
pub struct WeakCommander {
    state: Weak<Mutex<CommanderState>>,
    executor: Weak<Mutex<Executor>>
}

impl WeakCommander {
    fn fake() -> WeakCommander {
        WeakCommander {
            state: Weak::new(),
            executor: Weak::new()
        }
    }

    fn upgrade(&self) -> Option<Commander> {
        let (state,executor) = (self.state.upgrade(),self.executor.upgrade());
        if let (Some(state),Some(executor)) = (state,executor) {
            Some(Commander { state, executor })
        } else {
            None
        }
    }
}

impl Integration for WeakCommander {
    fn current_time(&self) -> f64 {
        browser_time()
    }

    fn sleep(&self, amount: SleepQuantity) {
        if let Some(ign) = self.upgrade() {
            let ign2 = ign.clone();
            ign.state().sleep(amount,ign2);
        }
    }
}

struct CommanderState {
    raf_pending: bool,
    quantity: SleepQuantity,
    timeout: Option<TimeoutHandle>
}

impl CommanderState {
    fn schedule(&mut self, handle: Commander) {
        if let Some(timeout) = self.timeout.take() {
            timeout.clear();
        }
        match self.quantity {
            SleepQuantity::Forever => {},
            SleepQuantity::None => {
                if !self.raf_pending {
                    self.raf_pending = true;
                    window().request_animation_frame(move |_| handle.raf_tick());
                }
            },
            SleepQuantity::Time(t) => {
                self.timeout = Some(window().set_clearable_timeout(move || handle.timer_tick(),t as u32));
            }
        }
    }

    fn register_raf(&mut self) {
        self.raf_pending = false;
    }

    fn register_timer(&mut self) {
        self.timeout.take();
    }

    fn sleep(&mut self, amount: SleepQuantity, handle: Commander) {
        self.quantity = amount;
        self.schedule(handle);
    }
}
