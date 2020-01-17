use std::sync::{ Arc, Mutex, MutexGuard };
use crate::block::Block;
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::StepRun;
use crate::taskcontext::TaskContext;
use crate::integration::{ CommanderIntegration2, SleepQuantity };

#[derive(Clone)] // XXX test only
pub(crate) enum TestState<R> {
    Again,
    Tick,
    Block,
    Done(R),
}

impl<R> TestState<R> where R: Clone {
    fn step_state(&mut self, control: &mut TaskContext) -> StepState2<R> {
        match self {
            TestState::Again => StepState2::Ongoing(OngoingState::Again),
            TestState::Tick => StepState2::Ongoing(OngoingState::Tick),
            TestState::Block => StepState2::Ongoing(OngoingState::Block(control.block())),
            //TestState::Dead => StepState2::Ongoing(OngoingState::Dead),
            TestState::Done(v) => StepState2::Done(v.clone())
        }
    }
}

#[derive(Clone)]
pub struct TestIntegration {
    timer: Arc<Mutex<f64>>,
    sleeps: Arc<Mutex<Vec<SleepQuantity>>>
}

impl TestIntegration {
    pub(crate) fn new() -> TestIntegration {
        TestIntegration {
            timer: Arc::new(Mutex::new(0.)),
            sleeps: Arc::new(Mutex::new(vec![]))
        }
    }

    pub(crate) fn new_step<R>(&mut self, results: Vec<TestState<R>>) -> TestStep<R> {
        TestStep::new(results,&self.timer)
    }

    pub(crate) fn get_time(&self) -> f64 { *self.timer.lock().unwrap() }
    pub(crate) fn set_time(&mut self, t: f64) { *self.timer.lock().unwrap() = t; }

    pub(crate) fn get_sleeps(&self) -> MutexGuard<Vec<SleepQuantity>> { self.sleeps.lock().unwrap() }
}

impl CommanderIntegration2 for TestIntegration {
    fn current_time(&mut self) -> f64 {*self.timer.lock().unwrap() }
    fn sleep(&self, quantity: SleepQuantity) { self.sleeps.lock().unwrap().push(quantity); }
}

#[derive(Clone)]
pub struct TestExtract<T>(pub Arc<Mutex<T>>);
impl<T> StepRun for TestExtract<T> {
    type Output = ();

    fn more(&mut self, _control: &mut TaskContext) -> StepState2<()> {
        StepState2::Done(())
    }
}

impl<T> Step2<T> for TestExtract<T> where T: Send+Clone+'static {
    type Output = ();

    fn start(&mut self, input: T, _control: &mut TaskContext) -> Box<dyn StepRun<Output=()>> {
        *self.0.lock().unwrap() = input.clone();
        Box::new(self.clone())
    }
}

#[derive(Clone)]
struct TestStepState {
    finish_time: f64,
    auto_advance: bool,
    block_for: Option<f64>,
    pending_forever_block: bool,
    current_forever_block: Option<Block>
}

#[derive(Clone)]
pub(crate) struct TestStep<R> {
    timer: Arc<Mutex<f64>>,
    results: Vec<TestState<R>>,
    state: Arc<Mutex<TestStepState>>,
}

impl<R> TestStep<R> {
    fn new(results: Vec<TestState<R>>, timer: &Arc<Mutex<f64>>) -> TestStep<R> {
        TestStep {
            results,
            timer: timer.clone(),
            state: Arc::new(Mutex::new(TestStepState {
                block_for: None,
                finish_time: -1.,
                auto_advance: true,
                pending_forever_block: false,
                current_forever_block: None
            }))
        }
    }

    pub(crate) fn forever_block(&mut self) {
        self.state.lock().unwrap().pending_forever_block = true;
    }

    pub(crate) fn forever_unblock(&mut self, _tc: &mut TaskContext) {
        let mut state = self.state.lock().unwrap();
        if let Some(ref mut blocker) = state.current_forever_block {
            blocker.unblock();
        }
        state.current_forever_block = None;
    }

    pub(crate) fn block_for(&mut self, when: f64) {
        self.state.lock().unwrap().block_for = Some(when);
    }

    pub(crate) fn get_time(&self) -> f64 {
        *self.timer.lock().unwrap()
    }
}

impl<X,R> Step2<X> for TestStep<R> where R: Clone+Send+'static {
    type Output = R;

    fn start(&mut self, _input: X, _control: &mut TaskContext) -> Box<dyn StepRun<Output=R>> {
        Box::new(self.clone())
    }
}

impl<R> StepRun for TestStep<R> where R: Clone+'static {
    type Output = R;

    fn more(&mut self, control: &mut TaskContext) -> StepState2<R> {
        let mut state = self.state.lock().unwrap();
        /* forever blocks */
        if state.pending_forever_block {
            let b = control.block();
            state.current_forever_block = Some(b.clone());
            state.pending_forever_block = false;
            return StepState2::Ongoing(OngoingState::Block(b));
        }
        /* timed blocks */
        if let Some(until) = state.block_for {
            let b = control.block();
            let mut b2 = b.clone();
            if until > 0. {
                control.add_timer(until, move || {
                    b2.unblock();
                });
            } else {
                b2.unblock();
            }
            state.block_for = None;
            return StepState2::Ongoing(OngoingState::Block(b));
        }
        if state.auto_advance {
            *self.timer.lock().unwrap() += 1.;
        }
        let out = if self.results.len() > 0 {
            self.results.remove(0).step_state(control)
        } else {
            StepState2::Ongoing(OngoingState::Dead)
        };
        if let StepState2::Done(_) = out {
            state.finish_time = *self.timer.lock().unwrap();
        }
        out
    }
}

#[derive(Clone)]
pub struct TestExtractorStep<T>(pub Arc<Mutex<T>>);
impl<T> StepRun for TestExtractorStep<T> {
    type Output = ();

    fn more(&mut self, _control: &mut TaskContext) -> StepState2<()> {
        StepState2::Done(())
    }
}

impl<T> Step2<T> for TestExtractorStep<T> where T: Send+Clone+'static {
    type Output = ();

    fn start(&mut self, input: T, _control: &mut TaskContext) -> Box<dyn StepRun<Output=()>> {
        *self.0.lock().unwrap() = input.clone();
        Box::new(self.clone())
    }
}
