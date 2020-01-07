/* A BlockBooker countains a thread-protected boolean called the flag. The flag can be set
 * by issuing a BlockBooking. When a BlockBooking is dropped, the flag is reset. Only 
 * dropping the most recently issued BlockBooknig has the effect of resetting the flag. When
 * the flag actually transitions in either direction, a callback registered with the
 * blockbooker is made.
 */

use std::sync::{ Arc, Mutex };

struct BlockBookerImpl {
    current_block: usize,
    blocked: bool,
    callback: Box<dyn FnMut(bool)>
}

impl BlockBookerImpl {
    fn new<T>(callback: T) -> BlockBookerImpl where T: FnMut(bool) + 'static {
        BlockBookerImpl {
            current_block: 0,
            blocked: false,
            callback: Box::new(callback)
        }
    }

    fn block(&mut self) -> usize {
        self.current_block += 1;
        if !self.blocked {
            (self.callback)(true);
        }
        self.blocked = true;
        self.current_block
    }

    fn unblock(&mut self, block: usize) -> bool {
        if self.blocked && self.current_block == block {
            (self.callback)(false);
            self.blocked = false;
            true
        } else {
            false
        }
    }
}

pub struct BlockBooking(Arc<Mutex<BlockBookerImpl>>,usize);

impl Drop for BlockBooking {
    fn drop(&mut self) {
        self.0.lock().unwrap().unblock(self.1);
    }
}

#[derive(Clone)]
pub struct BlockBooker(Arc<Mutex<BlockBookerImpl>>);

impl BlockBooker {
    pub fn new<T>(callback: T) -> BlockBooker where T: FnMut(bool) + 'static {
        BlockBooker(Arc::new(Mutex::new(BlockBookerImpl::new(callback))))
    }

    pub fn block(&mut self) -> BlockBooking {
        let index = self.0.lock().unwrap().block();
        BlockBooking(self.0.clone(),index)
    }
}