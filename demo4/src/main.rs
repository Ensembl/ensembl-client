mod alloc;
use alloc::Allocator;
use alloc::Ticket;

fn main() {
    let mut ac = Allocator::new(16);
    let s = [(10,10),(100,1),(20,32),(2,12),(2,12),(50,2),(40,2),(120,2)];
    let c = [(0,0),   (0,48),(0,16), (10,0),(12,0),(0,49),(50,49),(0,51)];
    let mut t = Vec::<Ticket>::new();
    for (x,y) in &s {
        t.push(ac.request(*x,*y));
    }
    ac.allocate();
    for (i,t) in t.iter().enumerate() {
        let (x,y) = ac.position(t);
        assert_eq!((x,y),c[i]);
        
        println!("{:?} gets {:?}",s[i],(x,y));
    }
}
