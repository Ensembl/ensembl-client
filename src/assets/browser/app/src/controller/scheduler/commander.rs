use commander::{ Executor, Integration, SleepQuantity };
use owning_ref::MutexGuardRefMut;
use std::sync::{ Arc, Mutex, MutexGuard, Weak };
use stdweb::web::{ IWindowOrWorker, TimeoutHandle, window, HtmlElement };

use crate::dom::domutil::browser_time;
use crate::dom::{ make_bell, BellSender, BellReceiver };

const MS_PER_TICK : f64 = 7.;

#[derive(Clone)]
pub struct Commander {
    state: Arc<Mutex<CommanderState>>,
    executor: Arc<Mutex<Executor>>,
    bell_receiver: BellReceiver
}

impl Commander {
    pub fn new(el: &HtmlElement) -> Commander {
        let state = Arc::new(Mutex::new(CommanderState {
            raf_pending: false,
            quantity: SleepQuantity::Forever,
            timeout: None,
        }));
        let (bell_sender, bell_receiver) = make_bell(el);
        let integration = CommanderIntegration {
            state: Arc::downgrade(&state),
            bell_sender
        };
        let mut out = Commander {
            state,
            executor: Arc::new(Mutex::new(Executor::new(integration))),
            bell_receiver
        };
        let mut out2 = out.clone();
        out.bell_receiver.add(move || {
            out2.schedule();
        });
        out
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

    fn schedule(&mut self) {
        let mut state = self.state();
        if let Some(timeout) = state.timeout.take() {
            timeout.clear();
        }
        match state.quantity {
            SleepQuantity::Forever => {},
            SleepQuantity::None => {
                if !state.raf_pending {
                    state.raf_pending = true;
                    let handle = self.clone();
                    window().request_animation_frame(move |_| handle.raf_tick());
                }
            },
            SleepQuantity::Time(t) => {
                let handle = self.clone();
                state.timeout = Some(window().set_clearable_timeout(move || handle.timer_tick(),t as u32));
            }
        }
    }

}

unsafe impl Send for CommanderIntegration {} // XXX nooooooooooooooooooooo!

#[derive(Clone)]
pub struct CommanderIntegration {
    state: Weak<Mutex<CommanderState>>,
    bell_sender: BellSender
}

impl Integration for CommanderIntegration {
    fn current_time(&self) -> f64 {
        browser_time()
    }

    fn sleep(&self, amount: SleepQuantity) {
        if let Some(state) = self.state.upgrade() {
            state.lock().unwrap().sleep(amount);
            self.bell_sender.ring();
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

    fn sleep(&mut self, amount: SleepQuantity) {
        self.quantity = amount;
    }
}
