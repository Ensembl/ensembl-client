use std::sync::{ Arc, Mutex };
use crate::step::{ Step2, StepState2, OngoingState };
use crate::steprunner::{ StepRun, StepRunner };
use crate::taskcontext::TaskContext;

struct StepSequenceRun<Y,Z,E> {
    task_control: TaskContext,
    one: StepRunner<Result<Y,E>>,
    two_step: Arc<Mutex<Box<dyn Step2<Y,Output=Result<Z,E>>>>>,
    two: Option<StepRunner<Result<Z,E>>>
}

impl<Y,Z,E> StepRun for StepSequenceRun<Y,Z,E> {
    type Output = Result<Z,E>;

    fn more(&mut self, _control: &mut TaskContext) -> StepState2<Result<Z,E>> {
        if let Some(two) = &mut self.two {
            two.more()
        } else {
            match self.one.more() {
                StepState2::Done(Ok(v)) => {
                    let mut step = self.two_step.lock().unwrap();
                    self.two = Some(self.task_control.new_step(&mut step,v));
                    return StepState2::Ongoing(OngoingState::Again);
                },
                StepState2::Done(Err(v)) => StepState2::Done(Err(v)),
                StepState2::Ongoing(OngoingState::Again) => StepState2::Ongoing(OngoingState::Again),
                StepState2::Ongoing(OngoingState::Block(b)) => StepState2::Ongoing(OngoingState::Block(b)),
                StepState2::Ongoing(OngoingState::Tick) => StepState2::Ongoing(OngoingState::Tick),
                StepState2::Ongoing(OngoingState::Dead) => StepState2::Ongoing(OngoingState::Dead)
            }
        }
    }
}

#[derive(Clone)]
pub struct StepSequence2<X,Y,Z,E> where Y: Send {
    one: Arc<Mutex<Box<dyn Step2<X,Output=Result<Y,E>>>>>,
    two: Arc<Mutex<Box<dyn Step2<Y,Output=Result<Z,E>>>>>
}

impl<X,Y: Send,Z,E> StepSequence2<X,Y,Z,E> {
    pub fn new<A,B>(one: A, two: B) -> StepSequence2<X,Y,Z,E> where A: Step2<X,Output=Result<Y,E>> + 'static, B: Step2<Y,Output=Result<Z,E>> + 'static, Y: Send + 'static, Z: 'static, E: 'static {
        StepSequence2 {
            one: Arc::new(Mutex::new(Box::new(one))),
            two: Arc::new(Mutex::new(Box::new(two)))
        }
    }
}

impl<X,Y: Send,Z,E> Step2<X> for StepSequence2<X,Y,Z,E> where Y: 'static, Z: 'static, E: 'static {
    type Output = Result<Z,E>;

    fn start(&mut self, input: X, task_control: &mut TaskContext) -> Box<dyn StepRun<Output=Result<Z,E>>> {
        Box::new(StepSequenceRun {
            task_control: task_control.clone(),
            one: task_control.new_step(&mut self.one.lock().unwrap(),input),
            two_step: self.two.clone(),
            two: None
        })
    }
}
