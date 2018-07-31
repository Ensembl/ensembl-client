use std::fmt;

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

/* A Height contains all the Tranches of a particular height.
 */

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

/* Allocation is the main wrapper class. */
pub struct Allocation {
    width: u32,
    watermark: u32,
    spaces: Vec<Height>
}

impl fmt::Display for Allocation {
    fn fmt(&self, f : &mut fmt::Formatter) -> fmt::Result {
        let strings : Vec<String> = self.spaces.iter().map(|x| x.to_string()).collect();
        let csl : String = strings.join(", ");
        write!(f, "({},{},[{}])",self.width,self.watermark,csl)
    }
}

impl Allocation {
    pub fn new(width: u32) -> Allocation {
        Allocation {
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
    
    pub fn allocate(&mut self,width: u32,height: u32) -> Option<(u32,u32)> {
        match self.alloc_space(width,height) {
            Some(space) => Some((space.x,space.y)),
            None => self.alloc_watermark(width,height)
        }
    }
    
    pub fn height(&self) -> u32 { self.watermark }
}
