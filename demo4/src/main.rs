mod alloc;
use alloc::Allocation;

struct TicketReq {
    width: u32,
    height: u32
}

struct Allocator {
    reqs: Vec<TicketReq>
}

struct Ticket {
    index: usize
}

impl Allocator {
    fn new() -> Allocator {
        Allocator {
            reqs: Vec::<TicketReq>::new()
        }
    }
    
    fn request(&mut self, width: u32, height: u32) -> Ticket {
        let data = TicketReq { width, height };
        self.reqs.push(data);
        Ticket { index: self.reqs.len() }
    }
        
    fn allocate(&mut self) {
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
