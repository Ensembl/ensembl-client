use commander::{ Executor, Integration, SleepQuantity };
use owning_ref::MutexGuardRefMut;
use std::sync::{ Arc, Mutex, MutexGuard, Weak };
use stdweb::web::{ IWindowOrWorker, TimeoutHandle, window, HtmlElement };

use crate::dom::domutil::browser_time;
use crate::dom::{ make_bell, BellSender, BellReceiver };

const MS_PER_TICK : f64 = 7.;

/* The entity relationship here is crazy complex. This is all to allow non-Send methods in Executor. The BellReceiver
 * needs to be able to call schedule and so needs a reference to both the sleep state (to check it) and the executor
 * (to build a callback). So, to avoid reference loops we need the Executor and the sleep state to be inside an inner
 * object (CommanderState) and the BellReciever outside it, in the Commander. We need the Executor to be inside an
 * Arc because it isn't Clone but CommanderState (which it is within) must be Clone. We can't put the whole of
 * CommanderState inside an Arc because we need easy access to executor from Commander to the outside world, ie not
 * protedcted by nested Arcs. Anyway, CommanderSleepState (the other entry in CommanderState) needs to be in its own
 * Arc anyway as it's shared with the CommanderIntegration.
 *
 * So the dependency graph is:
 *
 *                                                            Arc
 * Commander -+-> BellReceiver ---> CommanderState (clone 1) --+---> CommanderSleepState
 *            +-------------------> CommanderState|(clone 2) --+
 *                                                ||           +--------------------------------+
 *                                            Arc ++---> Executor -> CommanderIntegration -> BellSender
 *
 * The Mutexes must be locked in the order Excecutor before CommanderSleepState (if both are to be held). This avoids
 * deadlock. CommanderSleepState is not kept locked between public methods and is not exposed. Executor is exposed but
 * this guarantees externally no harm can be done. Internally, except in schedule() CommanderSleepState is held only
 * momentarily to update data fields, so that is safe. Inside schedule, only callbacks can (indirectly) take a lock
 * on executor (via raf_tick or timer_tick) and callbacks don't run until we return to the main loop. In a threaded
 * world, they would block until schedule exited.
 */

struct CommanderSleepState {
    raf_pending: bool,
    quantity: SleepQuantity,
    timeout: Option<TimeoutHandle>
}

#[derive(Clone)]
struct CommanderState {
    sleep_state: Arc<Mutex<CommanderSleepState>>,
    executor: Arc<Mutex<Executor>>
}

impl CommanderState {
    fn tick(&self) {
        self.executor.lock().unwrap().tick(MS_PER_TICK);
    }

    fn raf_tick(&mut self) {
        self.sleep_state.lock().unwrap().raf_pending = false;
        self.tick();
        self.schedule();
    }

    fn timer_tick(&mut self) {
        self.sleep_state.lock().unwrap().timeout.take();
        self.tick();
        self.schedule();
    }

    fn schedule(&mut self) {
        let mut state = self.sleep_state.lock().unwrap();
        if let Some(timeout) = state.timeout.take() {
            timeout.clear();
        }
        match state.quantity {
            SleepQuantity::Forever => {},
            SleepQuantity::None => {
                let mut handle = self.clone();
                if !state.raf_pending {
                    state.raf_pending = true;
                    window().request_animation_frame(move |_| handle.raf_tick());
                }
            },
            SleepQuantity::Time(t) => {
                let mut handle = self.clone();
                state.timeout = Some(window().set_clearable_timeout(move || handle.timer_tick(),t as u32));
            }
        }
    }
}

#[derive(Clone)]
pub struct Commander {
    state: CommanderState,
    bell_receiver: BellReceiver
}

impl Commander {
    pub fn new(el: &HtmlElement) -> Commander {
        let sleep_state = Arc::new(Mutex::new(CommanderSleepState {
            raf_pending: false,
            quantity: SleepQuantity::Forever,
            timeout: None,
        }));
        let (bell_sender, bell_receiver) = make_bell(el);
        let integration = CommanderIntegration {
            sleep_state: sleep_state.clone(),
            bell_sender
        };
        let mut state = CommanderState {
            sleep_state,
            executor: Arc::new(Mutex::new(Executor::new(integration)))
        };
        let mut out = Commander {
            state: state.clone(),
            bell_receiver
        };
        out.bell_receiver.add(move || {
            state.schedule();
        });
        out
    }

    pub fn start(&self) {
        self.state.tick();
    }

    pub fn executor(&self) -> MutexGuardRefMut<Executor> {
        MutexGuardRefMut::new(ok!(self.state.executor.lock()))
    }
}

#[derive(Clone)]
pub struct CommanderIntegration {
    sleep_state: Arc<Mutex<CommanderSleepState>>,
    bell_sender: BellSender
}

impl Integration for CommanderIntegration {
    fn current_time(&self) -> f64 {
        browser_time()
    }

    fn sleep(&self, amount: SleepQuantity) {
        self.sleep_state.lock().unwrap().quantity = amount;
        self.bell_sender.ring();
    }
}
