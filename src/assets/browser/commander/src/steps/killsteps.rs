use crate::commander::{ Step, StepControl, StepState, KillReason };

struct KillCatch<X,Y,E,F> {
    step: Box<dyn Step<X,Y,E>>,
    handler: Box<dyn Fn(KillReason) -> Result<KillReason,F> + Send>,
    mapper: Box<dyn Fn(E) -> F + Send>
}

impl<X,Y,E,F> Step<X,Y,F> for KillCatch<X,Y,E,F> {
    fn execute(&mut self, input: &X, signal: &mut StepControl) -> StepState<Y,F> {
        match self.step.execute(input,signal) {
            StepState::Killed(r) => {
                match (self.handler)(r) {
                    Ok(r) => StepState::Killed(r),
                    Err(f) => StepState::Done(Err(f))
                }
            },
            StepState::Done(Err(e)) => StepState::Done(Err((self.mapper)(e))),
            StepState::Done(Ok(y)) => StepState::Done(Ok(y)),
            StepState::NotDone => StepState::NotDone,
            StepState::Wait(w) => StepState::Wait(w),
            StepState::Sleep => StepState::Sleep
        }
    }
}

pub fn kill_catch_maperr<A,X,Y,E,F,H,M>(step: A, handler: H, mapper: M) -> impl Step<X,Y,F> 
            where A: Step<X,Y,E> + 'static, H: Fn(KillReason) -> Result<KillReason,F> + Send + 'static, M: Fn(E) -> F + Send + 'static {
    KillCatch {
        step: Box::new(step),
        handler: Box::new(handler),
        mapper: Box::new(mapper)
    }
}

pub fn kill_catch<A,X,Y,E,H>(step: A, handler: H) -> impl Step<X,Y,E> 
            where A: Step<X,Y,E> + 'static, H: Fn(KillReason) -> Result<KillReason,E> + Send + 'static {
    kill_catch_maperr(step,handler,|e| e)
}