use crate::commander::{ Step, StepControl,StepState };

pub struct StepSequence<X,Y,Z,E> where Y: Send {
    one: Box<dyn Step<X,Y,E>>,
    middle: Option<Y>,
    two: Box<dyn Step<Y,Z,E>>,
}

// XXX + Drop (proper impl)
impl<X,Y,Z,E> Step<X,Z,E> for StepSequence<X,Y,Z,E> where Y: Send {
    fn execute(&mut self, input: &X, signal: &mut StepControl) -> StepState<Z,E> {
        match &self.middle {
            Some(y) => self.two.execute(&y,signal),
            None => {
                match self.one.execute(&input,signal) {
                    StepState::NotDone => StepState::NotDone,
                    StepState::Killed => StepState::Killed,
                    StepState::Sleep => StepState::Sleep,
                    StepState::Wait(w) => StepState::Wait(w),
                    StepState::Done(Ok(y)) => { self.middle = Some(y); StepState::NotDone },
                    StepState::Done(Err(e)) => StepState::Done(Err(e))
                }
            }
        }
    }
}

pub fn step_sequence<A,B,X,Y,Z,E>(one: A, two: B) -> impl Step<X,Z,E> where A: Step<X,Y,E> + 'static, B: Step<Y,Z,E> + 'static, Y: Send {
    StepSequence { one: Box::new(one), middle: None, two: Box::new(two) }
}

struct StepRecover<X,Y,E,F> {
    step: Box<dyn Step<X,Y,E>>,
    error: Option<E>,
    recover: Box<dyn Step<E,Y,F>>
}

// XXX implement properly (Drop etc)
impl<X,Y,E,F> Step<X,Y,F> for StepRecover<X,Y,E,F> where Y: Send, E: Send {
    fn execute(&mut self, input: &X, signal: &mut StepControl) -> StepState<Y,F> {
        match &self.error {
            Some(e) => self.recover.execute(e,signal),
            None => {
                match self.step.execute(input,signal) {
                    StepState::NotDone => StepState::NotDone,
                    StepState::Killed => StepState::Killed,
                    StepState::Sleep => StepState::Sleep,
                    StepState::Wait(w) => StepState::Wait(w),
                    StepState::Done(Ok(y)) => StepState::Done(Ok(y)),
                    StepState::Done(Err(e)) => { self.error = Some(e); StepState::NotDone }
                }
            }
        }
    }
}

pub fn step_recover<A,B,X,Y,E,F>(step: A, recover: B) -> impl Step<X,Y,F> where A: Step<X,Y,E> + 'static, B: Step<E,Y,F> + 'static, Y: Send, E: Send {
    StepRecover { step: Box::new(step), error: None, recover: Box::new(recover) }
}
