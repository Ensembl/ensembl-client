use std::fmt;
use std::cmp::max;

/* An origin is the top left corner of an allocation or free space. The
 * extent of the space is not recorded and must be determined from
 * context.
 */

struct Origin {
    x: u32,
    y: u32,
}

impl Clone for Origin {
    fn clone(&self) -> Origin { Origin { x: self.x, y: self.y } }
}

impl fmt::Display for Origin {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({},{})", self.x, self.y)
    }
}

impl Origin {
    /* Carve a space out of the top-left of another space, returning
     * 1-3 tranches. The first is always the desired space and has
     * width/height as requested. The second and third are the leftovers.
     */
    fn chop(&self, width: u32, height: u32, 
            total_width: u32, total_height: u32) -> Vec<Tranche> {
        let mut out = Vec::<Tranche>::new();
        out.push(Tranche {
            h: height,
            r: Origin { x: self.x, y: self.y }
        });
        if height < total_height {
            out.push(Tranche {
                h: total_height-height,
                r: Origin { x: self.x, y: self.y + height }
            });
        }
        if width < total_width {
            out.push(Tranche {
                h: height,
                r: Origin { x: self.x + width, y: self.y }
            });
        }
        out
    }
}

/* A tranche is an origin and a height. Where relevant, the width
 * implicitly extends to the end of the allocation unless otherwise
 * contextualised.
 */

struct Tranche {
    r: Origin,
    h: u32
}

impl Tranche {
    fn chop(&self, width: u32, height:u32, max_width: u32) -> Vec<Tranche> {
        self.r.chop(width,height,max_width-self.r.x,self.h)
    }
}

impl Clone for Tranche {
    fn clone(&self) -> Tranche { Tranche { h: self.h, r: self.r.clone() }}
}

/* A Height contains all the Tranches of a particular height. */

struct Height {
    height: u32,
    spaces: Vec<Origin>
}

impl fmt::Display for Height {
    fn fmt(&self, f : &mut fmt::Formatter) -> fmt::Result {
        let strings : Vec<String> = self.spaces.iter().map(|x| x.to_string()).collect();
        let csl : String = strings.join(", ");
        write!(f, "({},[{}])",self.height,csl)
    }
}

impl Height {
    fn new(height: u32) -> Height {
        Height {
            height,
            spaces: Vec::<Origin>::new()
        }
    }
    
    fn add(&mut self,tranche: Origin) {
        self.spaces.push(tranche);
    }

    /* Remove from the height a tranche of at least the given width.
     * It's the responsibility of the caller to chop it up and return
     * any fragments into the relevant Heights.
     */
    fn alloc(&mut self, width: u32, max_width: u32) -> Option<Tranche> {
        let mut target : Option<usize> = None;
        for (i,space) in self.spaces.iter().enumerate() {
            if space.x + width < max_width {
                target = Some(i);
                break;
            }
        }
        match target {
            Some(i) => Some(Tranche {
                r: self.spaces.remove(i),
                h: self.height
            }),
            None => None
        }
    }
}

impl Clone for Height {
    fn clone(&self) -> Height {
        Height {
            height: self.height,
            spaces: self.spaces.to_vec()
        }
    }
}

/* Half is the main allocator struct for the top half and bottom half of
 * the allocation.
 */
struct Half {
    width: u32,
    watermark: u32,
    spaces: Vec<Height>
}

impl fmt::Display for Half {
    fn fmt(&self, f : &mut fmt::Formatter) -> fmt::Result {
        let strings : Vec<String> = self.spaces.iter().map(|x| x.to_string()).collect();
        let csl : String = strings.join(", ");
        write!(f, "({},{},[{}])",self.width,self.watermark,csl)
    }
}

impl Half {
    pub fn new(width: u32) -> Half {
        Half {
            width,
            watermark: 0,
            spaces: Vec::<Height>::new()
        }
    }
    
    fn add_space(&mut self, tranche: Tranche) {
        let h = tranche.h as usize;
        let len = self.spaces.len();
        if len < h {
            for h in len..h {
                self.spaces.push(Height::new((h+1) as u32));
            }
        }
        self.spaces[h-1].add(tranche.r);
    }
        
    fn alloc_space(&mut self, width: u32, height: u32) -> Option<Origin> {
        let h = height as usize;
        let len = self.spaces.len();
        if self.spaces.len() >= h {
            let mut frags : Option<Vec<Tranche>> = None;
            for i in h-1..len {
                let mut result = self.spaces[i].alloc(width,self.width);
                if let Some(tranche) = result {
                    frags = Some(tranche.chop(width,height,self.width));
                    break
                }
            }
            if let Some(frags) = frags {
                let len = frags.len();
                let out = frags[0].r.clone();
                if len > 1 {
                    for i in 1..len {
                        self.add_space(frags[i].clone());
                    }
                }
                return Some(out);
            }
        }
        None
    }
    
    fn alloc_watermark(&mut self,width: u32,height: u32) -> Option<(u32,u32)> {
        let tranche = Tranche {
            r: Origin { y: self.watermark, x: 0 },
            h: height
        };
        self.watermark = self.watermark + height;
        self.add_space(tranche);
        let out = self.alloc_space(width,height);
        match out {
            Some(Origin { x, y }) => Some((x,y)),
            None => None
        }
    }
    
    fn allocate(&mut self,width: u32,height: u32) -> Option<(u32,u32)> {
        match self.alloc_space(width,height) {
            Some(space) => Some((space.x,space.y)),
            None => self.alloc_watermark(width,height)
        }
    }
    
    fn get_height(&self) -> u32 { self.watermark }
    fn get_width(&self) -> u32 { self.width }
}

/* The allocator is the publicly available struct. It is implemented by
 * to Half-s. The only work here is managing tickets (to avoid borrower
 * hell in the public API) and to stitch the two halves together.
 */

struct TicketReq {
    width: u32,
    height: u32
}

#[derive(Clone)]
struct TicketRes {
    x: u32,
    y: u32
}

pub struct Allocator {
    reqs: Vec<TicketReq>,
    res: Vec<TicketRes>,
    max_width: u32,
    area: u32,
    threshold: u32,
}

#[derive(Clone)]
pub struct Ticket {
    index: usize,
    width: u32,
    height: u32,
}

struct AllocatorImpl {
    big: Half,
    small: Half,
    threshold: u32,
}

impl AllocatorImpl {
    fn new(threshold: u32, max_width: u32, area: u32) -> AllocatorImpl {
        let size = max(max_width.next_power_of_two(),(area as f32).sqrt() as u32);
        AllocatorImpl {
            big: Half::new(size),
            small: Half::new(size),
            threshold
        }
    }
    
    fn allocate_one(&mut self,width: u32,height: u32) -> (bool,u32,u32) {
        println!("{}x{} t={}",width,height,self.threshold);
        if height < (self.threshold / 2) {
            println!("small");
            let (x,y) = self.small.allocate(width,height).unwrap();
            (false,x,y)
        } else {
            let height = ( height + self.threshold - 1) / self.threshold;
            let (x,y) = self.big.allocate(width,height).unwrap();
            (true,x,y)
        }
    }
    
    fn width(&self) -> u32 { self.big.get_width() }
    fn split_point(&self) -> u32 { self.big.get_height() * self.threshold }
    fn total_height(&self) -> u32 { self.split_point() + self.small.get_height() }
}

impl Allocator {
    pub fn new(threshold: u32) -> Allocator {
        Allocator {
            reqs: Vec::<TicketReq>::new(),
            res:  Vec::<TicketRes>::new(),
            max_width: 0,
            area: 0,
            threshold,
        }
    }
    
    pub fn request(&mut self, width: u32, height: u32) -> Ticket {
        self.max_width = max(width,self.max_width);
        self.area = self.area + width*height;
        let data = TicketReq { width, height };
        self.reqs.push(data);
        Ticket { index: self.reqs.len()-1, width, height }
    }

    pub fn allocate(&mut self) -> (u32,u32) {
        let mut aimpl = AllocatorImpl::new(self.threshold,self.max_width,self.area);
        let mut res = Vec::<(bool,u32,u32)>::new();
        for t in &self.reqs {
            res.push(aimpl.allocate_one(t.width,t.height));
        }
        let split = aimpl.split_point();
        for (big,x,y) in res {
            println!("{:?}",(big,x,y));
            let mut val = TicketRes { x, y };
            if big {
                val.y = val.y * self.threshold;
            } else {
                val.y = val.y + split;
            }
            self.res.push(val);
        }
        let height = aimpl.total_height().next_power_of_two();
        (aimpl.width(), height)
    }
    
    pub fn position(&self,t : &Ticket) -> (u32, u32) {
        let res = self.res[t.index].clone();
        (res.x, res.y)
    }
    
    pub fn size(&self,t : &Ticket) -> (u32, u32) {
        (t.width, t.height)
    }
}

#[test]
fn half_test() {
    let mut alloc = Half::new(256);
    let input = [(100,6),(100,6),(100,6),(4,6),  (20,5), (50,1)];
    let check = [(0,0),  (100,0),(0,6),  (200,0),(100,6),(100,11)];
    for (i,(x,y)) in input.iter().enumerate() {
        let (s,t) = alloc.allocate(*x,*y).unwrap();
        println!("({}x{}) -> ({},{}) want ({},{})",x,y,s,t,check[i].0,check[i].1);
        assert_eq!((s,t),check[i]);
    }
    assert_eq!(alloc.height(),12);
}

#[test]
fn full_test() {
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
    }
}
