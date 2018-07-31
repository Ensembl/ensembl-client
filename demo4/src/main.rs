mod alloc;
use alloc::Allocation;

use std::cmp::{
    max
};

struct TicketReq {
    width: u32,
    height: u32
}

struct Allocator {
    reqs: Vec<TicketReq>,
    max_width: u32,
    threshold: u32,
}

struct Ticket {
    index: usize
}

struct AllocatorImpl {
    big: Allocation,
    small: Allocation,
    threshold: u32,
}

impl AllocatorImpl {
    fn new(threshold: u32, max_width: u32) -> AllocatorImpl {
        let size = max_width.next_power_of_two();
        AllocatorImpl {
            big: Allocation::new(size),
            small: Allocation::new(size),
            threshold
        }
    }
    
    fn allocate_one(&mut self,width: u32,height: u32) -> (bool,u32,u32) {
        if width < self.threshold {
            let (x,y) = self.small.allocate(width,height).unwrap();
            (false,x,y)
        } else {
            let height = ( height + self.threshold - 1) / self.threshold;
            let (x,y) = self.big.allocate(width,height).unwrap();
            (true,x,y)
        }
    }
}

impl Allocator {
    fn new(threshold: u32) -> Allocator {
        Allocator {
            reqs: Vec::<TicketReq>::new(),
            max_width: 0,
            threshold,
        }
    }
    
    fn request(&mut self, width: u32, height: u32) -> Ticket {
        self.max_width = max(width,self.max_width);
        let data = TicketReq { width, height };
        self.reqs.push(data);
        Ticket { index: self.reqs.len() }
    }
                
    fn allocate(&mut self) {
        let mut aimpl = AllocatorImpl::new(self.threshold,self.max_width);
        let mut res = Vec::<(bool,u32,u32)>::new();
        for t in &self.reqs {
            res.push(aimpl.allocate_one(t.width,t.height));
        }
    }
}

fn main() {
    let mut alloc = Allocation::new(256);
    let input = [(100,6),(100,6),(100,6),(4,6),  (20,5), (50,1)];
    let check = [(0,0),  (100,0),(0,6),  (200,0),(100,6),(100,11)];
    for (i,(x,y)) in input.iter().enumerate() {
        let (s,t) = alloc.allocate(*x,*y).unwrap();
        println!("({}x{}) -> ({},{}) want ({},{})",x,y,s,t,check[i].0,check[i].1);
        if (s,t) != check[i] {
            println!("ERROR!");
        }
    }
    println!("{} {}",alloc,alloc.height());
}
