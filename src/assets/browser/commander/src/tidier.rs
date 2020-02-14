use std::pin::Pin;
use std::future::Future;
use std::sync::{ Arc, Mutex };
use std::task::{ Context, Poll };

sequence!(IDENTITY);

pub struct TidierState {
    future: Pin<Box<dyn Future<Output=()> + Send>>,
    done: bool
}

#[derive(Clone)]
pub struct Tidier {
    state: Arc<Mutex<TidierState>>,
    identity: u64
}

hashable!(IDENTITY,Tidier,identity);

impl Tidier {
    pub(crate) fn new(future: Pin<Box<dyn Future<Output=()> + Send>>) -> Tidier {
        Tidier {
            state: Arc::new(Mutex::new(TidierState {
                future,
                done: false
            })),
            identity: IDENTITY.next()
        }
    }

    pub(crate) fn finished(&self) -> bool { self.state.lock().unwrap().done }
}

impl Future for Tidier {
    type Output = ();

    fn poll(self: Pin<&mut Self>, waker: &mut Context) -> Poll<()> {
        let mut state = self.state.lock().unwrap();
        if state.done {
            return Poll::Ready(());
        }
        let out = state.future.as_mut().poll(waker);
        if let Poll::Ready(_) = out {
            state.done = true;
        }
        out
    }
}
