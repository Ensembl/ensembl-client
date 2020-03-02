use std::collections::VecDeque;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use super::semaphorefuture::SemaphoreFutureMaker;

struct CommanderStreamState<T> where T: Unpin {
    queue: VecDeque<T>,
    semaphore: SemaphoreFutureMaker
}

impl<T> CommanderStreamState<T> where T: Unpin {
    fn new() -> CommanderStreamState<T> {
        CommanderStreamState {
            queue: VecDeque::new(),
            semaphore: SemaphoreFutureMaker::new()
        }
    }

    fn add(&mut self, item: T) {
        self.queue.push_back(item);
    }

    /*
    fn get(&mut self) -> Future<Output=T> {
        let wait = self.semaphore.wait();
        if let Some(value) = self.queue.pop_front() {
            ValueFuture::new(value)
        } else {
            self.semaphore
        }
    }
    */
}

pub struct CommanderStream<T>(Arc<Mutex<CommanderStreamState<T>>>) where T: Unpin;

impl<T> CommanderStream<T> where T: Unpin {
    pub fn new() -> CommanderStream<T> {
        CommanderStream(Arc::new(Mutex::new(CommanderStreamState::new())))
    }
}